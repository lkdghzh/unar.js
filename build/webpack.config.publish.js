const path = require('path')
const webpack = require('webpack')
const DIST_JS_PATH = path.resolve(__dirname, '../dist')
const NODE_MODULES_PATH = path.resolve(__dirname, '../node_modules')
const SRC_PATH = path.resolve(__dirname, '../src')



module.exports = {
    entry: {
        entry: './mobile-fe/src/index.js'//['webpack-hot-middleware/client', ],
    },
    output: {
        path: DIST_JS_PATH,
        publicPath: '/mobile-fe/dist',
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
            exclude: /node_modules/,
            include: SRC_PATH,
            use: "babel-loader"
        }]
    },
    resolve: {
        extensions: ['.js']
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false // 在UglifyJs删除没有用到的代码时不输出警告  
            },
            comments: false, // 删除所有的注释
            except: ['exports', 'require'] //避免关键字被混淆
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: 'prod'
            }
        })
    ],
    devtool: 'eval-source-map' //这个占的打包太大，上线去掉
}