import React from "react"
import NavBar from "../../components/NavBar"
import PeriodSelectForm from "../../components/PeriodSelectForm"
import SharedSelectForm from "../../components/SharedSelectForm"
import SharedWithTable from "./SharedWithTable"
import SharedExpensesInfo from "../wells/SharedExpensesInfo"
import RequestsData from "../Contacts/RequestsData"
import MessageBar from "../../fancy/components/MessageBar"

class Shared extends React.Component {

    render() {
        return <div>
            <NavBar />
            <div class="container">
                <div class="row">
                    <div class="col-sm-12">
                        <RequestsData />
                    </div>
                    <div class="col-sm-12">
                        <h1>Shared</h1>
                    </div>
                    <div class="col-sm-12">
                        <hr />
                    </div>
                    <div class="col-sm-12">
                        <MessageBar />
                    </div>
                    <div class="col-sm-8">
                        <PeriodSelectForm />
                    </div>
                    <div class="col-sm-4">
                        <SharedSelectForm />
                    </div>
                    <div class="col-sm-12">
                        <br />
                        <br />
                    </div>
                    <div class="col-sm-12">
                        <SharedWithTable />
                    </div>
                    <div class="col-sm-12">
                        <SharedExpensesInfo />
                    </div>
                    <div class="col-sm-12">
                        <br />
                    </div>
                </div>
            </div>
        </div>
    }
}

export default Shared