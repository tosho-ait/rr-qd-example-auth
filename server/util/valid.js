var valid = (schema, object) => {
    return new Promise((resolve, reject) => {
            var errors = {}
            var custom = []
            if (object && schema) {
                for (var property in schema) {
                    if (property != '_error' && schema[property].doCheckProperty) {
                        if (schema[property].required && !object[property]) {
                            errors[property] = schema[property].required._error
                            if (!errors._error && schema._error) {
                                errors._error = schema._error
                            }
                        }
                        if (schema[property].required && !object[property]) {
                            errors[property] = schema[property].required._error
                            if (!errors._error && schema._error) {
                                errors._error = schema._error
                            }
                        }
                        if (schema[property].minLength && object[property] && object[property].length) {
                            if (object[property].length < schema[property].minLength._value) {
                                errors[property] = schema[property].minLength._error
                                if (!errors._error && schema._error) {
                                    errors._error = schema._error
                                }
                            }
                        }
                        if (schema[property].custom) {
                            // let me miss you
                            (function iif() {
                                var prop = property
                                custom.push(
                                    new Promise((resolve, reject) => {
                                        Promise.resolve(schema[prop].custom._condition(object))
                                            .then(passed => {
                                                if (!passed) {
                                                    if (schema[prop].custom._error) {
                                                        errors[prop] = schema[prop].custom._error
                                                    }
                                                    if (schema[prop].custom._headlineError) {
                                                        errors._error = schema[prop].custom._headlineError
                                                    }
                                                    if (!errors._error && schema._error) {
                                                        errors._error = schema._error
                                                    }
                                                }
                                                resolve()
                                            })
                                            .catch((customFailed) => {
                                                if (schema[prop].custom._error) {
                                                    errors[prop] = schema[prop].custom._error
                                                }
                                                if (schema[prop].custom._headlineError) {
                                                    errors._error = schema[prop].custom._headlineError
                                                }
                                                if (!errors._error && schema._error) {
                                                    errors._error = schema._error
                                                }
                                                resolve()
                                            })
                                    })
                                )
                            })()
                        }
                    }
                }
            }
            resolve({errors, custom})
        }
    ).then(result => {
            if (result.custom) {
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

module.exports = valid
