import {UPDATE_SHARED_WITH} from "../actions/api"

const sharedwith = (state = {withowner: null}, action) => {
    switch (action.type) {
        case UPDATE_SHARED_WITH:
            return Object.assign({}, state, action.data)
        default:
            return state
    }
}

export default sharedwith



