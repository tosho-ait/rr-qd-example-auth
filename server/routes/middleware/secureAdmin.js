var jwt = require('jsonwebtoken')
var config = require('../../../config')

// super secret for creating tokens
var superSecret = config.secret

module.exports = function (app, express) {
    let secAdminRouter = express.Router()

    // route middleware to verify a token
    secAdminRouter.use(function (req, res, next) {
        // do logging
        // check header or url parameters or post parameters for token
        let token = req.body.token || req.query.token || req.headers['authorization'];
        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, superSecret, function (err, decoded) {
                if (err) {
                    res.status(403).send({message: 'Failed to authenticate token.'})
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded
                    req.decoded.user = decoded.userDetails
                    next(); // make sure we go to the next routes and don't stop here
                }
            })
        } else {
            // if no token return an HTTP response of 403 and an error message
            res.status(403).send({message: 'No token provided.'})
        }
    })

    return secAdminRouter
}
