//配置访问入口
module.exports = [
    {module:'error', js: [], tpl: '404', output: {html: 'error/404', name: 'err_404', js: false, css: true}, 'uri': 'error/'},
    {module:'error', js: [], tpl: 'error', output: {html: 'error/error', name: 'error', js: false, css: true}, 'uri': 'error/'},
    {module:'layout', js: ['/entry'], title: '运营平台'}
];