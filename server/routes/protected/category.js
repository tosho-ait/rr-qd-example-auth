var Category = require('../../models/category')
var Expense = require('../../models/expense')
var config = require('../../../config')
var InPromise = require('../../util/inpromise.js')
var resUtil = require('../../util/resutil.js')

module.exports = function (app, express) {
    var categoryRouter = express.Router()

    categoryRouter.route('/add').post(function (req, res) {
        InPromise
            .valid({
                _error: 'Could not save category.',
                label: {
                    doCheckProperty: true,
                    required: {_error: 'Please input a Label'},
                },
                _id: {
                    doCheckProperty: true,
                    custom: {
                        _condition: object => {
                            if (object._id) {
                                return InPromise.mongo
                                    .findOne({schema: Category, criteria: {_id: req.body._id}, orFail: true})
                                    .then(cat => cat.ownerId == req.decoded.user._id)
                            } else {
                                return true
                            }
                        },
                        _error: 'Not your Category'
                    }
                },
            }, req.body)
            .then(() => ({
                _id: req.body._id,
                label: req.body.label,
                subcats: req.body.subcats,
                toDelete: req.body.toDelete,
                delCat: req.body.delCat,
                delSubcat: req.body.delSubcat,
            }))
            .then(cat => {
                var deleteJobs = []
                var subcatsToKeep = []
                cat.subcats && cat.subcats.map(subcat => {
                    if (subcat.toDelete) {
                        // find all expenses and set them to the new cat/subcat before deleting the subcat
                        deleteJobs.push(
                            InPromise.mongo
                                .find({
                                    schema: Expense,
                                    criteria: {
                                        'shares.subcat': subcat._id,
                                        ownerId: req.decoded.user._id
                                    }
                                })
                                .then(expenses => Promise.all( // resolve when all saves are done
                                    expenses.map(exp => {
                                        exp.shares.map(share => {
                                            if (share.subcat == subcat._id) {
                                                share.cat = subcat.delCat
                                                share.subcat = subcat.delSubcat
                                            }
                                        })
                                        // return .map()
                                        return InPromise.mongo.save({entity: exp, errorMessage: "Could not update Category"})
                                    })
                                ))
                        )
                    } else {
                        subcatsToKeep.push(subcat)
                    }
                })
                return Promise.all(deleteJobs).then(() => Object.assign(cat, {subcats: subcatsToKeep}))
            })
            .then(cat => {
                cat.owner = req.decoded.user.email
                cat.ownerId = req.decoded.user._id
                if (cat._id) {
                    if (cat.toDelete) {
                        // find all expenses and set them to the new cat/subcat before deleting the cat
                        return InPromise.mongo
                            .find({
                                schema: Expense,
                                criteria: {
                                    'shares.cat': cat._id,
                                    ownerId: req.decoded.user._id
                                }
                            })
                            .then(expenses => Promise.all( // resolve when all saves are done
                                expenses.map(exp => {
                                    exp.shares.map(share => {
                                        if (share.cat == cat._id) {
                                            share.cat = cat.delCat
                                            share.subcat = cat.delSubcat
                                        }
                                    })
                                    // return .map()
                                    return InPromise.mongo.save({entity: exp, errorMessage: "Could not update Category"})
                                })
                            ))
                            .then(() => InPromise.mongo.remove({schema: Category, criteria: {_id: cat._id}, errorMessage: "Could not update Category"}))
                            .then(resUtil.successNoPayload(res, 'Category deleted.'))
                    } else {
                        // update existing category
                        return InPromise.mongo
                            .findOneAndUpdate({
                                schema: Category,
                                criteria: {_id: cat._id},
                                entity: cat,
                                settings: {upsert: true, 'new': true}
                            })
                            .then(resUtil.successNoPayload(res, 'Category updated.'))
                    }
                } else {
                    // save new category
                    return InPromise.mongo
                        .save({entity: new Category(cat)})
                        .then(resUtil.successNoPayload(res, 'Category saved.'))
                }
            })
            .catch(resUtil.error(res, null, 'Could not save category.'))
    })

    categoryRouter.route('/all').get(function (req, res) {
        InPromise.mongo
            .find({schema: Category, criteria: {'ownerId': req.decoded.user._id}})
            .then(resUtil.success(res, 'your categories'))
            .catch(resUtil.error(res))
    })

    return categoryRouter
}