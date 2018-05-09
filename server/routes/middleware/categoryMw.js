var Category = require('../../models/category')

module.exports = function (app, express) {
    var categoryMw = express.Router()

    categoryMw.use(function (req, res, next) {
        if (req.decoded && req.decoded.user && req.decoded.user._id) {
            Category.find({'ownerId': req.decoded.user._id}, function (err, all) {
                if (err) {
                    res.status(418).json({message: "Internal error!"})
                } else {
                    req.mycats = all
                    next()
                }
            })
        } else {
            next()
        }
    })
    return categoryMw
}
