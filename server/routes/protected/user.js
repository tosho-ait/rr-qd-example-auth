var User = require('../../models/user')
var InPromise = require('../../util/inpromise.js')
var resUtil = require('../../util/resutil.js')
var valid = require('../../util/valid.js')
var msg = require('../../res/msg')
var config = require('../../../config')
var jwt = require('jsonwebtoken')

// super secret for creating tokens
var superSecret = config.secret
var tokenDuration = 1440 * 60 * 15

module.exports = function (app, express) {
    var userRouter = express.Router()

    userRouter.post('/update', function (req, res) {
        InPromise.mongo
            .findOne({
                schema: User,
                criteria: {'_id': req.decoded.user._id},
                errorMessage: 'Could not update your Account',
                orFail: true
            })
            .then(user => valid({
                    _error: 'Could not update your Account',
                    name: {
                        doCheckProperty: true,
                        required: {_error: 'Please input a Name'},
                        minLength: {_value: 8, _error: 'Name must be at least 8 characters'},
                        maxLength: {_value: 25, _error: 'Name must be no more than 25 characters'}
                    },
                    password: {
                        doCheckProperty: true,
                        minLength: {_value: 8, _error: 'Password must be at least 8 characters'},
                    },
                    passwordconfirm: {
                        doCheckProperty: true,
                        custom: {
                            _condition: object => !object.password || object.password === object.passwordconfirm,
                            _error: 'Passwords do not match'
                        }
                    },
                    oldpassword: {
                        doCheckProperty: true,
                        custom: {
                            _condition: object => !object.password || (object.oldpassword && user.comparePassword(object.oldpassword)),
                            _error: 'Incorrect password'
                        }
                    }
                }, req.body).then(() => user)
            )
            .then(user => {
                user.name = req.body.name
                if (req.body.password) {
                    user.password = req.body.password
                }
                user.image = req.body.image
                return user
            })
            .then(user => InPromise.mongo.save({entity: user, errorMessage: 'Could not update your Account'}))
            .then(resUtil.successNoPayload(res, 'Account updated'))
            .catch(resUtil.error(res))
    })

    userRouter.get('/ping', function (req, res) {
        InPromise
            .do(() => ({
                PONG: "PONG"
            }))
            .then(resUtil.success(res, 'All users.'))
            .catch(resUtil.error(res))
    })

    // route to re-authenticate a user
    userRouter.post('/refresh', function (req, res) {
        InPromise.mongo
            .findOne({
                schema: User,
                criteria: {_id: req.decoded.user._id},
                select: 'name email password admin country location image',
                errorMessage: msg.USER_LOGIN_FAILED,
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
            .catch(resUtil.error(res, null, msg.USER_LOGIN_FAILED))
    })
    return userRouter
}
