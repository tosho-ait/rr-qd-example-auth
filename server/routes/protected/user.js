var User = require('../../models/user')
var InPromise = require('../../util/inpromise.js')
var resUtil = require('../../util/resutil.js')
var valid2 = require('../../util/valid2.js')
var config = require('../../../config')
var validators = require('../../validators/validators.js')

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
            .then(user => valid2(validators.userUpdate, req.body, {user}).then(() => user))
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
    return userRouter
}
