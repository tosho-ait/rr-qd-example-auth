var User = require('../../models/user')
var Login = require('../../models/login')
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
var tokenDuration = config.tokenDuration


module.exports = function (app, express) {
    let authRouter = express.Router()

    // register user route
    authRouter.post('/register', function (req, res) {
        InPromise
            .valid(validators.userRegister, req.body)
            .then(() => {
                let user = new User()
                user.name = req.body.name
                user.email = req.body.email
                user.password = req.body.password
                user.active = config.userActiveOnRegister
                user.mailVerified = !config.userVerifyMailOnRegister
                return user
            })
            .then(user => {
                if (config.userVerifyMailOnRegister) {
                    return InPromise
                        .do(() => InPromise.wrap(crypto.randomBytes)(20))
                        .then(buf => buf.toString('hex'))
                        .then(token => {
                            user.mailVerifyToken = token
                            return token
                        })
                        .then(token => InPromise.util.sendmail({
                            service: config.mailservice,
                            user: config.mailuser,
                            pass: config.mailpass,
                            to: req.body.email,
                            subject: config.userVerifyMailSubject,
                            text: config.userVerifyMailText(token)
                        }))
                        .then(() => user)
                } else {
                    return user
                }
            })
            .then(user => InPromise.mongo.save({entity: user, errorMessage: msg.USER_REGISTER_FAILED}))
            .then(resUtil.successNoPayload(res, config.userVerifyMailOnRegister
                ? msg.USER_RESET_DONE_CONFIRMMAIL
                : msg.USER_REGISTER_DONE ))
            .catch(resUtil.error(res))
    })

    // confirm email route
    authRouter.post('/confirm', function (req, res) {
        InPromise.mongo
            .findOne({
                schema: User,
                criteria: {
                    mailVerifyToken: req.body.token,
                },
                orFail: true,
                errorMessage: msg.USER_CONFIRMMAIL_FAILED
            })
            .then(user => {
                user.mailVerifyToken = undefined
                user.mailVerified = true
                return user
            })
            .then(user => InPromise.mongo.save({entity: user, errorMessage: msg.USER_CONFIRMMAIL_FAILED}))
            .then(resUtil.successNoPayload(res, msg.USER_CONFIRMMAIL_DONE))
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
                    select: 'name email password admin country location image active',
                    errorMessage: msg.LOGIN_FAILED,
                    orFail: true
                }))
            .then(user => InPromise.if(user.comparePassword(req.body.password), user, msg.LOGIN_FAILED))
            .then(user => {
                if(!user.active){
                    throw msg.LOGIN_INACTIVE
                }
                return user
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
            .then(response => InPromise
                .do(()=> {
                    let login = new Login()
                    login.ownerId = response.userDetails._id
                    login.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
                    login.agent = req.headers['user-agent']
                    login.token = response.token
                    return login
                })
                .then(login => InPromise.mongo.save({entity: login, errorMessage: msg.LOGIN_FAILED_ERROR}))
                .then(() => response)
            )
            .then(resUtil.respond(res))
            .catch(resUtil.error(res, null, msg.LOGIN_FAILED))
    })

    return authRouter
}
