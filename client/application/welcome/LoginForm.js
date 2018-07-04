import React from "react"
import {reduxForm} from "redux-form"
import {RrAction} from "rr-qd"
import FormFieldError from "../../components/FormFieldError"
import {loginSubmit} from "../../actions/api"
import {routeDo} from "../../actions/app"

class LoginForm extends React.Component {
    render() {
        const {fields: {password, email}, handleSubmit, error, submitting} = this.props
        return <div>
            <div class="panel panel-info">
                <div class="panel-body">
                    <form class="form-horizontal" onSubmit={handleSubmit}>
                        <div class="form-group fg-custom">
                            <h2>Login</h2>
                            {error && <div class="alert alert-danger"> {error} </div>}
                        </div>
                        <div>
                            <div class="fg-custom form-group">
                                <label>E-Mail</label>
                                <input class="form-control" type="email" {...email}/>
                                <FormFieldError field={email}/>
                            </div>
                            <div class="form-group fg-custom">
                                <label>Password</label>
                                <input class="form-control" type="password" {...password}/>
                                <FormFieldError field={password}/>
                            </div>
                        </div>
                        <div class="form-group fg-custom">
                            <div class="input-group">
                                <RrAction action={routeDo} values={["reset"]} label="Forgot Password?"/>
                            </div>
                        </div>
                        <div class="form-group fg-custom">
                            <div>
                                <button type="submit" disabled={submitting} class="btn btn-success pull-right">
                                    <span>Login</span>
                                </button>
                            </div>
                        </div>
                        <div class="form-group fg-custom">
                            <div class="border-top">
                                Don't have an account? <RrAction action={routeDo} values={["register"]}>Sign Up Here</RrAction>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    }
}

export default reduxForm({
    form: 'login',
    fields: ['password', 'email'],
    onSubmit: (data, dispatch) => {
        return new Promise(function (resolve, reject) {
            dispatch(loginSubmit.action({data, reject, resolve}))
        })
    }
})(LoginForm)