import {apiDeclare} from "rr-qd"

export const API_REGISTERFORM = 'api/auth/register'
export const API_RECOVERFORM = 'api/auth/reset'
export const API_RESETFORM = 'api/auth/forgot'

export const API_SEARCH_PPL = 'api/contact/find'
export const API_GET_CONTACTS = 'api/contact/list'
export const API_UPDATE_ME = 'api/user/update'
export const API_CCT_ADD = 'api/contact/add'
export const API_CCT_ACPT = 'api/contact/accept'
export const API_CCT_RJCT = 'api/contact/reject'
export const API_EXP_ACPT = 'api/expense/accept'
export const API_EXP_RJCT = 'api/expense/reject'
export const API_EXP_DEL = 'api/expense/delete'
export const API_GET_EXPENSES = 'api/expense/all'
export const API_EXPENSEFORM = 'api/expense/add'
export const API_CATS_LOAD = 'api/category/all'
export const API_CATFORM = 'api/category/add'

export const API_UPLOADUI = 'api/upload/userimg'
export const API_UPLOAD_TOEXP = 'api/upload/toexp'
export const API_GET_STATS = 'api/stats/get'

// ADMIN API
export const API_ADMIN_USERS = 'api/admin/users'

// MISC API
export const AP_LOAD_LIST = 'api/lists/get'
export const AP_LOAD_LIST_PUBLIC = 'api/publiclists/get'

// SECURITY API
export const AP_AUTH_PING = 'api/user/ping'
export const AP_AUTH_LOGIN = 'api/auth/authenticate'

//export const AP_AUTH_LOGIN_TOKEN = 'api/login/token'

export const AP_AUTH_RELOGIN = 'api/user/refresh'

export const UPDATE_SHARED_WITH = 'UPDATE_SHARED_WITH'

export const EXP_TO_ACPT_REQ = 'EXP_TO_ACPT_REQ'

export const updateSharedWith = (data) => ({type: UPDATE_SHARED_WITH, data})
export const expenseToAccept = (eid) => ({type: EXP_TO_ACPT_REQ, eid})

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
} = apiDeclare


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

// export const tokenLoginSubmit = apiCall({
//     name: "tokenLoginSubmit",
//     endpoint: AP_AUTH_LOGIN_TOKEN,
//     method: POST,
//     includeParameters,
//     loginCall,
//     response: {
//         setPublic: "",
//         hideMessage,
//         hideInfoMessage,
//         hideWarningMessage,
//         hideErrorMessage,
//         loginResponse: action => ({
//             token: action.meta.parameters.headers.token,
//             userDetails: action.payload.userDetails
//         })
//     },
//     error: {setPublic: "", logoutOn403}
// })

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

export let searchPpl = apiCall({
    name: "searchPpl",
    endpoint: API_SEARCH_PPL,
    method: POST,
    error: {logoutOn403}
})

export let contactAdd = apiCall({
    name: "contactAdd",
    endpoint: API_CCT_ADD,
    method: POST,
    response: {showMessage, trackStaleUp: "contacts"},
    error: {showErrorMessage, logoutOn403}
})

export let contactAccept = apiCall({
    name: "contactAccept",
    endpoint: API_CCT_ACPT,
    method: POST,
    includeParameters,
    response: {showMessage, trackStaleUp: "contacts"},
    error: {showErrorMessage, logoutOn403}
})

export let contactReject = apiCall({
    name: "contactReject",
    endpoint: API_CCT_RJCT,
    method: POST,
    includeParameters,
    response: {showMessage, trackStaleUp: "contacts"},
    error: {showErrorMessage, logoutOn403}
})

export let expenseAccept = apiCall({
    name: "expenseAccept",
    endpoint: API_EXP_ACPT,
    method: POST,
    response: {showMessage},
    error: {logoutOn403}
})

export let expenseReject = apiCall({
    name: "expenseReject",
    endpoint: API_EXP_RJCT,
    method: POST,
    response: {showMessage},
    error: {logoutOn403}
})

export let expenseDelete = apiCall({
    name: "expenseDelete",
    endpoint: API_EXP_DEL,
    method: DELETE,
    response: {showMessage, scrollTop},
    error: {showErrorMessage, logoutOn403}
})

export let getContacts = apiCall({
    name: "getContacts",
    endpoint: API_GET_CONTACTS,
    method: GET,
    trackRequest: "contacts",
    error: {logoutOn403}
})


export let updateMe = apiCall({
    name: "updateMe",
    endpoint: API_UPDATE_ME,
    method: POST,
    request: {hideMessage, hideErrorMessage},
    response: {showMessage, scrollTop},
    error: {logoutOn403}
})

export let getExpenses = apiCall({
    name: "getExpenses",
    endpoint: API_GET_EXPENSES,
    method: POST,
    includeParameters,
    trackRequest: "expenses",
    error: {logoutOn403}
})

export let expenseFormSubmit = apiCall({
    name: "expenseFormSubmit",
    endpoint: API_EXPENSEFORM,
    method: POST,
    response: {showMessage, setPublic: '', trackStaleUp: ["expenses", "stats"], scrollTop},
    error: {logoutOn403}
})

export let getCategories = apiCall({
    name: "getCategories",
    endpoint: API_CATS_LOAD,
    method: GET,
    trackRequest: "cats",
    error: {logoutOn403}
})

export let categoryFormSubmit = apiCall({
    name: "categoryFormSubmit",
    endpoint: API_CATFORM,
    method: POST,
    response: {setPublic: 'categories', showMessage, resetLists, trackStaleUp: ["cats", "expenses", "stats"]},
    error: {logoutOn403}
})

export let adminUsers = apiCall({
    name: "adminUsers",
    endpoint: API_ADMIN_USERS,
    method: GET,
    error: {logoutOn403}
})

export let uploadUserImage = apiCall({
    name: "uploadUserImage",
    endpoint: API_UPLOADUI,
    method: POST,
    headers: {noJson: true},
    error: {showErrorMessage, logoutOn403}
})

export let uploadToExpense = apiCall({
    name: "uploadToExpense",
    endpoint: API_UPLOAD_TOEXP,
    method: POST,
    headers: {noJson: true},
    response: {setPublic: '', showMessage, trackStaleUp: "expenses"},
    error: {showErrorMessage, logoutOn403}
})

export let getStats = apiCall({
    name: "getStats",
    endpoint: API_GET_STATS,
    method: GET,
    trackRequest: "stats",
    error: {logoutOn403}
})

export let updaterCategory = apiCall({
    name: "updaterCategory",
    endpoint: "api/updater/category",
    method: GET,
    response: {showMessage},
    error: {showErrorMessage, logoutOn403}
})


export let updaterExpense = apiCall({
    name: "updaterExpense",
    endpoint: "api/updater/expense",
    method: GET,
    response: {showMessage},
    error: {showErrorMessage, logoutOn403}
})

export let updaterContact = apiCall({
    name: "updaterContact",
    endpoint: "api/updater/contact",
    method: GET,
    response: {showMessage},
    error: {showErrorMessage, logoutOn403}
})

export let updaterImage = apiCall({
    name: "updaterImage",
    endpoint: "api/updater/image",
    method: GET,
    response: {showMessage},
    error: {showErrorMessage, logoutOn403}
})

export let updaterUserImage = apiCall({
    name: "updaterUserImage",
    endpoint: "api/updater/userimage",
    method: GET,
    response: {showMessage},
    error: {showErrorMessage, logoutOn403}
})
