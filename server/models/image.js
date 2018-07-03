var mongoose = require('mongoose')
var Schema = mongoose.Schema

var ImageSchema = new Schema({
    data: Buffer,
    contentType: String,
    originalName: String,
    permanent: Boolean,
    owner: String,
    ownerId: String
})

module.exports = mongoose.model('Image', ImageSchema)
