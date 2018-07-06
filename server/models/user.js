var mongoose = require('mongoose')
var Schema = mongoose.Schema
var bcrypt = require('bcrypt-nodejs')

// user schema
var UserSchema = new Schema({
    name: {
        type: String,
        required: [true],
        minlength: [8],
        maxlength: [25]
    },
    email: {
        type: String,
        required: [true],
        index: {unique: true}
    },
    password: {
        type: String,
        required: [true],
        select: false
    },
    image: String,
    admin: Boolean,
    created_at: Date,
    updated_at: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date
})

UserSchema.pre('save', function (next) {
    let user = this
    user.updated_at = new Date()
    if (!user.created_at) {
        user.created_at = new Date()
    }
    if (!user.isModified('password')) {
        return next()
    }
    bcrypt.hash(user.password, null, null, function (err, hash) {
        if (err) {
            return next(err)
        }
        user.password = hash
        next()
    })
})

UserSchema.methods.comparePassword = function (password) {
    let user = this
    return bcrypt.compareSync(password, user.password)
}

module.exports = mongoose.model('User', UserSchema)
