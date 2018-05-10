import {combineReducers} from "redux"
import {reducer as form} from "redux-form"
import {reducers} from "rr-qd"

import admin from "./admin"
import user from "./user"

const budgetSimplyApp = combineReducers({
    form,
    router: reducers.router,
    auth: reducers.auth,
    props: reducers.props,
    lists: reducers.lists,
    track: reducers.track,
    user,
    admin
})

export default budgetSimplyApp
