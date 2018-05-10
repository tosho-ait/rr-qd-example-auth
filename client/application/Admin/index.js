import React from "react"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import NavBar from "../../components/NavBar"
import MessageBar from "../../components/MessageBar"

import RrAction from "../../components/RrAction"

import {
    adminUsers,
    updaterCategory,
    updaterExpense,
    updaterContact,
    updaterImage,
    updaterUserImage
} from "../../actions/api"

import moment from "moment"

class Admin extends React.Component {

    constructor(props) {
        super(props);
        this.props.adminUsers()
        this._header = this._header.bind(this)
        this._body = this._body.bind(this)
    }

    _header() {
        return [[{title: 'email'},
            {title: 'name'},
            {title: 'location'},
            {title: 'date'}]]
    }

    _body() {
        let body = []
        this.props.admin.users.map(user => {
            body.push({
                cells: [
                    {value: user.email},
                    {value: user.name},
                    {value: user.location},
                    {value: moment(user.created_at).format("DD MM YYYY")}
                ]
            })
        })
        return body
    }

    render() {
        return <div>
            <NavBar />
            <div class="container">
                <div class="row">
                    <div class="col-sm-12">
                        <div><h1>Hello My Master!</h1></div>
                    </div>
                    <div class="col-sm-12">
                        <hr />
                    </div>
                    <div class="col-sm-12">
                        <MessageBar />
                    </div>
                    <div class="col-sm-12">
                        <RrAction action={updaterCategory} label="Update Categories" classes="btn btn-default"/>
                        &nbsp;
                        <RrAction action={updaterExpense} label="Update Expenses" classes="btn btn-default"/>
                        &nbsp;
                        <RrAction action={updaterContact} label="Update conatcts" classes="btn btn-default"/>
                        &nbsp;
                        <RrAction action={updaterImage} label="Update images" classes="btn btn-default"/>
                        &nbsp;
                        <RrAction action={updaterUserImage} label="Update user images" classes="btn btn-default"/>
                    </div>
                    <div class="col-sm-12">
                        {/*<PagedTable header={this._header()} body={this._body()}/>*/}
                    </div>
                    <div class="col-sm-12">
                        <br />
                    </div>
                </div>
            </div>
        </div>
    }
}

export default connect(
    state => ({admin: state.admin}),
    dispatch => bindActionCreators({adminUsers: adminUsers.action}, dispatch)
)(Admin)