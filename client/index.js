import "babel-polyfill"
import React from "react"
import {render} from "react-dom"
import {Provider} from "react-redux"
import {fancyInit} from "react-fancy"
import budgetSimplyApp from "./reducers/index"
import Application from "./application"
import {loadList} from "./actions/api"

let store = fancyInit({
    reducers: budgetSimplyApp,
    autoLoadAction: loadList.action
})

render(
    <Provider store={store}><Application/></Provider>,
    document.getElementById('root')
)

