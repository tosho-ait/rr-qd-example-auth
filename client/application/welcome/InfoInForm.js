import React from "react"
import RrAction from "../../components/RrAction"
import {routeDo} from "../../actions/app"

class InfoInForm extends React.Component {
    render() {
        const {message} = this.props

        return <div>
            <div class="panel panel-info">
                <div class="panel-body">
                    <div class="form-group fg-custom">
                        <h2>Done</h2>
                    </div>
                    <div>
                        <div class="fg-custom form-group">
                            <div class="alert alert-success">{message}</div>
                        </div>
                    </div>
                    <div class="form-group fg-custom">
                        <div class="border-top">
                            <RrAction action={routeDo} values={[""]} classes="btn btn-warning"
                                      label="Back to Login"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default InfoInForm