'use strict';

const path = require('path'),
    __basename = path.resolve(__dirname, '../');

module.exports = {
    path: {
        src: path.resolve(__basename, "src"),
        dist: path.resolve(__basename, "./dist")
    },
    htmlPath: '',
    imagePath: 'image',
    fontPath: 'font',
    htmlSuffix: '.html',
    publicPath: '/',
    chunkhash: "-[chunkhash:6]",
    hash: "-[hash:6]",
    contenthash: "-[contenthash:6]",
    compress: true
};
