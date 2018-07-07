var User = require('../../models/user')
var InPromise = require('../../util/inpromise.js')
var resUtil = require('../../util/resutil.js')

module.exports = function (app, express) {
    let adminRouter = express.Router()

    adminRouter.get('/users', function (req, res) {
        InPromise.mongo
            .find({schema: User, errorMessage: 'Could not list users.'})
            .then(resUtil.success(res, 'All users.'))
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
                errorMessage: 'Operation failed'
            })
            .then(user => {
                user.active = true
                return user
            })
            .then(user => InPromise.mongo.save({entity: user, errorMessage: "Operation failed"}))
            .then(resUtil.successNoPayload(res, 'Done'))
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
                errorMessage: 'Operation failed'
            })
            .then(user => {
                user.active = false
                return user
            })
            .then(user => InPromise.mongo.save({entity: user, errorMessage: "Operation failed"}))
            .then(resUtil.successNoPayload(res, 'Done'))
            .catch(resUtil.error(res))
    })

    return adminRouter
}
