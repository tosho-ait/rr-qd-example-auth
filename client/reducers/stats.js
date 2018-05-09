import {getStats} from "../actions/api"

const initialStats = {ec: null, fc: null, cc: null}

const stats = (state = initialStats, action) => {
    switch (action.type) {
        case getStats.response:
            return Object.assign({}, state, {
                ec: action.payload.target.ec,
                fc: action.payload.target.fc,
                cc: action.payload.target.cc,
            })
        default:
            return state
    }
}

export default stats

