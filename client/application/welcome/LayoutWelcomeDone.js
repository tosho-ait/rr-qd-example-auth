import React from "react"
import NavBar from "../../components/NavBar"
import WelcomeJumbo from "./WelcomeJumbo"
import {connect} from "react-redux"
import RrAction from "../../components/RrAction"
import {routeDo} from "../../actions/app"


class LayoutWelcomeDone extends React.Component {

    render() {
        const {messages} = this.props
        
        return <div>
            <NavBar />
            <div class="container">
                <div class="row">
                    <div class="col-md-6">
                        <WelcomeJumbo />
                    </div>
                    <div class="col-md-6">
                        <div class="panel panel-info">
                            <div class="panel-body">
                                <div class="form-group fg-custom">
                                    <h2>Done</h2>
                                </div>
                                <div>
                                    <div class="fg-custom form-group">
                                        {messages._message &&
                                        <div class="alert alert-success">
                                            <span>{messages._message.text}<br /> </span>
                                        </div>}
                                    </div>
                                </div>
                                <div class="form-group fg-custom">
                                    <div class="border-top">
                                        <RrAction action={routeDo}
                                                    values={[""]}
                                                    classes="btn btn-warning"
                                                    label="Back to Login"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default connect(
    (state) => ({messages: state.router.messages}),
    (dispatch) => ({})
)(LayoutWelcomeDone)
