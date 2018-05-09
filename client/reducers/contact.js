import {getContacts} from "../actions/api"

const router = (state = {contacts: null, requests: null}, action) => {
    switch (action.type) {
        case getContacts.response:
            return Object.assign({}, state, {
                contacts: action.payload.target.contacts,
                requests: action.payload.target.requests
            })
        // case actions.API_CCT_ACPT + actions.RSP:
        // case actions.API_CCT_RJCT + actions.RSP:
        //     let requests = state.requests.slice()
        //     let contacts = state.contacts.slice()
        //     let cct = null
        //     requests = requests.filter(req => {
        //         if (req.email == action.meta.parameters.data.email) {
        //             cct = req
        //             return false
        //         }
        //         return true
        //     })
        //     if (cct && action.type == actions.API_CCT_ACPT + actions.RSP) {
        //         contacts.unshift(cct)
        //     }
        //     return Object.assign({}, state, {requests, contacts})
        default:
            return state
    }
}

export default router



