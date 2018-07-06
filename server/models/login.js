var mongoose = require('mongoose')
var Schema = mongoose.Schema

var LoginSchema = new Schema({
    ownerId: String,
    ip: String,
    agent: String,
    token: String,
    created_at: Date,
    updated_at: Date
})

LoginSchema.pre('save', function (next) {
    let entity = this
    entity.updated_at = new Date()
    if (!entity.created_at) {
        entity.created_at = new Date()
    }
    next()
})

module.exports = mongoose.model('Login', LoginSchema)
