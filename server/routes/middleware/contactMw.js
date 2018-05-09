var User = require('../../models/user')
var Friendship = require('../../models/friendship')
var config = require('../../../config')
var async = require('async')

module.exports = function (app, express) {
    var contactMw = express.Router()

    contactMw.use(function (req, res, next) {
        if (req.decoded && req.decoded.user && req.decoded.user._id) {
            Friendship.find({'users.ownerId': req.decoded.user._id}, function (err, friendships) {
                if (err) {
                    res.status(418).json({message: "Internal error!"})
                } else {
                    var friends = []
                    var requests = []
                    async.filter(friendships, function (fship, callback) {
                        var item = undefined
                        var meItem = undefined
                        if (fship.users[0].ownerId != req.decoded.user._id) {
                            item = fship.users[0]
                            meItem = fship.users[1]
                        } else {
                            item = fship.users[1]
                            meItem = fship.users[0]
                        }
                        User.findOne({'_id': item.ownerId}).lean().exec(function (err, friend) {
                            if (err) {
                                callback(err, false);
                            } else {
                                if (fship.accepted) {
                                    friends.push({
                                        fid: fship._id,
                                        id: friend._id,
                                        location: friend.location,
                                        country: friend.country,
                                        created_at: friend.created_at,
                                        name: friend.name,
                                        image: friend.image,
                                        accepted: fship.accepted,
                                    })
                                } else if (!fship.rejected) {
                                    requests.push({
                                        fid: fship._id,
                                        id: friend._id,
                                        location: friend.location,
                                        country: friend.country,
                                        created_at: friend.created_at,
                                        name: friend.name,
                                        image: friend.image,
                                        accepted: fship.accepted,
                                        otherAccepted: item.accepted,
                                        meAccepted: meItem.accepted,
                                    })
                                }
                            }
                            callback(null, true);
                        })
                    }, function (err, results) {
                        if (err) {
                            res.status(418).json({message: "Internal error!"})
                        } else {
                            req.requests = requests
                            req.friends = friends
                            next()
                        }
                    })
                }
            })
        } else {
            next()
        }
    })

    return contactMw
}
