import React, {Component} from "react"
import {reduxForm} from "redux-form"
import {resetFormSubmit} from "../../actions/api"
import {RrAction} from "rr-qd"
import {routeDo} from "../../actions/app"


class ResetForm extends Component {
    render() {
        const {fields: {email}, handleSubmit, error, submitting} = this.props;
        return <div>
            <div class="panel panel-info">
                <div class="panel-body">
                    <form class="form-horizontal" onSubmit={handleSubmit}>
                        <div class="form-group fg-custom">
                            <h2>Reset Your Password</h2>
                            {error && <div class="alert alert-danger"> {error} </div>}
                        </div>
                        <div>
                            <div class="fg-custom form-group">
                                <label>E-mail</label>
                                <input class="form-control" type="email" {...email} placeholder="email"/>
                            </div>
                        </div>
                        <div class="form-group fg-custom">
                            <div class="border-top">
                                <RrAction action={routeDo} values={[""]} classes="btn btn-warning"
                                            label="Back to Login"/>
                                <button type="submit" disabled={submitting} class="btn btn-success pull-right">
                                    <span>Reset</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    }
}

export default reduxForm({
    form: 'reset',
    fields: ['email'],
    onSubmit: (data, dispatch) => {
        return new Promise(function (resolve, reject) {
            dispatch(resetFormSubmit.action({data, reject, resolve}))
        })
    }
})(ResetForm)