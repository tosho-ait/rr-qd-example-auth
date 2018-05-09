var User = require('../../models/user')
var Friendship = require('../../models/friendship')
var config = require('../../../config')
var InPromise = require('../../util/inpromise.js')
var resUtil = require('../../util/resutil.js')
var msg = require('../../res/msg')

module.exports = function (app, express) {
    var contactRouter = express.Router()

    contactRouter.get('/list', function (req, res) {
        InPromise
            .do(() => ({contacts: req.friends, requests: req.requests}))
            .then(resUtil.success(res, 'your contacts'))
            .catch(resUtil.error(res))
    })

    contactRouter.post('/find', function (req, res) {
        var criteria = req.body.criteria
        var q = new RegExp(criteria, 'i')
        InPromise.mongo
            .find({schema: User, criteria: {$or: [{'email': q}, {'name': q}]}, lean: true, limit: 20} )
            .then(results => InPromise.mongo
                .find({schema: Friendship, criteria: {'users.ownerId': req.decoded.user._id}})
                .then(friendships => ({results, friendships}))
            )
            .then(pair => {
                var resFiltered = []
                pair.results.map(user => {
                    if (user.email != req.decoded.user.email) {
                        var friends = false
                        var request = false
                        var rejected = false
                        pair.friendships.map(fship => {
                            if (user.email === fship.users[0].email || user.email === fship.users[1].email) {
                                request = fship.users[0].accepted || fship.users[1].accepted
                                friends = fship.users[0].accepted && fship.users[1].accepted
                                rejected = fship.rejected
                            }
                        })
                        user.request = request
                        user.friends = friends
                        user.rejected = rejected
                        delete user.email
                        resFiltered.push(user)
                    }
                })
                return {all: resFiltered, data: {criteria}}
            })
            .then(resUtil.success(res, "contacts found"))
            .catch(resUtil.error(res, 'Could not find users.'))
    })

    contactRouter.post('/accept', function (req, res) {
        var me = req.decoded.user._id
        var fid = req.body.fid
        InPromise.mongo
            .findOne({schema: Friendship, criteria: {_id: fid}, orFail: true})
            .then(request =>
                // request not already accepted/rejected
                InPromise.if(request.accepted != true && request.rejected != true, request))
            .then(request =>
                // request is for me
                InPromise.if(request.users[0].ownerId == me || request.users[1].ownerId == me, request))
            .then(request => {
                request.accepted = true
                request.users[0].accepted = true
                request.users[1].accepted = true
                return request
            })
            .then(request => InPromise.mongo.save({entity: request}))
            .then(resUtil.success(res, 'Contact request accepted.'))
            .catch(resUtil.error(res, 'Could not accept contact request.'))
    })

    contactRouter.post('/reject', function (req, res) {
        var me = req.decoded.user._id
        var fid = req.body.fid
        InPromise.mongo
            .findOne({schema: Friendship, criteria: {_id: fid}, orFail: true})
            .then(request =>
                // request not already accepted/rejected
                InPromise.if(request.accepted != true && request.rejected != true, request))
            .then(request =>
                // request is for me
                InPromise.if(request.users[0].ownerId == me || request.users[1].ownerId == me, request))
            .then(request => {
                request.rejected = true
                return request
            })
            .then(request => InPromise.mongo.save({entity: request, errorMessage: 'Could not reject contact request'}))
            .then(resUtil.success(res, 'Contact request rejected'))
            .catch(resUtil.error(res, 'Could not reject contact request.'))
    })

    contactRouter.post('/add', function (req, res) {
        InPromise.mongo
            .findOne({schema: User, criteria: {'_id': req.decoded.user._id}, orFail: true})
            .then(user => InPromise.mongo
                .findOne({
                    schema: Friendship,
                    criteria: {$and: [{'users.ownerId': req.decoded.user._id}, {'users.ownerId': req.body.uid}]}
                })
                .then(alreadyF => {
                    if (alreadyF) {
                        return 'You have already added this contact.'
                    } else {
                        return InPromise.mongo
                            .findOne({schema: User, criteria: {'_id': req.body.uid}, orFail: true})
                            .then(friend => {
                                var link = new Friendship()
                                link.date = new Date()
                                link.users.push({
                                    email: friend.email,
                                    name: friend.name,
                                    accepted: false,
                                    ownerId: friend._id
                                })
                                link.users.push({
                                    email: user.email,
                                    name: user.name,
                                    accepted: true,
                                    ownerId: user._id
                                })
                                link.accepted = false
                                link.rejected = false
                                return InPromise.mongo
                                    .save({entity: link})
                                    .then(() => 'Contact request sent.')
                            })
                    }
                })
            )
            .then(result => ({messages: {_message: result}}))
            .then(resUtil.respond(res))
            .catch(resUtil.error(res, 'Could not add contact.'))
    })

    return contactRouter
}