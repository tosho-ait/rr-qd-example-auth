var InPromise = require('../../util/inpromise.js')
var resUtil = require('../../util/resutil.js')

module.exports = function (app, express) {
    var listsRouter = express.Router()

    listsRouter.post('/get', function (req, res) {
        var listName = req.body.listName
        if (listName == 'country') {
            InPromise
                .do(() => req.lists[listName])
                .then(resUtil.success(res, 'List'))
                .catch(resUtil.error(res))
        } else {
            res.status(418).json({errorMessage: 'Internal Error!'})
        }
    })

    return listsRouter
}