import React from "react"
import {reduxForm} from "redux-form"
import {recoverFormSubmit} from "../../actions/api"
import RrAction from "../../components/RrAction"
import {routeDo} from "../../actions/app"

class RecoverForm extends React.Component {
    render() {
        const {fields: {token, password, passwordconfirm}, handleSubmit, error, submitting} = this.props
        return <div>
            <div class="panel panel-info">
                <div class="panel-body">
                    <form class="form-horizontal" onSubmit={handleSubmit}>
                        <div class="form-group fg-custom">
                            <h2>Reset Password</h2>
                            {error && <div class="alert alert-danger"> {error} </div>}
                        </div>
                        <div>
                            <div class="form-group fg-custom">
                                <label>Password</label>
                                <input class="form-control" type="password" {...password}/>
                                {password.touched && password.error && <div>{password.error}</div>}
                            </div>
                            <div class="form-group fg-custom">
                                <label>Confirm Password</label>
                                <input class="form-control" type="password" {...passwordconfirm} />
                                {passwordconfirm.touched && passwordconfirm.error &&
                                <div>{passwordconfirm.error}</div>}
                            </div>
                        </div>
                        <div class="form-group fg-custom">
                            <div class="border-top">
                                <RrAction action={routeDo} values={[""]} classes="btn btn-warning"
                                            label="Back to Login"/>
                                <button type="submit" disabled={submitting} class="btn btn-success pull-right">
                                    <span>Reset Password</span>
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
        onSubmit: (data, dispatch) => {
            return new Promise(function (resolve, reject) {
                dispatch(recoverFormSubmit.action({data, reject, resolve}));
            })
        }
    },
    state => ({initialValues: {token: (state.router.publicprops.token) ? state.router.publicprops.token : 'none'}})
)(RecoverForm)