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
import About from "./About/about.js"
import Therms from "./About/therms.js"
import Policy from "./About/policy.js"
import Settings from "./Settings"
import Footer from "./../components/Footer"
import RrRoute from "../components/RrRoute"
// import {RrRoute} from "rr-qd"

import {authPing} from '../actions/api'

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
            {/*<RrSetMomentLocale locale="us"/>*/}
            <div class="page-wrap">
                <RrRoute routeStartsWith={["error"]}>
                    <div>oops, something went wrong</div>
                    <RrRoute fallBack>
                        <RrRoute isAuthenticated>
                            <RrRoute authConfirmed>
                                <RrRoute childMatches>
                                    <RrRoute routeMatches={["about"]}>
                                        <About />
                                    </RrRoute>
                                    <RrRoute routeMatches={["therms"]}>
                                        <Therms />
                                    </RrRoute>
                                    <RrRoute routeMatches={["policy"]}>
                                        <Policy />
                                    </RrRoute>
                                    <RrRoute routeMatches={["settings"]}>
                                        <Settings />
                                    </RrRoute>
                                    <RrRoute routeMatches={["admin"]}>
                                        <Admin />
                                    </RrRoute>
                                    <RrRoute fallBack>
                                        <Home />
                                    </RrRoute>
                                </RrRoute>
                            </RrRoute>
                            <RrRoute fallBack>
                                <RrRoute childMatches>
                                    <RrRoute routeMatches={["about"]}>
                                        <About />
                                    </RrRoute>
                                    <RrRoute routeMatches={["therms"]}>
                                        <Therms />
                                    </RrRoute>
                                    <RrRoute routeMatches={["policy"]}>
                                        <Policy />
                                    </RrRoute>
                                    <RrRoute routeMatches={["register"]}>
                                        <LayoutWelcomeReg />
                                    </RrRoute>
                                    <RrRoute routeMatches={["reset"]}>
                                        <LayoutWelcomeRst />
                                    </RrRoute>
                                    <RrRoute routeMatches={["recover"]}>
                                        <LayoutWelcomeRecover />
                                    </RrRoute>
                                    <RrRoute routeMatches={["done"]}>
                                        <LayoutWelcomeDone />
                                    </RrRoute>
                                    <RrRoute fallBack>
                                        <LayoutWelcome />
                                    </RrRoute>
                                </RrRoute>
                            </RrRoute>
                        </RrRoute>
                    </RrRoute>
                </RrRoute>
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
        authPing: authPing.action
    }, dispatch)
)(Application)