import {apiDeclare} from "react-fancy"
import {uploadUserImage} from "../actions/api"

const user = (state = {image: null}, action) => {
    switch (action.type) {
        case uploadUserImage.response:
            return Object.assign({}, state, {image: action.payload.target.fileid})
        default:
            if (apiDeclare.hasAugmentSetPublic(action)) {
                return {image: null}
            }
            return state
    }
}

export default user



