'use strict';

const path = require('path'),
    __basename = path.resolve(__dirname, '../');
const ip = require('ip');

module.exports = {
    path: {
        src: path.resolve(__basename, "src"),
        dist: path.resolve(__basename, "./dist")
    },
    htmlPath: '',
    imagePath: 'game_static/image',
    fontPath: 'game_static/font',
    htmlSuffix: '.htm',
    publicPath: '//'+ip.address()+':8000/',
    //publicPath: '//127.0.0.1:8000/',
    chunkhash: "",
    hash: "",
    contenthash: "",
    compress: false
};
