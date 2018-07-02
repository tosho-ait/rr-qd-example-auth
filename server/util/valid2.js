var valid2 = (schema, object) => {
    return new Promise((resolve, reject) => {
            var errors = {}
            var custom = []
            if (object && schema) {
                schema.map(check => {
                    let property = check.target
                    if (check.required && !object[property]) {
                        errors[property] = check.fieldError
                        if (!errors._error && check.error) {
                            errors._error = check.error
                        }
                    }
                    if (check.minLength && object[property] && object[property].length) {
                        if (object[property].length < check.minLength) {
                            errors[property] = check.fieldError
                            if (!errors._error && check.error) {
                                errors._error = check.error
                            }
                        }
                    }
                    if (check.maxLength && object[property] && object[property].length) {
                        if (object[property].length > check.maxLength) {
                            errors[property] = check.fieldError
                            if (!errors._error && check.error) {
                                errors._error = check.error
                            }
                        }
                    }
                    if (check.custom) {
                        // let me miss you
                        (function iif() {
                            var prop = property
                            custom.push(
                                new Promise((resolve, reject) => {
                                    Promise.resolve(check.custom(object))
                                        .then(passed => {
                                            if (!passed) {
                                                if (check.fieldError) {
                                                    errors[prop] = check.fieldError
                                                }
                                                if (!errors._error && check.error) {
                                                    errors._error = check.error
                                                }
                                            }
                                            resolve()
                                        })
                                        .catch((customFailed) => {
                                            if (check.fieldError) {
                                                errors[prop] = check.fieldError
                                            }
                                            if (!errors._error && check.error) {
                                                errors._error = check.error
                                            }
                                            resolve()
                                        })
                                })
                            )
                        })() //call iif
                    }
                })
            }
            resolve({errors, custom})
        }
    ).then(result => {
            if (result.custom) {
                // wait for all the custom checks to resolve
                return Promise.all(result.custom).then(() => result.errors)
            } else {
                return result.errors
            }
        }
    ).then(errors => {
            return new Promise((resolve, reject) => {
                if (errors._error) {
                    reject(errors)
                } else {
                    resolve()
                }
            })
        }
    )

}

module.exports = valid2
