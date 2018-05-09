import React from "react"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import ActionItem from "../../fancy/components/ActionItem"
import NavBar from "../../components/NavBar"
import MessageBar from "../../fancy/components/MessageBar"
import SearchPplForm from "./SearchPplForm"
import SearchPplData from "./SearchPplData"
import ContactsData from "./ContactsData"
import RequestsData from "./RequestsData"
import {routeDo} from "../../actions/app"

class FindContacts extends React.Component {


    render() {
        return <div>
            <NavBar />
            <div class="below-navbar white">
                <div class="container">
                    <div class="row">
                        <div class="col-sm-12">
                            <RequestsData />
                        </div>
                        <div class="col-sm-7">
                            <div><h1>Contacts</h1></div>
                        </div>
                        <div class="col-sm-12">
                            <MessageBar />
                        </div>
                        <div class="col-sm-12">
                            <br />
                        </div>
                        <div class="col-sm-12">
                            <ul class="nav nav-tabs">
                                <li>
                                    <ActionItem
                                        action={routeDo}
                                        values={["connections/my", {}]}
                                        label="Your Contacts"/>
                                </li>
                                <li class="active">
                                    <ActionItem
                                        action={routeDo}
                                        values={["connections/find", {}]}
                                        label="Find New Contacts"/>
                                </li>
                            </ul>
                            <br/><br/>
                        </div>
                        <div class="col-sm-12">
                            <SearchPplForm />
                        </div>
                        <div class="col-sm-12">
                            <hr />
                        </div>
                        <div class="col-sm-12">
                            <SearchPplData />
                        </div>
                        <div class="col-sm-12">
                            <br />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default connect(
    null,
    dispatch => bindActionCreators({}, dispatch)
)(FindContacts)