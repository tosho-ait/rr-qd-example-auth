import "babel-polyfill"
import React from "react"
import {render} from "react-dom"
import {Provider} from "react-redux"
import {rrInit} from "rr-qd"
import budgetSimplyApp from "./reducers/index"
import Application from "./application"
import {loadList} from "./actions/api"

let store = rrInit({
    reducers: budgetSimplyApp,
    autoLoadAction: loadList.action
})

render(
    <Provider store={store}><Application/></Provider>,
    document.getElementById('root')
)

