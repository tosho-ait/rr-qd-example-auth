var Expense = require('../../models/expense')
var Image = require('../../models/image')
var config = require('../../../config')
var moment = require('moment')
var InPromise = require('../../util/inpromise.js')
var resUtil = require('../../util/resutil.js')

module.exports = function (app, express) {
    var expenseRouter = express.Router()

    expenseRouter.route('/add').post(function (req, res) {
        InPromise
            .valid({
                _error: 'Could not save expense.',
                date: {
                    doCheckProperty: true,
                    required: {_error: 'Please input a Date'},
                },
                _id: {
                    doCheckProperty: true,
                    custom: {
                        _condition: object => {
                            if (object._id) {
                                return InPromise.mongo
                                    .findOne({schema: Expense, criteria: {_id: req.body._id}, orFail: true})
                                    .then(exp => exp.ownerId == req.decoded.user._id)
                            } else {
                                return true
                            }
                        },
                        _error: 'Not your Expense'
                    }
                },
                shares: {
                    doCheckProperty: true,
                    custom: {
                        _condition: (object) => {
                            if (object.shares) {
                                var toRetuen = true
                                object.shares.map(share => {
                                    if (!share.ownerId) {
                                        toRetuen = false
                                    }
                                })
                                return toRetuen
                            } else {
                                return true
                            }
                        },
                        _headlineError: 'Please select a Contact for each Share.'
                    }
                },
            }, req.body)
            .then(() => {
                var toSave = req.body
                toSave.date = new Date(moment.utc(req.body.date, "DD/MM/YYYY").format("MMM DD, YYYY") + " 00:00:00 GMT")
                if (isNaN(toSave.date.valueOf())) {
                    toSave.date = null
                }
                var totalPaid = 0
                var totalAmount = 0
                // loan expenses should have only two shares! owner and target
                if (toSave.loan) {
                    toSave.shares[0].paid = toSave.shares[1].amount
                }
                toSave.shares.map(share => {
                    if (share.paid)
                        totalPaid += share.paid
                    if (share.amount && (share.ownerId != null && share.ownerId != req.decoded.user._id))
                        totalAmount += share.amount
                })
                var ownerShare = null
                // set owner and amount in owner's share
                toSave.shares.map(share => {
                    if (share.ownerId === req.decoded.user._id) {
                        share.amount = totalPaid - totalAmount
                        share.accepted = true;
                        ownerShare = share
                    }
                })
                var catLbl = "(no label)"
                var subcatLbl = ""
                req.mycats.map(cat=> {
                    if (cat._id == ownerShare.cat) {
                        catLbl = cat.label
                        cat.subcats.map(subcat=> {
                            if (subcat._id == ownerShare.subcat) {
                                subcatLbl = subcat.label
                            }
                        })
                    }
                })
                toSave.shareNote = "Labeled by owner as: " + catLbl + " " + subcatLbl
                toSave.ownerId = req.decoded.user._id
                return toSave
            })
            .then(toSave => {
                var expense = new Expense(toSave)
                if (req.body._id) {
                    return InPromise.mongo
                        .findOneAndUpdate({
                            schema: Expense,
                            criteria: {_id: req.body._id},
                            entity: toSave,
                            settings: {upsert: true, 'new': true},
                            errorMessage: 'Expense update failed.'
                        })
                        .then(resUtil.success(res, 'Expense updated.'))
                } else {
                    return InPromise.mongo
                        .save({entity: expense, errorMessage: 'Expense save failed.'})
                        .then(resUtil.success(res, 'Expense saved.'))
                }
            })
            .catch(resUtil.error(res))
    })

    expenseRouter.route('/all').post(function (req, res) {
        InPromise
            .do(() => {
                var startDate
                var endDate
                if (req.body.period.mode === 'y') {
                    startDate = moment.utc([req.body.period.year])
                    endDate = moment.utc(startDate).endOf('year')
                } else if (req.body.period.mode === 'm') {
                    startDate = moment.utc([req.body.period.year, req.body.period.month - 1])
                    endDate = moment.utc(startDate).endOf('month')
                } else {
                    startDate = moment.utc([req.body.period.year, req.body.period.month - 1, req.body.period.day])
                    endDate = moment.utc([req.body.period.year, req.body.period.month - 1, req.body.period.day])
                }
                startDate = new Date(startDate.format("MMM DD, YYYY") + " 00:00:00 GMT")
                endDate = new Date(endDate.format("MMM DD, YYYY") + " 00:00:00 GMT")
                var statement = {
                    'shares.ownerId': req.decoded.user._id,
                    'date': {"$gte": startDate, "$lte": endDate}
                }
                if (req.includeCats) {
                    statement['$or'] = [{'shares.cat': {"$in": req.includeCats}}, {'shares.subcat': {"$in": req.includeSubcats}}]
                }
                return statement
            })
            .then(criteria => InPromise.mongo
                .find({schema: Expense, criteria, errorMessage: "Could not load expenses", orFail: true}))
            .then(expenses => InPromise
                .do(() => ({
                    "shares": {
                        $all: [{
                            $elemMatch: {"ownerId": req.decoded.user._id},
                            $elemMatch: {"accepted": {$ne: true}}
                        }]
                    }
                }))
                .then(criteriaPending => InPromise.mongo
                    .find({
                        schema: Expense,
                        criteria: criteriaPending,
                        errorMessage: "Could not load expenses",
                        orFail: true
                    }))
                .then(pending => ({expenses, pending})))
            .then(({expenses, pending}) => {
                var all = expenses.map(exp => ({
                    _id: exp._id,
                    date: moment(exp.date).format('DD/MM/YYYY'),
                    ownerId: exp.ownerId,
                    shares: exp.shares,
                    note: exp.note,
                    loan: exp.loan,
                    image: exp.image,
                    shareNote: exp.shareNote
                }))
                pending = pending.map(exp => ({
                    _id: exp._id,
                    date: moment(exp.date).format('DD/MM/YYYY'),
                    ownerId: exp.ownerId,
                    shares: exp.shares,
                    note: exp.note,
                    loan: exp.loan,
                    image: exp.image,
                    shareNote: exp.shareNote
                }))
                return {
                    all,
                    pending,
                    period: req.body.period,
                    filter: req.body.filter,
                    ownerId: req.decoded.user._id
                }
            })
            .then(resUtil.success(res, 'All expenses for period'))
            .catch(resUtil.error(res))
    })

    expenseRouter.route('/delete').delete(function (req, res) {
        InPromise.mongo
            .findOne({
                schema: Expense,
                criteria: {_id: req.body.eid, ownerId: req.decoded.user._id},
                errorMessage: 'Could not delete expense.',
                orFail: true
            })
            .then(expense => {
                if (expense.image) {
                    // delete the linked image first if there is one
                    return InPromise.mongo.remove({
                        schema: Image,
                        criteria: {_id: expense.image},
                        errorMessage: 'Could not delete expense.'
                    })
                }
            })
            .then(() => InPromise.mongo
                .remove(
                    {
                        schema: Expense,
                        criteria: {_id: req.body.eid, ownerId: req.decoded.user._id},
                        errorMessage: 'Could not delete expense.'
                    }))
            .then(resUtil.respond(res, {eid: req.body.eid, messages: {_message: 'Expense deleted.'}}))
            .catch(resUtil.error(res))
    })

    expenseRouter.route('/accept').post(function (req, res) {
        InPromise.mongo
            .findOne({
                schema: Expense,
                criteria: {_id: req.body._id},
                orFail: true
            })
            .then(expense => {
                var ownerShare = false
                expense.shares.map(share => {
                    if (share.ownerId === req.decoded.user._id) {
                        share.accepted = true
                        share.cat = req.body.cat
                        share.subcat = req.body.subcat
                        ownerShare = share
                    }
                })
                return InPromise.if(ownerShare, [expense, ownerShare])
            })
            .then(pair => InPromise.mongo
                .save({entity: pair[0]})
                .then(() => pair)
            )
            .then(pair => ({
                eid: pair[0]._id,
                sid: pair[1]._id,
                cat: req.body.cat,
                subcat: req.body.subcat,
                messages: {_message: 'Expense accepted.'}
            }))
            .then(resUtil.respond(res))
            .catch(resUtil.error(res, 'Could not accept expense.'))
    })

    expenseRouter.route('/reject').post(function (req, res) {
        InPromise.mongo
            .findOne({
                schema: Expense,
                criteria: {_id: req.body._id},
                orFail: true
            })
            .then(expense => {
                var ownerShare = false
                expense.shares.map(share => {
                    if (share.ownerId === req.decoded.user._id) {
                        share.rejected = true;
                        ownerShare = share
                    }
                })
                return InPromise.if(ownerShare, [expense, ownerShare])
            })
            .then(pair => InPromise.mongo
                .save({entity: pair[0]})
                .then(() => pair)
            )
            .then(pair => ({
                eid: pair[0]._id,
                sid: pair[1]._id,
                messages: {_message: 'Expense rejected.'}
            }))
            .then(resUtil.respond(res))
            .catch(resUtil.error(res, 'Could not reject expense.'))
    })

    return expenseRouter
}