import {combineReducers} from "redux"
import {reducer as form} from "redux-form"
import {reducers} from "rr-qd"

import contact from "./contact"
import expense from "./expense"
import category from "./category"
import searchppl from "./searchppl"
import sharedwith from "./sharedwith"
import admin from "./admin"
import stats from "./stats"
import user from "./user"

const budgetSimplyApp = combineReducers({
    form,
    router: reducers.router,
    auth: reducers.auth,
    props: reducers.props,
    lists: reducers.lists,
    track: reducers.track,
    contact,
    category,
    expense,
    searchppl,
    sharedwith,
    user,
    stats,
    admin
})

export default budgetSimplyApp
