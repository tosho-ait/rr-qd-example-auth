import React from "react"
import {reduxForm} from "redux-form"
import {recoverFormSubmit} from "../../../actions/api"
import {RrAction} from "rr-qd"
import FormFieldError from "../../../fancy/FormFieldError"
import {routeDo} from "../../../actions/app"

class RecoverForm extends React.Component {
    render() {
        const {fields: {token, password, passwordconfirm}, handleSubmit, error, submitting} = this.props
        return <div>
            <div class="panel panel-info">
                <div class="panel-body">
                    <form class="form-horizontal" onSubmit={handleSubmit}>
                        <div class="form-group fg-custom">
                            <h2>Reset password</h2>
                            {error && <div class="alert alert-danger"> {error} </div>}
                        </div>
                        <div>
                            <div class="form-group fg-custom">
                                <label>Password</label>
                                <input class="form-control" type="password" {...password}/>
                                <FormFieldError field={password}/>
                            </div>
                            <div class="form-group fg-custom">
                                <label>Confirm password</label>
                                <input class="form-control" type="password" {...passwordconfirm} />
                                <FormFieldError field={passwordconfirm}/>
                            </div>
                        </div>
                        <div class="form-group fg-custom">
                            <div class="border-top">
                                <RrAction action={routeDo} values={[""]} classes="btn btn-warning">Back to
                                    login</RrAction>
                                <button type="submit" disabled={submitting} class="btn btn-success pull-right">
                                    <span>Reset password</span>
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
        fields: ['token', 'password', 'passwordconfirm'],
        onSubmit: (data, dispatch) => new Promise((resolve, reject) =>
            dispatch(recoverFormSubmit.action({data, reject, resolve})))
    },
    state => ({initialValues: {token: (state.router.publicprops.token) ? state.router.publicprops.token : 'none'}})
)(RecoverForm)