// const webpack = require('webpack')
// const ConcatPlugin = require('webpack-concat-plugin');

// const path = require('path')
// const DIST_JS_PATH = path.resolve(__dirname, '../dist')
// const NODE_MODULES_PATH = path.resolve(__dirname, '../node_modules')
// const SRC_PATH = path.resolve(__dirname, '../src')

// module.exports = {
//     entry: {
//         Unar: './src/Instance/index.js',
//     },
//     output: {
//         path: DIST_JS_PATH,
//         publicPath: '../dist',
//         filename: '[name].env.js'
//     },
//     module: {
//         rules: [{
//                 test: /\.js$/,
//                 enforce: 'pre',
//                 exclude: NODE_MODULES_PATH,
//                 include: SRC_PATH,
//                 use: "eslint-loader"
//             }
//         ]
//     },
//     resolve: {
//         extensions: ['.js']
//     },
//     plugins: [
//         new ConcatPlugin({
//             // filesToConcat :[
//             //     SRC_PATH
//             // ]
//         })
//     ]
// }