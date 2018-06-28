var User = require('../../models/user')
var jwt = require('jsonwebtoken')
var nodemailer = require('nodemailer')
var crypto = require('crypto')
var config = require('../../../config')
var InPromise = require('../../util/inpromise.js')
var resUtil = require('../../util/resutil.js')
var valid = require('../../util/valid.js')
var msg = require('../../res/msg')

module.exports = function (app, express) {
    var recoverRouter = express.Router()

    // reset password route
    recoverRouter.post('/reset', function (req, res) {
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
    recoverRouter.post('/forgot', function (req, res) {
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

    return recoverRouter
}
