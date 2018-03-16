const fs = require('fs');

if(!fs.existsSync('./developer_conf.js')){
    fs.writeFileSync('./developer_conf.js', `module.exports = {
    proxyTarget: {
    }
};`);
}

const httpProxyMiddleware = require('http-proxy-middleware');

const DeveloperConfig = require('./developer_conf');
const ProxyTarget = DeveloperConfig.proxyTarget;
const ProxyRegex = /\.(?:json|act|html)($|\?)/;

let page, proxyCount = 0;

const proxyServers = {};

for(let content in ProxyTarget){
    if(ProxyTarget.hasOwnProperty(content)){
        console.log('Proxy: '+content+' => ' + ProxyTarget[content]);
        proxyServers[content] = httpProxyMiddleware(content === '/'?'**':content.slice(0, -1), {
            target: ProxyTarget[content],
            changeOrigin: true,
            secure: false,
            logLevel: 'warn',
            content: content
        });
        proxyCount++;
    }
}

console.log('');

function proxy(req){
    for(let content in ProxyTarget){
        if(ProxyTarget.hasOwnProperty(content)){
            if(req.url.indexOf(content) === 0){
                return proxyServers[content];
            }
        }
    }
}

function replaceUrl(url){
    url = url.split('#')[0];
    url = url.split('?')[0];
    let filename = url.substr(url.lastIndexOf('/') + 1);
    [file, ext] = filename.split('.', 2);
    if(file && ext){
        return url;
    }
    let match = url.match(/\/(.*?)(?:\/|$)/);
    if(match){
        if(match[1]){
            let tpl = page.uri[match[1]];
            if(tpl){
                return '/' + tpl + '.htm';
            }else{
                return '/layout.htm';
            }
        }
    }
    return '/index.htm';
}

function byPass(req, res, next){
    if(req.url.slice(-16) === '.hot-update.json'){
        next();
    }else if(ProxyRegex.test(req.url)){
        proxy(req)(req, res, next);
    }else{
        req.url = replaceUrl(req.url);
        next();
    }
}

module.exports = function(p){
    page = p;
    return (app) => {
        if(!proxyCount){
            return;
        }
        app.use((req, res, next) => {
            byPass(req, res, next);
        });
    };
};