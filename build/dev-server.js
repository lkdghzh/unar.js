// 引入必要的模块
var express = require('express')
var webpack = require('webpack')
var config = require('./webpack.config.dev')
var path =require('path')
var fs = require('fs')

// 创建一个express实例
var app = express()

// 调用webpack并把配置传递过去
var compiler = webpack(config)

// 使用 webpack-dev-middleware 中间件
var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: config.output.publicPath
});

// 注册dev中间件
app.use(devMiddleware);
//hot reload
app.use(require("webpack-hot-middleware")(compiler));


app.get('/start', function(req, res){
    res.redirect("/dist/index.html")
});

// 监听 9000端口，开启服务器
app.listen(9000, function (err) {
    if (err) {
        console.log(err)
        return
    }
    console.log('Listening at http://localhost:9000')
})