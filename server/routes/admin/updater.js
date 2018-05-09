var Category = require('../../models/category')
var Image = require('../../models/image')
var UserImage = require('../../models/userImage')
var Expense = require('../../models/expense')
var Friendship = require('../../models/friendship')
var config = require('../../../config')
var InPromise = require('../../util/inpromise.js')
var resUtil = require('../../util/resutil.js')

module.exports = function (app, express) {
    var updaterRouter = express.Router()

    updaterRouter.route('/category').get(function (req, res) {
        InPromise.mongo
            .find({schema: Category})
            .then(cats => Promise.all(cats.map(cat => {
                    cat.ownerId = req.allusers.getId(cat.owner)
                    return InPromise.mongo.save({entity: cat})
                }))
            )
            .then(resUtil.success(res, 'All categories.'))
            .catch(resUtil.error(res))
    })

    updaterRouter.route('/expense').get(function (req, res) {
        InPromise.mongo
            .find({schema: Expense})
            .then(exps => Promise.all(exps.map(exp => {
                    exp.ownerId = req.allusers.getId(exp.owner)
                    if (exp.shares[0]) {
                        exp.shares[0].ownerId = req.allusers.getId(exp.shares[0].owner)
                    }
                    if (exp.shares[1]) {
                        exp.shares[1].ownerId = req.allusers.getId(exp.shares[1].owner)
                    }
                    if (exp.shares[2]) {
                        exp.shares[2].ownerId = req.allusers.getId(exp.shares[2].owner)
                    }
                    return InPromise.mongo.save({entity: exp})
                }))
            )
            .then(resUtil.success(res, 'All expenses.'))
            .catch(resUtil.error(res))
    })

    updaterRouter.route('/contact').get(function (req, res) {
        InPromise.mongo
            .find({schema: Friendship})
            .then(fshps => Promise.all(fshps.map(fshp => {
                    if (fshp.users[0]) {
                        fshp.users[0].ownerId = req.allusers.getId(fshp.users[0].email)
                    }
                    if (fshp.users[1]) {
                        fshp.users[1].ownerId = req.allusers.getId(fshp.users[1].email)
                    }
                    return InPromise.mongo.save({entity: fshp})
                }))
            )
            .then(resUtil.success(res, 'All contacts.'))
            .catch(resUtil.error(res))
    })

    updaterRouter.route('/image').get(function (req, res) {
        InPromise.mongo
            .find({schema: Image})
            .then(images => Promise.all(images.map(img => {
                    if (img.owner) {
                        img.ownerId = req.allusers.getId(img.owner)
                    }
                    return InPromise.mongo.save({entity: img})
                }))
            )
            .then(resUtil.success(res, 'All images.'))
            .catch(resUtil.error(res))
    })

    updaterRouter.route('/userimage').get(function (req, res) {
        InPromise.mongo
            .find({schema: UserImage})
            .then(images => Promise.all(images.map(img => {
                    if (img.owner) {
                        img.ownerId = req.allusers.getId(img.owner)
                    }
                    return InPromise.mongo.save({entity: img})
                }))
            )
            .then(resUtil.success(res, 'All user images.'))
            .catch(resUtil.error(res))
    })

    return updaterRouter
}