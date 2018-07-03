var User = require('../../models/user')
var jwt = require('jsonwebtoken')
var nodemailer = require('nodemailer')
var crypto = require('crypto')
var config = require('../../../config')
var InPromise = require('../../util/inpromise.js')
var resUtil = require('../../util/resutil.js')
var validator = require('../../util/validator.js')
var msg = require('../../res/msg')

// super secret for creating tokens
var superSecret = config.secret
var tokenDuration = 1440 * 60 * 15

let checksRegister = validator()
    .target("email")
    .generalError("Could not create user")
    .required("Please input an Email")
    .custom(object => object.email
            ? InPromise.mongo
            .findOne({
                schema: User, criteria: {email: object.email}
            }).then(result => result === null)
            : true
        , "Email already in use")
    .target("name")
    .required("Please input a Name")
    .minLength(8, "Name must be at least 8 characters")
    .maxLength(25, "Name must be no more than 25 characters")
    .target("password")
    .required("Please input a Password")
    .minLength(8, "Password must be at least 8 characters")
    .maxLength(25, "Password must be no more than 25 characters")
    .target("passwordconfirm")
    .required("Please repeat your Password")
    .custom(object => !object.password || object.password === object.passwordconfirm, 'Passwords do not match')
    .build()

let checksAuthenticate = validator()
    .target("email")
    .generalError("Incorrect Email or Password")
    .required("Please input an Email")
    .target("password")
    .required("Please input a Password")
    .build()

module.exports = function (app, express) {
    var authRouter = express.Router()

    // register user route
    authRouter.post('/register', function (req, res) {
        InPromise
            .valid2(checksRegister, req.body)
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
            .valid2(checksAuthenticate, req.body)
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
