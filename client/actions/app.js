import {rrAccessApi} from "rr-qd"

let {hideMessage, hideInfoMessage, hideWarningMessage, hideErrorMessage, logout} = rrAccessApi

export const msgClearMessage = () => ({type: "DNM", meta: {hideMessage}})
export const msgClearError = () => ({type: "DNM", meta: {hideErrorMessage}})

export const confirmRoutePrime = () => ({type: "DNM", meta: {confirmRoutePrime: true}})
export const confirmRouteRelease = () => ({type: "DNM", meta: {confirmRouteRelease: true}})

export const routeDo = (publicpart, privateprops = null) => {
    return dispatch => {
        // clear messages on route changes
        let action = {
            type: "DNM",
            meta: {hideMessage, hideErrorMessage, hideInfoMessage, hideWarningMessage}
        }
        if (publicpart != null) {
            action.meta.setPublic = publicpart
        }
        if (privateprops != null) {
            action.meta.clearPrivateProps = true
            action.meta.setPrivateProps = privateprops
        }
        dispatch(action)
    }
}

export const logoutDo = () => {
    return dispatch => {
        dispatch({type: "DNM", meta: {logout}})
        dispatch(routeDo("", {}))
    }
}