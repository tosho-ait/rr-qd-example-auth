import {adminUsers} from "../actions/api"

const admin = (state = {users: []}, action) => {
    switch (action.type) {
        case adminUsers.response:
            return Object.assign({}, state, {
                users: action.payload.target,
            })
        default:
            return state
    }
}

export default admin



