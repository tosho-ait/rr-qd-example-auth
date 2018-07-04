var User = require('../../models/user')
var InPromise = require('../../util/inpromise.js')
var resUtil = require('../../util/resutil.js')

module.exports = function (app, express) {
    var adminRouter = express.Router()

    adminRouter.get('/users', function (req, res) {
        InPromise.mongo
            .find({schema: User, errorMessage: 'Could not list users.'})
            .then(resUtil.success(res, 'All users.'))
            .catch(resUtil.error(res))
    })

    return adminRouter
}
