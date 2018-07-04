var User = require('../../models/user')
var jwt = require('jsonwebtoken')
var nodemailer = require('nodemailer')
var crypto = require('crypto')
var config = require('../../../config')
var InPromise = require('../../util/inpromise.js')
var resUtil = require('../../util/resutil.js')
var validators = require('../../validators/validators.js')
var msg = require('../../res/msg')

// super secret for creating tokens
var superSecret = config.secret
var tokenDuration = 1440 * 60 * 15

module.exports = function (app, express) {
    var authRouter = express.Router()
    // register user route
    authRouter.post('/register', function (req, res) {
        InPromise
            .valid(validators.userRegister, req.body)
            .then(() => {
                var user = new User()
                user.name = req.body.name
                user.email = req.body.email
                user.password = req.body.password
                user.admin = true
                return user
            })
            .then(user => InPromise.mongo.save({entity: user, errorMessage: msg.USER_REGISTER_CANT_CREATE}))
            .then(resUtil.successNoPayload(res, msg.USER_REGISTER_REGISTER_DONE))
            .catch(resUtil.error(res))
    })
    // route to authenticate a user
    authRouter.post('/authenticate', function (req, res) {
        InPromise
            .valid(validators.userAuth, req.body)
            .then(() => InPromise.mongo
                .findOne({
                    schema: User,
                    criteria: {email: req.body.email},
                    select: 'name email password admin country location image',
                    errorMessage: "Incorrect Email or Password",
                    orFail: true
                }))
            .then(user => InPromise.if(user.comparePassword(req.body.password), user, "Incorrect Email or Password"))
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
            .catch(resUtil.error(res, null, "Incorrect Email or Password"))
    })
    return authRouter
}
