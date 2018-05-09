import React from "react"
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import LayoutWelcome from "./welcome/LayoutWelcome"
import LayoutWelcomeReg from "./welcome/LayoutWelcomeReg"
import LayoutWelcomeRst from "./welcome/LayoutWelcomeRst"
import LayoutWelcomeRecover from "./welcome/LayoutWelcomeRecover"
import LayoutWelcomeDone from "./welcome/LayoutWelcomeDone"
import Home from "./Home"
import Admin from "./Admin"
import Charts from "./Charts"
import Categories from "./Categories"
import CategoryForm from "./Categories/categoryForm"
import Shared from "./Shared"
import ExpenseForm from "./Home/expenseForm"
import ExpenseView from "./Home/expenseView"
import About from "./About/about.js"
import Therms from "./About/therms.js"
import Policy from "./About/policy.js"
import Settings from "./Settings"
import Contacts from "./Contacts"
import FindContacts from "./Contacts/FindContacts"
import Footer from "./../components/Footer"
import FancySetMomentLocale from "../fancy/components/FancySetMomentLocale"
import FancyRoute from "../fancy/components/FancyRoute"
import StaleLoad from "../fancy/components/StaleLoad"

import {authPing, getCategories, getContacts, getStats} from '../actions/api'

import "bootstrap/dist/css/bootstrap.min.css"
import "font-awesome/css/font-awesome.css"

import "./_res/style.css"
import "./_res/checkboxes.css"
import "./_res/sticky-footer.css"

class Application extends React.Component {

    render() {
        if (!this.props.auth.confirmed && this.props.auth.isAuthenticated) {
            this.props.authPing()
        }
        return <div class="div100">
            <FancySetMomentLocale locale="us"/>
            <div class="page-wrap">
                <FancyRoute routeStartsWith={["error"]}>
                    <div>oops, something went wrong</div>
                    <FancyRoute fallBack>
                        <FancyRoute isAuthenticated>
                            <FancyRoute authConfirmed>
                                <StaleLoad
                                    staleOnInit
                                    staleTarget="cats"
                                    onStale={this.props.getCategories} />
                                <StaleLoad
                                    staleOnInit
                                    staleTarget="contacts"
                                    onStale={this.props.getContacts} />
                                <StaleLoad
                                    staleOnInit
                                    staleTarget="stats"
                                    onStale={this.props.getStats} />
                                <FancyRoute childMatches>
                                    <FancyRoute routeMatches={["about"]}>
                                        <About />
                                    </FancyRoute>
                                    <FancyRoute routeMatches={["therms"]}>
                                        <Therms />
                                    </FancyRoute>
                                    <FancyRoute routeMatches={["policy"]}>
                                        <Policy />
                                    </FancyRoute>
                                    <FancyRoute routeMatches={["settings"]}>
                                        <Settings />
                                    </FancyRoute>
                                    <FancyRoute routeMatches={["connections/my"]}>
                                        <Contacts />
                                    </FancyRoute>
                                    <FancyRoute routeMatches={["connections/find"]}>
                                        <FindContacts />
                                    </FancyRoute>
                                    <FancyRoute routeMatches={["charts"]}>
                                        <Charts />
                                    </FancyRoute>
                                    <FancyRoute routeMatches={["categories/categoryform"]}>
                                        <CategoryForm />
                                    </FancyRoute>
                                    <FancyRoute routeMatches={["categories"]}>
                                        <Categories />
                                    </FancyRoute>
                                    <FancyRoute routeMatches={["shared"]}>
                                        <Shared />
                                    </FancyRoute>
                                    <FancyRoute routeMatches={["expenseform"]}>
                                        <ExpenseForm />
                                    </FancyRoute>
                                    <FancyRoute routeMatches={["expenseinfo"]} privatePropsContain="expenseToView">
                                        <ExpenseView />
                                    </FancyRoute>
                                    <FancyRoute routeMatches={["admin"]}>
                                        <Admin />
                                    </FancyRoute>
                                    <FancyRoute fallBack>
                                        <Home />
                                    </FancyRoute>
                                </FancyRoute>
                            </FancyRoute>
                            <FancyRoute fallBack>
                                <FancyRoute childMatches>
                                    <FancyRoute routeMatches={["about"]}>
                                        <About />
                                    </FancyRoute>
                                    <FancyRoute routeMatches={["therms"]}>
                                        <Therms />
                                    </FancyRoute>
                                    <FancyRoute routeMatches={["policy"]}>
                                        <Policy />
                                    </FancyRoute>
                                    <FancyRoute routeMatches={["register"]}>
                                        <LayoutWelcomeReg />
                                    </FancyRoute>
                                    <FancyRoute routeMatches={["reset"]}>
                                        <LayoutWelcomeRst />
                                    </FancyRoute>
                                    <FancyRoute routeMatches={["recover"]}>
                                        <LayoutWelcomeRecover />
                                    </FancyRoute>
                                    <FancyRoute routeMatches={["done"]}>
                                        <LayoutWelcomeDone />
                                    </FancyRoute>
                                    <FancyRoute fallBack>
                                        <LayoutWelcome />
                                    </FancyRoute>
                                </FancyRoute>
                            </FancyRoute>
                        </FancyRoute>
                    </FancyRoute>
                </FancyRoute>
            </div>
            <div class="site-footer">
                <Footer />
            </div>
        </div>
    }
}

export default connect(
    state => ({auth: state.auth}),
    dispatch => bindActionCreators({
        getCategories: getCategories.action,
        getContacts: getContacts.action,
        getStats: getStats.action,
        authPing: authPing.action}, dispatch)
)(Application)