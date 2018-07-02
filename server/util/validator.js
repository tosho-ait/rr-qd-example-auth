let copySchema = schema => {
    if (!schema || !schema.slice) {
        return []
    }
    // TODO
    return schema.slice()
}

let validator = (schemaArg) => {
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
            return validator(schema)
        },
        generalError: (message) => {
            if (schema.length == 0) {
                schema.push({error: message})
            } else {
                schema[schema.length - 1].error = message
            }
            return validator(schema)
        },
        required: (fieldError) => {
            schema.splice(
                schema.length - 1, 0,
                Object.assign({required: true, fieldError}, schema[schema.length - 1]))
            return validator(schema)
        },
        minLength: (len, fieldError) => {
            schema.splice(
                schema.length - 1, 0,
                Object.assign({minLength: len, fieldError}, schema[schema.length - 1]))
            return validator(schema)
        },
        maxLength: (len, fieldError) => {
            schema.splice(
                schema.length - 1, 0,
                Object.assign({maxLength: len, fieldError}, schema[schema.length - 1]))
            return validator(schema)
        },
        custom: (func, fieldError) => {
            schema.splice(
                schema.length - 1, 0,
                Object.assign({custom: func, fieldError}, schema[schema.length - 1]))
            return validator(schema)
        },
        build: () => copySchema(schema)
    }
}

module.exports = validator
