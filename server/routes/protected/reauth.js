var User = require('../../models/user')
var InPromise = require('../../util/inpromise.js')
var resUtil = require('../../util/resutil.js')
var config = require('../../../config')
var jwt = require('jsonwebtoken')
var msg = require('../../res/msg')

// super secret for creating tokens
var superSecret = config.secret
var tokenDuration = config.tokenDuration


module.exports = function (app, express) {
    let userRouter = express.Router()

    // ping to check if user is still authenticated
    userRouter.get('/ping', function (req, res) {
        InPromise
            .do(() => ({PONG: "PONG"}))
            .then(resUtil.success(res))
            .catch(resUtil.error(res))
    })

    // route to re-authenticate a user
    userRouter.post('/refresh', function (req, res) {
        InPromise.mongo
            .findOne({
                schema: User,
                criteria: {_id: req.decoded.user._id},
                select: 'name email password admin country location image',
                errorMessage: msg.LOGIN_FAILED_ERROR,
                orFail: true
            })
            .then(user => ({
                _id: user._id,
                admin: user.admin,
                email: user.email,
                name: user.name,
                image: user.image,
            }))
            .then(userDetails => ({
                userDetails,
                token: jwt.sign({userDetails}, superSecret, {expiresIn: tokenDuration})
            }))
            .then(resUtil.respond(res))
            .catch(resUtil.error(res, null, msg.LOGIN_FAILED_ERROR))
    })

    return userRouter
}
