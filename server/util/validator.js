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
                schema.pop().target = name
            }
            return validator(schema)
        },
        required: (fieldError) => {
            schema.splice(
                schema.length - 1,
                0,
                Object.assign({required: true, fieldError}, schema.pop()))
            return validator(schema)
        },
        minLength: () => {
            return validator(schema)
        },
        maxLength: () => {
            return validator(schema)
        },
        custom: () => {
            return validator(schema)
        }
    }
}

module.exports = validator
