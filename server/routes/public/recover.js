var User = require('../../models/user')
var jwt = require('jsonwebtoken')
var nodemailer = require('nodemailer')
var crypto = require('crypto')
var config = require('../../../config')
var InPromise = require('../../util/inpromise.js')
var resUtil = require('../../util/resutil.js')
var validators = require('../../validators/validators.js')
var msg = require('../../res/msg')

module.exports = function (app, express) {
    let recoverRouter = express.Router()

    // reset password route
    recoverRouter.post('/reset', function (req, res) {
        InPromise.mongo
            .findOne({
                schema: User,
                criteria: {
                    resetPasswordToken: req.body.token,
                    resetPasswordExpires: {$gt: Date.now()},
                },
                orFail: true,
                errorMessage: 'Password reset link is invalid or has expired'
            })
            .then(user => InPromise.valid(validators.passwordReset, req.body).then(() => user))
            .then(user => {
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
    recoverRouter.post('/forgot', function (req, res) {
        InPromise
            .valid(validators.passwordRecover, req.body)
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
            .then(pair => InPromise.util.sendmail({
                service: config.mailservice,
                user: config.mailuser,
                pass: config.mailpass,
                to: req.body.email,
                subject: config.userPwdResetMailSubject,
                text: config.userPwdResetMailText(pair.token)
            }))
            .then(resUtil.successNoPayload(res, 'An email has been sent to ' + req.body.email + ' with further instructions.'))
            .catch(resUtil.error(res, null, "Could not reset your password."))
    })

    return recoverRouter
}
