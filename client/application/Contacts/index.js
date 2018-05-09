import React from "react"
import ActionItem from "../../fancy/components/ActionItem"
import NavBar from "../../components/NavBar"
import MessageBar from "../../fancy/components/MessageBar"
import ContactsData from "./ContactsData"
import RequestsData from "./RequestsData"
import {routeDo} from "../../actions/app"

class Contacts extends React.Component {

    render() {
        return <div>
            <NavBar />
            <div class="container">
                <div class="row">
                    <div class="col-sm-12">
                        <RequestsData />
                    </div>
                    <div class="col-sm-12">
                        <h1>Contacts</h1>
                    </div>
                    <div class="col-sm-12">
                        <br />
                    </div>
                    <div class="col-sm-12">
                        <MessageBar />
                    </div>
                    <div class="col-sm-12">
                        <ul class="nav nav-tabs">
                            <li class="active">
                                <ActionItem
                                    action={routeDo}
                                    values={["connections/my", {}]}
                                    label="Your Contacts"/>
                            </li>
                            <li>
                                <ActionItem
                                    action={routeDo}
                                    values={["connections/find", {}]}
                                    label="Find New Contacts"/>
                            </li>
                        </ul>
                        <br/>
                    </div>
                    <div class="col-sm-12">
                        <ContactsData />
                    </div>
                    <div class="col-sm-12">
                        <br />
                    </div>
                </div>
            </div>
        </div>
    }
}

export default Contacts