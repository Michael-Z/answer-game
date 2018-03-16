const path = require('path');
const webpack = require('webpack');
const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
const ModuleConcatenationPlugin = require("webpack/lib/optimize/ModuleConcatenationPlugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlResWebpackPlugin = require('html-res-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const AddNginxIni = require('./addNginxIni');
const DevServerByPass = require('./devServerByPass');

const modeMap = {
    'debugging': 'dev',
    'test': 'test',
    'production': 'prod',
    'development': 'dev'
};
const mode = modeMap[process.env.NODE_ENV];
const config = require('./build_config/build_' + mode + '.js');
const page = require('./entry.parser')(config, mode);

const cssLoader = function(test, suffix, options){
    const loader = {
        "test": test
    };

    const use = [
        {
            loader: 'css-loader',
            options: {importLoaders: 1} //这里可以简单理解为，如果css文件中有import 进来的文件也进行处理
        },
        {
            loader: 'postcss-loader',
            options: {           // 如果没有options这个选项将会报错 No PostCSS Config found
                plugins: (loader) =>{
                    const ps = [
                        require('postcss-import')({root: loader.resourcePath}),
                        require('precss')(),
                        require('autoprefixer')({browsers: 'last 5 version'}) //CSS浏览器兼容
                    ];
                    if(config.compress){
                        ps.push(require('cssnano')({safe: true}));//压缩css
                    }
                    return ps;
                }
            }
        }
    ];
    if(suffix){
        use.push({
            loader: suffix,
            options: options || {}
        });
    }
    if(config.compress){
        loader.loader = ExtractTextPlugin.extract({fallback: 'style-loader', use: use})
    }else{
        use.unshift({
            loader: 'style-loader',
            options: {}
        });
        loader.use = use;
    }
    return loader;
};

const webpackConfig = {
    entry: page.entry,
    output: {
        path: config.path.dist,
        publicPath: config.publicPath,
        filename: "js/[name]" + config.chunkhash + ".js",
        chunkFilename: "js/[chunkhash:8]_[id].js"
    },
    externals: {},
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        modules: [
            "node_modules"
        ],
        alias: {
            '@': path.resolve(__dirname, './src/')
        }
    },
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: [
                        cssLoader(/\.(sass|scss)$/, 'sass-loader')
                    ]
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.js6$/,
                loader: 'babel-loader'
            },
            cssLoader(/\.(less)$/, 'less-loader'),
            cssLoader(/\.(sass|scss)$/, 'sass-loader'),
            cssLoader(/\.(css)$/, ''),
            {
                test: /\.(html|tpl)$/,
                loader: 'html-loader'
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/i,
                loader: 'file-loader?name=' + config.fontPath + '/[name].[ext]'
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                loaders: [
                    //'image-webpack-loader?{optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}, mozjpeg: {quality: 65}}',
                    'url-loader?limit=1024&name=' + config.imagePath + '/[name].[ext]'
                ]
            }
        ]
    },
    plugins: [
        new ModuleConcatenationPlugin(),
        new CommonsChunkPlugin({
            filename: 'js/comm' + config.chunkhash + '.js',
            name: 'comm',
            minChunks: 2
        }),
        new ExtractTextPlugin({
            'filename': 'css/[name]' + config.contenthash + '.css',
            allChunks: true
        })
    ]
};

const htmlMinify = {
    removeComments: config.compress,
    collapseWhitespace: config.compress
};

const addPlugins = function(plugin, ...param){
    webpackConfig.plugins.push(new plugin(...param));
};

addPlugins(webpack.optimize.OccurrenceOrderPlugin);

if(process.env.NODE_ENV !== 'debugging'){
    addPlugins(CleanPlugin, config.path.dist);
    addPlugins(AddNginxIni, config, page.uri, '/layout');
    //webpackConfig.devtool = '#eval-source-map';
}else{
    webpackConfig.devtool = '#eval-source-map';
}

addPlugins(webpack.DefinePlugin, {
    'process.env': {
        NODE_ENV: process.env.NODE_ENV === 'production'? '"production"': '"debugging"'
    }
});

if(config.compress){
    addPlugins(webpack.optimize.UglifyJsPlugin, {
        compress: {
            warnings: false,
            drop_debugger: true,
            drop_console: true
        }
    });
}

page.page.forEach(function(page){
    let chunks = {};

    Object.keys(page.chunks).forEach(c =>{
        if(page.output.js){
            chunks[c] = {};
        }
        if(page.output.css){
            chunks[c.replace('.js', '.css')] = {res: ''};
        }
    });

    addPlugins(HtmlResWebpackPlugin, {
        filename: config.htmlPath + page.html + config.htmlSuffix,
        template: page.tpl,
        chunks: chunks,
        htmlMinify: htmlMinify,
        inject: true,
        favicon: "./src/assets/favicon.ico",
        templateContent(tpl){
            // tpl = tpl.replace("{{block 'cssPlace'}}<head>", "{{block 'cssPlace'}}");
            // tpl = tpl.replace("</head>{{/block}}", "{{/block}}");
            //
            // tpl = tpl.replace("{{block 'jsPlace'}}<body>", "{{block 'jsPlace'}}");
            // tpl = tpl.replace("</body>{{/block}}", "{{/block}}");
            tpl = tpl.replace('{{tpl_base_url}}', page.base);
            tpl = tpl.replace('{{title}}', page.title || '未命名页面');
            return tpl;
        }
    });
});

const matched = config.publicPath.match(/\/\/([^:\/]*):?([^\/]*)/) || [];

webpackConfig.devServer = {
    noInfo: true,
    before: DevServerByPass(page),
    host: matched[1] || '127.0.0.1',
    port: matched[2] || '8081',
    contentBase: config.path.dist,
    headers: {"Access-Control-Allow-Origin": "*"},
    hot: true,
    inline: true
};

module.exports = webpackConfig;