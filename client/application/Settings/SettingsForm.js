import React from "react"
import {reduxForm} from "redux-form"

import FormFieldError from "../../components/FormFieldError"
import MessageBar from "../../components/MessageBar"

import {updateMe, uploadUserImage, reLoginSubmit} from "../../actions/api"
import {bindActionCreators} from "redux"

import Dropzone from "react-dropzone"

class SettingsForm extends React.Component {

    constructor(props) {
        super(props)
        this.onDrop = this.onDrop.bind(this)
    }

    componentWillMount() {
        this.beforeRender()
    }

    componentWillUpdate(nextProps, nextState) {
        this.beforeRender.bind(Object.assign(this, {props: nextProps, state: nextState}))()
    }

    beforeRender() {
        const {fields: {image}, tmpImage} = this.props
        if (tmpImage) {
            if (image.value != tmpImage) {
                image.onChange(tmpImage)
            }
        }
    }

    onDrop(acceptedFiles, rejectedFiles) {
        const formData = new FormData()
        formData.append('token', this.props.token)
        formData.append('file', acceptedFiles[0])
        this.props.uploadUserImage({formData})
    }

    render() {
        const {fields: {email, name, password, passwordconfirm, oldpassword, image}, handleSubmit, error, submitting, tmpImage} = this.props;

        let dzStyle = {
            padding: "8px",
            width: "240px",
            height: "240px",
            display: "table-cell",
            verticalAlign: "bottom",
            textAlign: "right",
            backgroundImage: "url(" + require('../_res/noimage.jpg') + ")"
        }

        if (image.value) {
            dzStyle = {...dzStyle, backgroundImage: 'url("api/img/' + image.value + '")'}
        } else {
            dzStyle = {...dzStyle, border: "solid 1px #ccc"}
        }

        return <form onSubmit={handleSubmit}>
            <div class="row">
                <div class="col-md-10 col-md-offset-1"><h1>Account Settings</h1></div>
                <div class="col-md-10 col-md-offset-1">
                    <hr />
                </div>
                <div class="col-md-10 col-md-offset-1">
                    <div class="row">
                        {error && <div class="col-xs-12">
                            <div class="alert alert-danger"> {error} </div>
                        </div>}
                        <div class="col-xs-12">
                            <MessageBar />
                        </div>
                        <div class="col-xs-4">
                            <br />
                            <div class="pull-right">
                                <Dropzone onDrop={this.onDrop} style={dzStyle}>
                                    <span class="glyphicon glyphicon-edit"/>
                                </Dropzone>
                            </div>
                        </div>
                        <div class="col-xs-8">
                            <div class="row">
                                <div class="col-xs-12">
                                    <div class="form-group">
                                        <label>E-Mail</label>
                                        <input disabled class="form-control" type="text" {...email}/>
                                    </div>
                                </div>
                                <div class="col-xs-12">
                                    <div class="form-group">
                                        <label>Name</label>
                                        <input class="form-control" type="text" {...name}/>
                                        <FormFieldError field={name}/>
                                    </div>
                                </div>
                                <div class="col-xs-12">
                                    <br />
                                    <label>Update your Password</label>
                                    <hr class="mt0"/>
                                </div>
                                <div class="col-xs-12">
                                    <div class="form-group">
                                        <label>New Password</label>
                                        <input class="form-control" type="password" {...password}/>
                                        <FormFieldError field={password}/>
                                    </div>
                                </div>
                                <div class="col-xs-12">
                                    <div class="form-group">
                                        <label>Confirm Password</label>
                                        <input class="form-control" type="password" {...passwordconfirm}/>
                                        <FormFieldError field={passwordconfirm}/>
                                    </div>
                                </div>
                                <div class="col-xs-12">
                                    <div class="form-group">
                                        <label>Current Password</label>
                                        <input class="form-control" type="password" {...oldpassword}/>
                                        <FormFieldError field={oldpassword}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-10 col-md-offset-1">
                    <hr />
                </div>
                <div class="col-md-10 col-md-offset-1 text-right">
                    <button type="submit" class="btn btn-default">
                        <span>Save Settings</span>
                    </button>
                    <br />
                    <br />
                </div>
            </div>
        </form>
    }
}

export default reduxForm({
        form: 'settings',
        fields: ['email', 'name', 'password', 'passwordconfirm', 'oldpassword', 'location', 'country', 'image'],
        onSubmit: (data, dispatch) => {
            return new Promise(function (resolve, reject) {
                dispatch(updateMe.action({data, reject, resolve}))
            }).then(() => {
                // refresh user details
                dispatch(reLoginSubmit.action({}))
            })
        }
    },
    state => ({initialValues: state.auth.userDetails, token: state.auth.token, tmpImage: state.user.image}),
    dispatch => bindActionCreators({uploadUserImage: uploadUserImage.action}, dispatch)
)(SettingsForm)
