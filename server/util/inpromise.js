var validator = require('./validator.js')
var nodemailer = require('nodemailer')

var InPromise = {
    wrap: (fn, thisArg) => {
        return function () {
            var args = [].slice.call(arguments)
            return new Promise((resolve, reject) => {
                fn.apply(thisArg, args.concat((err, v) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(v)
                        }
                    })
                )
            })
        }
    },
    valid: (criteria, target, context) => validator.validate(criteria, target, context),
    if: (condition, onTrue, onFalse) =>
        new Promise((resolve, reject) => {
            if (condition) {
                resolve(onTrue)
            } else {
                reject(onFalse)
            }
        }),
    do: (func) =>
        new Promise((resolve, reject)=> {
            try {
                resolve(func())
            } catch (error) {
                reject(error)
            }
        }),
    mongo: {
        findOne: ({schema, criteria, errorMessage, limit, lean, orFail, select}) =>
            new Promise((resolve, reject) => {
                if (!criteria) {
                    criteria = {}
                }
                var action = schema.findOne(criteria)
                if (limit) {
                    action = action.limit(limit)
                }
                if (lean) {
                    action = action.lean()
                }
                if (select) {
                    action = action.select(select)
                }
                action.exec((error, result) => {
                    if (error) reject({error, errorMessage})
                    if (!result && orFail) reject({errorMessage})
                    resolve(result)
                })
            }),
        find: ({schema, criteria, errorMessage, limit, lean, orFail}) =>
            new Promise((resolve, reject) => {
                if (!criteria) {
                    criteria = {}
                }
                var action = schema.find(criteria)
                if (limit) {
                    action = action.limit(limit)
                }
                if (lean) {
                    action = action.lean()
                }
                action.exec((error, result) => {
                    if (error) reject({error, errorMessage})
                    if (!result && orFail) reject({errorMessage})
                    resolve(result)
                })
            }),
        count: ({schema, criteria, errorMessage}) =>
            new Promise((resolve, reject) => {
                schema.count(criteria).exec((error, result) => {
                    if (error) reject({error, errorMessage})
                    if (!result) resolve(0)
                    if (result) resolve(result)
                })
            }),
        save: ({entity, errorMessage}) =>
            new Promise((resolve, reject) => {
                entity.save((error, saved) => {
                    if (error) {
                        reject({error, errorMessage})
                    }
                    else resolve(saved)
                })
            }),
        remove: ({schema, criteria, errorMessage}) =>
            new Promise((resolve, reject) => {
                schema.remove(criteria, (error) => {
                    if (error) reject({error, errorMessage})
                    else resolve()
                })
            }),
        findOneAndUpdate: ({schema, criteria, entity, settings, errorMessage}) =>
            new Promise((resolve, reject)=> {
                schema.findOneAndUpdate(criteria, entity, settings, (error) => {
                    if (error) reject({error, errorMessage})
                    else resolve()
                })
            }),
    },
    util: {
        sendmail: ({service, user, pass, to, subject, text}) => {
            let smtpTransport = nodemailer.createTransport({service, auth: {user, pass}})
            return InPromise.wrap(smtpTransport.sendMail, smtpTransport)({to, subject, text})
        }
    }
}

module.exports = InPromise
