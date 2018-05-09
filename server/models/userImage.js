var mongoose = require('mongoose')
var Schema = mongoose.Schema

var UserImageSchema = new Schema({
    data: Buffer,
    contentType: String,
    originalName: String,
    permanent: Boolean,
    owner: String,
    ownerId: String
})

module.exports = mongoose.model('UserImage', UserImageSchema)
