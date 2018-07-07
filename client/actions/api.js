import {rrAccessApi} from "rr-qd"

export const API_REGISTERFORM = 'api/auth/register'
export const API_RECOVERFORM = 'api/recover/reset'
export const API_RESETFORM = 'api/recover/forgot'

export const API_CONFIRMEMAIL = 'api/auth/confirm'

export const API_UPDATE_ME = 'api/user/update'
export const API_UPLOADUI = 'api/upload/userimg'

// ADMIN API
export const API_ADMIN_USERS = 'api/admin/users'

// MISC API
export const AP_LOAD_LIST = 'api/lists/get'
export const AP_LOAD_LIST_PUBLIC = 'api/publiclists/get'

// SECURITY API
export const AP_AUTH_PING = 'api/reauth/ping'
export const AP_AUTH_LOGIN = 'api/auth/authenticate'

export const AP_AUTH_RELOGIN = 'api/reauth/refresh'

let {
    apiCall,
    GET,
    POST,
    DELETE,
    logoutOn403,
    showMessage,
    showErrorMessage,
    hideMessage,
    hideErrorMessage,
    hideInfoMessage,
    hideWarningMessage,
    resetLists,
    includeParameters,
    loginCall,
    scrollTop
} = rrAccessApi


export const loadList = apiCall({
    name: "loadList",
    endpoint: AP_LOAD_LIST,
    method: POST,
    includeParameters,
    response: {
        loadListResponse: action => ({
            listName: action.meta.parameters.data.listName,
            list: action.payload.target
        })
    },
    error: {logoutOn403}
})

export const loadListPublic = apiCall({
    name: "loadListPublic",
    endpoint: AP_LOAD_LIST_PUBLIC,
    method: POST,
    includeParameters,
    response: {
        loadListResponse: action => ({
            listName: action.meta.parameters.data.listName,
            list: action.payload.target
        })
    },
    error: {logoutOn403}
})

export const authPing = apiCall({
    name: "authPing",
    endpoint: AP_AUTH_PING,
    method: GET,
    authPing: true,
    error: {logoutOn403}
})

export const loginSubmit = apiCall({
    name: "loginSubmit",
    endpoint: AP_AUTH_LOGIN,
    method: POST,
    includeParameters,
    loginCall,
    response: {
        setPublic: "",
        hideMessage,
        hideInfoMessage,
        hideWarningMessage,
        hideErrorMessage,
        loginResponse: action => ({
            token: action.payload.token,
            userDetails: action.payload.userDetails,
            userId: action.payload.userDetails.userId,
        })
    },
    error: {setPublic: "", logoutOn403}
})

export const reLoginSubmit = apiCall({
    name: "reLoginSubmit",
    endpoint: AP_AUTH_RELOGIN,
    method: POST,
    includeParameters,
    response: {
        loginResponse: action => ({
            token: action.payload.token,
            userDetails: action.payload.userDetails
        })
    },
    error: {setPublic: "", logoutOn403}
})

export let registerFormSubmit = apiCall({
    name: "registerFormSubmit",
    endpoint: API_REGISTERFORM,
    method: POST,
    response: {showMessage, setPublic: 'done'},
})

export let recoverFormSubmit = apiCall({
    name: "recoverFormSubmit",
    endpoint: API_RECOVERFORM,
    method: POST,
    response: {showMessage, setPublic: 'done'},
})

export let resetFormSubmit = apiCall({
    name: "resetFormSubmit",
    endpoint: API_RESETFORM,
    method: POST,
    response: {showMessage, setPublic: 'done'},
})

export let confirmEmailSubmit = apiCall({
    name: "confirmEmailSubmit",
    endpoint: API_CONFIRMEMAIL,
    method: POST,
    response: {showMessage, setPublic: 'done'},
})

export let updateMe = apiCall({
    name: "updateMe",
    endpoint: API_UPDATE_ME,
    method: POST,
    request: {hideMessage, hideErrorMessage},
    response: {showMessage, scrollTop},
    error: {logoutOn403}
})

export let adminUsers = apiCall({
    name: "adminUsers",
    endpoint: API_ADMIN_USERS,
    method: GET,
    trackRequest: true,
    error: {logoutOn403}
})

export let adminActivateUser = apiCall({
    name: "adminActivateUser",
    endpoint: "api/admin/activateUser",
    method: POST,
    response: {showMessage, trackStaleUp: adminUsers.name},
})

export let adminDeactivateUser = apiCall({
    name: "adminDeactivateUser",
    endpoint: "api/admin/deactivateUser",
    method: POST,
    response: {showMessage, trackStaleUp: adminUsers.name},
})

export let uploadUserImage = apiCall({
    name: "uploadUserImage",
    endpoint: API_UPLOADUI,
    method: POST,
    headers: {noJson: true},
    error: {showErrorMessage, logoutOn403}
})
