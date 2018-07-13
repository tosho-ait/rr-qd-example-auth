import React from "react"
import {reduxForm} from "redux-form"
import {confirmEmailSubmit} from "../../actions/api"
import {RrAction} from "rr-qd"
import {routeDo} from "../../actions/app"

class ConfirmForm extends React.Component {
    render() {
        const {fields: {token}, handleSubmit, error, submitting} = this.props
        return <div>
            <div class="panel panel-info">
                <div class="panel-body">
                    <form class="form-horizontal" onSubmit={handleSubmit}>
                        <div class="form-group fg-custom">
                            <h2>Confirm e-mail</h2>
                            {error && <div class="alert alert-danger"> {error} </div>}
                        </div>
                        <div class="form-group fg-custom">
                            <div class="border-top">
                                <RrAction action={routeDo} values={[""]} classes="btn btn-warning">Back to
                                    Login</RrAction>
                                <button type="submit" disabled={submitting} class="btn btn-success pull-right">
                                    <span>Confirm e-mail</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    }
}

export default  reduxForm({
        form: 'recover',
        fields: ['token'],
        onSubmit: (data, dispatch) => new Promise((resolve, reject) =>
            dispatch(confirmEmailSubmit.action({data, reject, resolve})))
    },
    state => ({initialValues: {token: (state.router.publicprops.token) ? state.router.publicprops.token : 'none'}})
)(ConfirmForm)