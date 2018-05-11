import {rrAccessApi} from "rr-qd"
import {uploadUserImage} from "../actions/api"

const user = (state = {image: null}, action) => {
    switch (action.type) {
        case uploadUserImage.response:
            return Object.assign({}, state, {image: action.payload.target.fileid})
        default:
            if (rrAccessApi.hasAugmentSetPublic(action)) {
                return {image: null}
            }
            return state
    }
}

export default user



