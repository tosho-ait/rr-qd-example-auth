var validator = require('../util/validator.js')
var InPromise = require('../util/inpromise.js')
var User = require('../models/user')
var msg = require('../res/msg')

module.exports = {

    userRegister: validator()
        .generalError(msg.USER_REGISTER_FAILED)
        .target("email")
        .required(msg.EMAIL_REQUIRED)
        .custom(object => !object.email || InPromise.mongo
                .findOne({
                    schema: User, criteria: {email: object.email}
                }).then(result => result === null)
            , )
        .target("name")
        .required(msg.USERNAME_REQUIRED)
        .minLength(8, msg.USERNAME_MIN8)
        .maxLength(25, msg.USERNAME_MAX25)
        .target("password")
        .required(msg.PASSWORD_REQUIRED)
        .minLength(8, msg.PASSWORD_MIN8)
        .maxLength(25, msg.PASSWORD_MAX25)
        .target("passwordconfirm")
        .required(msg.PASSCONFIRM_REQUIRED)
        .custom(object => !object.password || object.password === object.passwordconfirm, msg.PASSCONFIRM_NOMATCH)
        .build(),

    userUpdate: validator()
        .generalError(msg.USER_UPDATE_FAILED)
        .target("name")
        .required(msg.USERNAME_REQUIRED)
        .minLength(8, msg.USERNAME_MIN8)
        .maxLength(25, msg.USERNAME_MAX25)
        .target("password")
        .minLength(8, msg.PASSWORD_MIN8)
        .maxLength(25, msg.PASSWORD_MAX25)
        .target("passwordconfirm")
        .custom(object => !object.password || object.password === object.passwordconfirm, msg.PASSCONFIRM_NOMATCH)
        .target("oldpassword")
        .custom((object, context) => !object.password || (object.oldpassword && context.user.comparePassword(object.oldpassword)), msg.PASS_NOMATCH)
        .build(),

    passwordRecover: validator()
        .generalError(msg.USER_RESET_FAILED)
        .target("email")
        .required(msg.EMAIL_REQUIRED)
        .build(),

    passwordReset: validator()
        .generalError(msg.USER_RESET_FAILED)
        .target("password")
        .required(msg.PASSWORD_REQUIRED)
        .minLength(8, msg.PASSWORD_MIN8)
        .maxLength(25, msg.PASSWORD_MAX25)
        .target("passwordconfirm")
        .required(msg.PASSCONFIRM_REQUIRED)
        .custom(object => !object.password || object.password === object.passwordconfirm, msg.PASSCONFIRM_NOMATCH)
        .build(),

    userAuth: validator()
        .target("email")
        .generalError(msg.LOGIN_FAILED)
        .required(msg.EMAIL_REQUIRED)
        .target("password")
        .required(msg.PASSWORD_REQUIRED)
        .build()

}
