import {getCategories} from "../actions/api"

const initialCategory = {all: []}

const category = (state = initialCategory, action) => {
    switch (action.type) {
        case getCategories.response:
            return Object.assign({}, state, {
                all: action.payload.target
            })
        default:
            return state
    }
}

export default category
