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
    var LISTS_MW = construct.addMiddleware(require('./routes/middleware/listsMw'))

    // PUBLIC ROUTES
    construct.addRoutes([],
        '/api/auth', require('./routes/public/auth'))

    construct.addRoutes([],
        '/api/usrimg', require('./routes/public/userImage'))

    construct.addRoutes([LISTS_MW],
        '/api/publiclists', require('./routes/public/lists'))

    // PRIVATE ROUTES
    construct.addRoutes([SECURE_MW, LISTS_MW],
        '/api/lists', require('./routes/protected/lists'))

    construct.addRoutes([SECURE_MW],
        '/api/user', require('./routes/protected/user'))

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

    app.use('/api/upload', require('./routes/protected/upload')(app, express))

    return app
}
