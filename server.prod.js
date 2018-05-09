var express = require('express')
var morgan = require('morgan')
var config = require('./config')

var app = require('./server/server')(app, express, config)

app.use('/static', express.static(__dirname + '/dist'))
app.use('/uploads', express.static(__dirname + '/uploads'))

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/dist/index.html')
})

app.listen(config.port, function (error) {
    if (error) {
        console.error(error)
    } else {
        console.info("Listening on port %s. ", config.port)
    }
})

