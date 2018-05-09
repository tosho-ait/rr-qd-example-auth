import React from "react"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import ActionItem from "../../fancy/components/ActionItem"
import {getContacts, contactAccept, contactReject} from "../../actions/api"

class RequestsData extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        let people = null
        if (this.props.requests) {
            people = this.props.requests.map(item => {
                return (item.accepted || item.meAccepted) ? null : <div class="col-sm-12">
                    <div class="alert alert-success">
                        <div class="row">
                            <div class="col-md-8 p5t">
                                You have a contact request from {item.name}.
                            </div>
                            <div class="col-md-4 text-right">
                                <ActionItem action={contactAccept} classes="btn btn-default btn-sm"
                                            values={[{data: {fid: item.fid}}]} label="accept"/>
                                &nbsp;&nbsp;
                                <ActionItem action={contactReject} classes="btn btn-default btn-sm"
                                            values={[{data: {fid: item.fid}}]} label="reject"/>
                            </div>
                        </div>
                    </div>
                </div>
            })
        }
        return <div class="row">{people}</div>
    }
}

export default connect(
    state => ({requests: state.contact.requests}),
    dispatch => bindActionCreators({getContacts: getContacts.action}, dispatch)
)(RequestsData)