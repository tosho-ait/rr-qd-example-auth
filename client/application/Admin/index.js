import React from "react"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import NavBar from "../../components/NavBar"
import MessageBar from "../../fancy/MessageBar"
import PagedTable from "../../fancy/PagedTable"
import {RrAction, RrStale} from "rr-qd"
import {adminUsers, adminActivateUser, adminDeactivateUser} from "../../actions/api"
import moment from "moment"

class Admin extends React.Component {

    constructor(props) {
        super(props)
        this._header = this._header.bind(this)
        this._body = this._body.bind(this)
    }

    _header() {
        return [[
            {title: 'email'},
            {title: 'name'},
            {title: 'active'},
            {title: 'reg date'}]]
    }

    _body() {
        let body = []
        this.props.admin.users.map(user => {
            body.push({
                childRows: [{cells: [{colSpan: 4, classes: "text-right", value:
                <div>
                    <RrAction action={adminActivateUser}
                              values={[{data:{userId: user._id}}]}
                              classes="btn btn-default btn-xs">Activate</RrAction>&nbsp;
                    <RrAction action={adminDeactivateUser}
                              values={[{data:{userId: user._id}}]}
                              classes="btn btn-default btn-xs">Deactivate</RrAction>
                </div>
                }]}],
                onExpand: (row) => {

                },
                cells: [
                    {value: user.email, width: 300},
                    {value: user.name},
                    {value: user.active ? "yes" :"no", width: 100},
                    {value: moment(user.created_at).format("DD MM YYYY"), width: 110}
                ]
            })
        })
        return body
    }

    render() {
        return <div>
            <RrStale target={adminUsers} callOnInit/>
            <NavBar />
            <div class="container">
                <div class="row">
                    <div class="col-sm-12">
                        <h1>Admin panel</h1>
                    </div>
                    <div class="col-sm-12">
                        <hr />
                    </div>
                    <div class="col-sm-12">
                        <MessageBar />
                    </div>
                    <div class="col-sm-12">
                        <h3>Users</h3>
                    </div>
                    <div class="col-sm-12">
                        <PagedTable expandable header={this._header()} body={this._body()}/>
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