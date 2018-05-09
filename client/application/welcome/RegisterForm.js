import React, {Component} from "react"
import {reduxForm} from "redux-form"
import {registerFormSubmit, loadListPublic} from "../../actions/api"
import ActionItem from "../../fancy/components/ActionItem"
import FancyListAL from "../../fancy/components/FancyListAL"
import FormFieldError from "../../fancy/components/FormFieldError"
import {routeDo} from "../../actions/app"

class RegisterForm extends Component {
    render() {
        const {fields: {name, password, passwordconfirm, email, location, country}, handleSubmit, error, submitting} = this.props;
        return <div class="panel panel-info">
            <div class="panel-body">
                <form class="form-horizontal" onSubmit={handleSubmit}>
                    <div class="form-group fg-custom">
                        <h2>Register</h2>
                        {error && <div class="alert alert-danger"> {error} </div>}
                    </div>
                    <div>
                        <div class="fg-custom form-group">
                            <label>E-Mail</label>
                            <input class="form-control" type="email" {...email}/>
                            <FormFieldError field={email}/>
                        </div>
                        <div class="form-group fg-custom">
                            <label>Name and Surname</label>
                            <input class="form-control" type="text" {...name}/>
                            <FormFieldError field={name}/>
                        </div>
                        <div class="form-group fg-custom">
                            <label>Country</label>
                            <FancyListAL
                                listName="country"
                                autoLoadAction={loadListPublic.action}
                                placeholder=" "
                                {...country} />
                            <FormFieldError field={country}/>
                        </div>
                        <div class="form-group fg-custom">
                            <label>Password</label>
                            <input class="form-control" type="password" {...password}/>
                            <FormFieldError field={password}/>
                        </div>
                        <div class="form-group fg-custom">
                            <label>Confirm Password</label>
                            <input class="form-control" type="password" {...passwordconfirm}/>
                            <FormFieldError field={passwordconfirm}/>
                        </div>
                    </div>
                    <div class="form-group fg-custom">
                        <div class="border-top">
                            <ActionItem action={routeDo} values={[""]} classes="btn btn-warning"
                                        label="Back to Login"/>
                            <button type="submit" disabled={submitting} class="btn btn-success pull-right">
                                <span>Sign Up</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    }
}

export default reduxForm({
    form: 'register',
    fields: ['name', 'password', 'passwordconfirm', 'email', 'location', 'country'],
    onSubmit: (data, dispatch) => {
        return new Promise(function (resolve, reject) {
            dispatch(registerFormSubmit.action({data, reject, resolve}))
        })
    }
})(RegisterForm)