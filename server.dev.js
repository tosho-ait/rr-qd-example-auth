var express = require('express')
var config = require('./config')
var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var wconfig = require('./webpack.dev')

var app = require('./server/server')(express, config)

app.use('/uploads', express.static(__dirname + '/uploads'))

var compiler = webpack(wconfig)

app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    reload: true,
    publicPath: wconfig.output.publicPath,
    watchOptions: {aggregateTimeout: 100, poll: false}
}))

app.use(webpackHotMiddleware(compiler))

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html')
})

app.listen(config.port, function (error) {
    if (error) {
        console.error(error)
    } else {
        console.info("Listening on port %s. ", config.port)
    }
})

