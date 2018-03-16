const modulePath = './src/module';
const pageMapping = require(modulePath + '/config');

const fs = require('fs');

const collectPage = function(){
    let dirs = fs.readdirSync(modulePath);
    dirs.forEach((dir) =>{
        let info = fs.statSync(modulePath + "/" + dir);
        if(info.isDirectory()){
            if(fs.existsSync(modulePath + "/" + dir + '/config.js')){
                let config = require(modulePath + "/" + dir + '/config.js');
                config.forEach((item) =>{
                    if(!item.module){
                        item.module = dir;
                    }
                    pageMapping.push(item);
                });
            }
        }
    });
};

const fillConfig = function(config){
    const page = {chunks: {'comm.js': {}}, output: {}};
    if(typeof config === 'string'){
        page.module = config;
        return page;
    }

    if(!config.module){
        console.log("\nError: page.module not define");
        process.exit();
    }

    for(let key in config){
        if(config.hasOwnProperty(key)){
            page[key] = config[key];
        }
    }

    return page;
};

const parsePageMapping = function(config){
    let page = {chunks: {'comm.js': {}}, output: {}};
    let entry = {};
    let uri = {};

    config = fillConfig(config);

    entry.name = config.output.name || config.module;
    entry.js = config.js || 'index.js';

    page.module = config.module;
    page.base = typeof config.output.base === 'undefined'? config.module: config.output.base;
    page.chunks[(config.output.name || config.module) + '.js'] = {};
    page.html = config.output.html || entry.name;
    page.tpl = config.tpl || '/layout';
    page.output.js = typeof config.output.js === 'undefined' || config.output.js;
    page.output.css = typeof config.output.css === 'undefined' || config.output.css;

    if(page.tpl.indexOf('/') !== 0){
        page.tpl = '/' + config.module + '/' + page.tpl;
    }
    page.tpl += '.tpl';

    if(page.html.indexOf('/') !== 0){
        page.html = '/' + page.html;
    }

    page.title = config.title || '';

    uri[config.uri || page.module] = page.html;

    return {page, entry, uri};
};

module.exports = function(config, mode){
    collectPage();

    let parsed = {
        page: [],
        entry: {},
        uri: {}
    };

    for(let i = 0, l = pageMapping.length; i < l; i++){
        let res = parsePageMapping(pageMapping[i]);
        let js = typeof res.entry.js === 'string'? [res.entry.js]: res.entry.js;

        js.map((s, i) =>{
            if(s && s.indexOf('/') === 0){
                js[i] = config.path.src + '/module' + s;
            }else{
                js[i] = config.path.src + '/module/' + res.page.module + '/' + s;
            }
        });
        js.unshift(config.path.src + '/env_config/config_' + mode + '.js');

        res.page.tpl = config.path.src + '/tpl' + res.page.tpl;
        parsed.entry[res.entry.name] = js;
        if(!js.length){
            res.page.chunks = {};
        }
        for(let key in res.uri){
            parsed.uri[key] = res.uri[key];
        }
        parsed.page.push(res.page);
    }
    // console.log(parsed.page);
    // process.exit();

    return parsed;
};