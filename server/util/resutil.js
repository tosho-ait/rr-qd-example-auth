var resUtil = {
    success: (res, message)=> {
        return target => {
            res.json({messages: {_message: message}, target})
        }
    },
    successNoPayload: (res, message)=> {
        return () => {
            res.json({messages: {_message: message}})
        }
    },
    respond: (res, payload)=> {
        return target => {
            res.json(payload ? payload : target)
        }
    },
    error: (res, overwriteMessage, fallbackMessage) => {
        return error => {
            //console.log(error)
            if (overwriteMessage) {
                res.status(418).json({messages: {_error: overwriteMessage}})
            } else if (typeof error === 'string' || error instanceof String) {
                res.status(418).json({messages: {_error: error}})
            } else if ((typeof error._error === 'string' || error._error instanceof String)) {
                res.status(418).json({messages: error})
            } else if (typeof error.errorMessage === 'string' || error.errorMessage instanceof String) {
                var errors = error.errors ? errors : {_error: error.errorMessage}
                res.status(418).json({messages: errors})
            } else if (fallbackMessage) {
                res.status(418).json({messages: {_error: fallbackMessage}})
            } else {
                console.log(error)
                res.status(418).json({messages: {_error: "Ooops..."}})
            }
        }
    }
}

module.exports = resUtil
