var User = require('../../models/user')
var InPromise = require('../../util/inpromise.js')
var resUtil = require('../../util/resutil.js')
var config = require('../../../config')
var validators = require('../../validators/validators.js')
var msg = require('../../res/msg')


module.exports = function (app, express) {
    let userRouter = express.Router()

    userRouter.post('/update', function (req, res) {
        InPromise.mongo
            .findOne({
                schema: User,
                criteria: {'_id': req.decoded.user._id},
                errorMessage: msg.USER_UPDATE_FAILED,
                orFail: true
            })
            .then(user => InPromise.valid(validators.userUpdate, req.body, {user}).then(() => user))
            .then(user => {
                user.name = req.body.name
                if (req.body.password) {
                    user.password = req.body.password
                }
                user.image = req.body.image
                return user
            })
            .then(user => InPromise.mongo.save({entity: user, errorMessage: msg.USER_UPDATE_FAILED}))
            .then(resUtil.successNoPayload(res, msg.USER_UPDATE_DONE))
            .catch(resUtil.error(res))
    })

    return userRouter
}
