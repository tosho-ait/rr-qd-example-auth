var Category = require('../../models/category')
var Expense = require('../../models/expense')
var Friendship = require('../../models/friendship')
var InPromise = require('../../util/inpromise.js')
var resUtil = require('../../util/resutil.js')

module.exports = function (app, express) {
    var statsRouter = express.Router()

    statsRouter.route('/get').get(function (req, res) {
        InPromise
            .do(() => ({}))
            .then(stats => InPromise.mongo.count({schema: Expense, criteria: {'ownerId': req.decoded.user._id}})
                .then(expCount => {
                    stats.ec = expCount
                    return stats
                })
            )
            .then(stats => InPromise.mongo.count({schema: Friendship, criteria: {'users.ownerId': req.decoded.user._id}})
                .then(fndCount => {
                    stats.fc = fndCount
                    return stats
                })
            )
            .then(stats => InPromise.mongo.count({schema: Category, criteria: {'ownerId': req.decoded.user._id}})
                .then(catCount => {
                    stats.cc = catCount
                    return stats
                })
            )
            .then(resUtil.success(res, 'Stats.'))
            .catch(resUtil.error(res))
    })

    return statsRouter
}