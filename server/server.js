var bodyParser = require('body-parser')
var morgan = require('morgan')
var express = require('express')
var multer = require('multer')

module.exports = function (express, config) {

    var app = express()

    require('mongoose').connect(config.database)

    // APP CONFIGURATION
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())

    // configure app to handle CORS requests
    app.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization')
        next()
    })

    // log all requests to the console
    app.use(morgan('dev'))

    // ROUTES CONSTRUCTOR
    var construct = require('./construct/construct')(app, express)

    // MIDDLEWARE
    var SECURE_MW = construct.addMiddleware(require('./routes/middleware/secure'))
    var ALL_USERS_MW = construct.addMiddleware(require('./routes/middleware/usersMw'))

    // PUBLIC ROUTES
    construct.addRoutes([],
        '/api/auth', require('./routes/public/auth'))

    construct.addRoutes([],
        '/api/recover', require('./routes/public/recover'))

    construct.addRoutes([],
        '/api/img', require('./routes/public/image'))

    construct.addRoutes([SECURE_MW],
        '/api/user', require('./routes/protected/user'))

    construct.addRoutes([SECURE_MW],
        '/api/reauth', require('./routes/protected/reauth'))

    // Admin ROUTES
    // TODO to be secured
    construct.addRoutes([SECURE_MW, ALL_USERS_MW],
        '/api/admin', require('./routes/admin/admin'))

    // handle multipart requests
    app.use(multer({
        storage: multer.memoryStorage(),
        limits: {
            fileSize: 5 * 1024 * 1024
        }
    }).single('file'))

    construct.addRoutes([SECURE_MW],
        '/api/upload', require('./routes/protected/upload'))

    return app
}
