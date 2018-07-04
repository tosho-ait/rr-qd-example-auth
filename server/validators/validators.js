var validator = require('../util/validator.js')
var InPromise = require('../util/inpromise.js')
var User = require('../models/user')

module.exports = {

    userRegister: validator()
        .generalError("Could not create user")
        .target("email")
        .required("Please input an Email")
        .custom(object => !object.email || InPromise.mongo
                .findOne({
                    schema: User, criteria: {email: object.email}
                }).then(result => result === null)
            , "Email already in use")
        .target("name")
        .required("Please input a Name")
        .minLength(8, "Name must be at least 8 characters")
        .maxLength(25, "Name must be no more than 25 characters")
        .target("password")
        .required("Please input a Password")
        .minLength(8, "Password must be at least 8 characters")
        .maxLength(25, "Password must be no more than 25 characters")
        .target("passwordconfirm")
        .required("Please repeat your Password")
        .custom(object => !object.password || object.password === object.passwordconfirm, 'Passwords do not match')
        .build(),

    userUpdate: validator()
        .generalError("Could not update your Account")
        .target("name")
        .required("Please input a Name")
        .minLength(8, "Name must be at least 8 characters")
        .maxLength(25, "Name must be no more than 25 characters")
        .target("password")
        .minLength(8, "Password must be at least 8 characters")
        .maxLength(25, "Password must be no more than 25 characters")
        .target("passwordconfirm")
        .custom(object => !object.password || object.password === object.passwordconfirm, 'Passwords do not match')
        .target("oldpassword")
        .custom((object, context) => !object.password || (object.oldpassword && context.user.comparePassword(object.oldpassword)), 'Passwords do not match')
        .build(),

    passwordRecover: validator()
        .generalError("Could not reset your password.")
        .target("email")
        .required("Please input an Email")
        .build(),

    userAuth: validator()
        .target("email")
        .generalError("Incorrect Email or Password")
        .required("Please input an Email")
        .target("password")
        .required("Please input a Password")
        .build()

}
