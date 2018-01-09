const path = require('path')
const webpack = require('webpack')
const DIST_JS_PATH = path.resolve(__dirname, '../dist')
const NODE_MODULES_PATH = path.resolve(__dirname, '../node_modules')
const SRC_PATH = path.resolve(__dirname, '../src')

module.exports = {
    entry: {
        entry: './src/Instance/index.js'//['webpack-hot-middleware/client', ],
    },
    output: {
        path: DIST_JS_PATH,
        filename: 'js/[name].[hash].js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            enforce: 'pre',
            exclude: NODE_MODULES_PATH,
            include: SRC_PATH,
            use: "eslint-loader"
        }, {
            test: /\.js$/,
            exclude: NODE_MODULES_PATH,
            include: SRC_PATH,
            use: "babel-loader"
        }]
    },
    resolve: {
        extensions: ['.js']
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: 'dev'
            }
        })
    ]
    //devtool: 'eval-source-map' //这个占的打包太大，上线去掉
}