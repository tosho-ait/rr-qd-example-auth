var mongoose = require('mongoose')
var Schema = mongoose.Schema
var bcrypt = require('bcrypt-nodejs')

// user schema
var UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please input a Name'],
        minlength: [8, 'Name must be at least 8 characters'],
        maxlength: [25, 'Name must be no more than 25 characters']
    },
    location: {
        type: String,
        maxlength: [50, 'Location must be no more than 50 characters']
    },
    country: {
        type: String
    },
    email: {
        type: String,
        required: [true, 'Please input an E-mail'],
        index: {unique: true}
    },
    password: {
        type: String,
        required: [true, 'Please input a Password'],
        select: false
    },
    image: String,
    admin: Boolean,
    created_at: Date,
    updated_at: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

UserSchema.pre('save', function (next) {
    var user = this
    user.updated_at = new Date()
    if (!user.created_at) {
        user.created_at = new Date()
    }
    if (!user.isModified('password'))
        return next()
    bcrypt.hash(user.password, null, null, function (err, hash) {
        if (err) return next(err)
        user.password = hash
        next()
    })
})

UserSchema.methods.comparePassword = function (password) {
    var user = this;
    return bcrypt.compareSync(password, user.password)
}

UserSchema.methods.checkValid = function (validation, _error) {
    var user = this
    if (_error)
        validation._error = _error
    error = user.validateSync()
    if (error) {
        for (var key in error.errors) {
            validation[key] = error.errors[key].message
            validation.hasErrors = true
        }
    }
    return validation
}

module.exports = mongoose.model('User', UserSchema)
