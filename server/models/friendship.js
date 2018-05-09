var mongoose = require('mongoose')
var Schema = mongoose.Schema

var FriendshipSchema = new Schema({
    users: [{email: String, ownerId: String, name: String, accepted: Boolean}],
    date: Date,
    accepted: Boolean,
    rejected: Boolean,
    created_at: Date,
    updated_at: Date,
})

FriendshipSchema.pre('save', function (next) {
    var fship = this
    fship.updated_at = new Date()
    if (!fship.created_at) {
        fship.created_at = new Date()
    }
    return next()
})

module.exports = mongoose.model('Friendship', FriendshipSchema)
