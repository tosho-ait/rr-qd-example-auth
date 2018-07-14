let copySchema = schema => {
    if (!schema || !schema.slice) {
        return []
    }
    // TODO
    return schema.slice()
}

let builder = (schemaArg) => {
    let schema = copySchema(schemaArg)
    return {
        target: (name) => {
            // set last target of last element of rules.
            // this is where we keep the name of the current target
            if (schema.length == 0) {
                schema.push({target: name})
            } else {
                schema[schema.length - 1].target = name
            }
            return builder(schema)
        },
        generalError: (message) => {
            if (schema.length == 0) {
                schema.push({error: message})
            } else {
                schema[schema.length - 1].error = message
            }
            return builder(schema)
        },
        required: (fieldError) => {
            schema.splice(
                schema.length - 1, 0,
                Object.assign({required: true, fieldError}, schema[schema.length - 1]))
            return builder(schema)
        },
        minLength: (len, fieldError) => {
            schema.splice(
                schema.length - 1, 0,
                Object.assign({minLength: len, fieldError}, schema[schema.length - 1]))
            return builder(schema)
        },
        maxLength: (len, fieldError) => {
            schema.splice(
                schema.length - 1, 0,
                Object.assign({maxLength: len, fieldError}, schema[schema.length - 1]))
            return builder(schema)
        },
        regex: (expression, fieldError) => {
            schema.splice(
                schema.length - 1, 0,
                Object.assign({regex: expression, fieldError}, schema[schema.length - 1]))
            return builder(schema)
        },
        custom: (func, fieldError) => {
            schema.splice(
                schema.length - 1, 0,
                Object.assign({custom: func, fieldError}, schema[schema.length - 1]))
            return builder(schema)
        },
        build: () => copySchema(schema)
    }
}

let validate = (schema, object, context) => {
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
                    if (check.regex && object[property] && object[property].length) {
                        if (!check.regex.test(object[property])) {
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
                                    Promise.resolve(check.custom(object, context))
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


module.exports = {builder, validate}
