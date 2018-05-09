import {apiDeclare} from "rr-qd"
import {searchPpl} from "../actions/api"

const initialSearchPpl = {all: [], data: {}, notFound: false}

const searchppl = (state = initialSearchPpl, action) => {
    switch (action.type) {
        case searchPpl.response:
            return Object.assign({}, state, {
                all: action.payload.target.all,
                data: action.payload.target.data,
                notFound: action.payload.target.all.length < 1
            })
        default:
            if (apiDeclare.hasAugmentSetPublic(action) && !apiDeclare.hasAugmentSetPublic(action).startsWith("connections")) {
                return initialSearchPpl
            }
            return state
    }
}

export default searchppl



