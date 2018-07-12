var User = require('../../models/user')
var InPromise = require('../../util/inpromise.js')
var resUtil = require('../../util/resutil.js')
var msg = require('../../res/msg')


module.exports = function (app, express) {
    let adminRouter = express.Router()

    adminRouter.get('/users', function (req, res) {
        InPromise.mongo
            .find({schema: User, errorMessage: msg.OP_FAILED})
            .then(resUtil.success(res, msg.OP_DONE))
            .catch(resUtil.error(res))
    })

    // confirm email route
    adminRouter.post('/activateUser', function (req, res) {
        InPromise.mongo
            .findOne({
                schema: User,
                criteria: {
                    _id: req.body.userId,
                },
                orFail: true,
                errorMessage: msg.OP_FAILED
            })
            .then(user => {
                user.active = true
                return user
            })
            .then(user => InPromise.mongo.save({entity: user, errorMessage: msg.OP_FAILED}))
            .then(resUtil.successNoPayload(res, msg.OP_DONE))
            .catch(resUtil.error(res))
    })

    // confirm email route
    adminRouter.post('/deactivateUser', function (req, res) {
        InPromise.mongo
            .findOne({
                schema: User,
                criteria: {
                    _id: req.body.userId,
                },
                orFail: true,
                errorMessage: msg.OP_FAILED
            })
            .then(user => {
                user.active = false
                return user
            })
            .then(user => InPromise.mongo.save({entity: user, errorMessage: msg.OP_FAILED}))
            .then(resUtil.successNoPayload(res, msg.OP_DONE))
            .catch(resUtil.error(res))
    })

    return adminRouter
}
