var User = require('../../models/user')
var jwt = require('jsonwebtoken')
var nodemailer = require('nodemailer')
var crypto = require('crypto')
var config = require('../../../config')
var InPromise = require('../../util/inpromise.js')
var resUtil = require('../../util/resutil.js')
var valid = require('../../util/valid.js')
var validator = require('../../util/validator.js')
var msg = require('../../res/msg')

// super secret for creating tokens
var superSecret = config.secret
var tokenDuration = 1440 * 60 * 15

module.exports = function (app, express) {
    var authRouter = express.Router()

    // register user route
    authRouter.post('/register', function (req, res) {

        validator()
            .target("email")
            .required("Please input an Email")

            .target("name")
            .required("Please input a Name")
            .minLength(8, "Name must be at least 8 characters")
            .maxLength(25, "Name must be no more than 25 characters")
            .custom(object => {}, "Name already in use") // TODO verify that name is not used

            .target("password")
            .required("Please input a Password")
            .minLength(8, "Password must be at least 8 characters")
            .maxLength(25, "Password must be no more than 25 characters")

            .target("passwordconfirm")
            .required("Please repeat your Password")
            .custom(object => !object.password || object.password === object.passwordconfirm, 'Passwords do not match')

        InPromise
            .valid({
                _error: msg.USER_REGISTER_CANT_CREATE,
                email: {
                    doCheckProperty: true,
                    required: {_error: 'Please input an Email'},
                },
                name: {
                    doCheckProperty: true,
                    required: {_error: 'Please input a Name'},
                    minLength: {_value: 8, _error: 'Name must be at least 8 characters'},
                    maxLength: {_value: 25, _error: 'Name must be no more than 25 characters'}
                },
                location: {
                    doCheckProperty: true,
                    maxLength: {_value: 50, _error: 'Location must be no more than 50 characters'}
                },
                country: {
                    doCheckProperty: true,
                    required: {_error: 'Please select a Country'},
                },
                password: {
                    doCheckProperty: true,
                    required: {_error: 'Please input a Password'},
                    minLength: {_value: 8, _error: 'Password must be at least 8 characters'},
                },
                passwordconfirm: {
                    doCheckProperty: true,
                    custom: {
                        _condition: object => !object.password || object.password === object.passwordconfirm,
                        _error: 'Passwords do not match'
                    }
                }
            }, req.body)
            .then(() => {
                var user = new User()
                user.name = req.body.name
                user.email = req.body.email
                user.password = req.body.password
                user.location = req.body.location
                user.country = req.body.country
                user.admin = false
                return user
            })
            .then(user => new Promise((resolve, reject) => {
                    InPromise.mongo
                        .save({entity: user})
                        .then(resolve)
                        .catch(error => {
                            if (error.error.code == 11000) {
                                reject({_error: msg.USER_REGISTER_CANT_CREATE, email: msg.USER_REGISTER_EMAIL_TAKEN})
                            } else {
                                reject({_error: msg.USER_REGISTER_CANT_CREATE})
                            }
                        })
                })
            )
            .then(resUtil.successNoPayload(res, msg.USER_REGISTER_REGISTER_DONE))
            .catch(resUtil.error(res))
    })

    // reset password route
    authRouter.post('/reset', function (req, res) {
        InPromise.mongo
            .findOne({
                schema: User,
                criteria: {
                    resetPasswordToken: req.body.token,
                    resetPasswordExpires: {$gt: Date.now()},
                },
                errorMessage: 'Password reset link is invalid or has expired'
            })
            .then(user => {
                // TODO verify password strength
                user.password = req.body.password
                user.resetPasswordToken = undefined
                user.resetPasswordExpires = undefined
                return user
            })
            .then(user => InPromise.mongo.save({entity: user, errorMessage: "Could not reset your password."}))
            .then(resUtil.successNoPayload(res, 'Your password has been successfully updated.'))
            .catch(resUtil.error(res))
    })

    // forgot password route
    authRouter.post('/forgot', function (req, res) {
        InPromise
            .valid({
                _error: 'Could not reset your password.',
                email: {
                    doCheckProperty: true,
                    required: {_error: 'Please input an Email'},
                }
            }, req.body)
            .then(() => InPromise.wrap(crypto.randomBytes)(20))
            .then(buf => buf.toString('hex'))
            .then(token => InPromise.mongo
                .findOne({
                    schema: User,
                    criteria: {email: req.body.email},
                    errorMessage: 'No account with that email address exists.',
                    orFail: true
                })
                .then(user => ({token, user})))
            .then(pair => {
                pair.user.resetPasswordToken = pair.token
                pair.user.resetPasswordExpires = Date.now() + (3600000 * 24) // 1 hour X 24
                return pair
            })
            .then(pair => InPromise.mongo
                .save({entity: pair.user})
                .then(() => pair))
            .then(pair => {
                var smtpTransport = nodemailer.createTransport({
                    service: config.mailservice,
                    auth: {
                        user: config.mailuser,
                        pass: config.mailpass
                    }
                })
                return InPromise
                    .wrap(smtpTransport.sendMail, smtpTransport)({
                        to: req.body.email,
                        subject: 'Confirm Password Reset',
                        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your budgetsimply.io account.\n\n' +
                        'Please click on the following link to complete the reset:\n\n' +
                        'http://budgetsimply.io/#recover?token=' + pair.token + '\n\n' +
                        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                    })
            })
            .then(resUtil.successNoPayload(res, 'An e-mail has been sent to ' + req.body.email + ' with further instructions.'))
            .catch(resUtil.error(res, "Could not reset your password."))
    })

    // route to authenticate a user
    authRouter.post('/authenticate', function (req, res) {
        InPromise
            .valid({
                _error: msg.USER_LOGIN_FAILED,
                email: {
                    doCheckProperty: true,
                    required: {_error: 'Please input an Email'},
                },
                password: {
                    doCheckProperty: true,
                    required: {_error: 'Please input a Password'},
                }
            }, req.body)
            .then(() => InPromise.mongo
                .findOne({
                    schema: User,
                    criteria: {email: req.body.email},
                    select: 'name email password admin country location image',
                    errorMessage: msg.USER_LOGIN_FAILED,
                    orFail: true
                }))
            .then(user => InPromise.if(user.comparePassword(req.body.password), user, msg.USER_LOGIN_FAILED))
            .then(user => ({
                _id: user._id,
                admin: user.admin,
                email: user.email,
                name: user.name,
                country: user.country,
                location: user.location,
                image: user.image,
            }))
            .then(userDetails => ({
                userDetails,
                token: jwt.sign({userDetails}, superSecret, {expiresIn: tokenDuration})
            }))
            .then(resUtil.respond(res))
            .catch(resUtil.error(res, null, msg.USER_LOGIN_FAILED))
    })

    return authRouter
}
