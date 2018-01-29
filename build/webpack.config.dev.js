const path = require('path')
const webpack = require('webpack')
const htmlWebpackPlugin = require('html-webpack-plugin')

const DIST_JS_PATH = path.resolve(__dirname, '../dist')
const NODE_MODULES_PATH = path.resolve(__dirname, '../node_modules')
const SRC_PATH = path.resolve(__dirname, '../src')

const TPL_PATH = path.resolve(__dirname, '../examples/index.ejs')
//默认 express服务器 ip port publicPath index.html
//dev环境下，生成的html和js ，在同级目录下（这里dist,防止publicPath是../相对路径）
const DIST_HTML_PATH = path.resolve(__dirname, '../dist/index.html')

module.exports = {
    entry: {
        Unar: ['webpack-hot-middleware/client', './src/index.js']
    },
    output: {
        path: DIST_JS_PATH,
        publicPath: '/',
        filename: '[name].js'
    },
    module: {
        rules: [{
                test: /\.js$/,
                enforce: 'pre',
                exclude: NODE_MODULES_PATH,
                include: SRC_PATH,
                use: "eslint-loader"
            },
            {
                test: /\.js$/,
                exclude: NODE_MODULES_PATH,
                include: SRC_PATH,
                use: "babel-loader"
            },
            {
                test: /\.ts$/,
                exclude: NODE_MODULES_PATH,
                include: SRC_PATH,
                use: 'ts-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.js','ts']
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            beautify: true,
            // compress: {
            //     warnings: false // 在UglifyJs删除没有用到的代码时不输出警告  
            // },
            comments: false, // 删除所有的注释
            mangle: {
                except: ['Unar'] //避免关键字被混淆
            }
        }),
        new htmlWebpackPlugin({
            filename: DIST_HTML_PATH,
            template: TPL_PATH,
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
    devtool: 'eval-source-map' //这个占的打包太大，上线去掉
}