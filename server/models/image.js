var mongoose = require('mongoose')
var Schema = mongoose.Schema

var ImageSchema = new Schema({
    data: Buffer,
    contentType: String,
    originalName: String,
    permanent: Boolean,
    ownerId: String
})

ImageSchema.pre('save', function (next) {
    let entity = this
    entity.updated_at = new Date()
    if (!entity.created_at) {
        entity.created_at = new Date()
    }
    next()
})

module.exports = mongoose.model('Image', ImageSchema)
