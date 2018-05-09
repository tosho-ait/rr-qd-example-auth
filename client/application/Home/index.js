import React from "react"
import NavBar from "../../components/NavBar"
import MessageBar from "../../fancy/components/MessageBar"
import PeriodSelectForm from "../../components/PeriodSelectForm"
import ExpensesTable from "./expensesTable"
import PendingTable from "./pendingTable"
import HomeInfo from "../wells/HomeInfo"
import ActionItem from "../../fancy/components/ActionItem"
import RequestsData from "../Contacts/RequestsData"
import {routeDo} from "../../actions/app"

class Home extends React.Component {

    render() {
        return <div>
            <NavBar />
            <div class="container">
                <div class="row">
                    <div class="col-sm-12">
                        <RequestsData />
                    </div>
                    <div class="col-sm-12">
                        <h1>Expenses</h1>
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
                    <div class="col-sm-4 text-right">
                        <ActionItem classes="btn btn-default "
                                    action={routeDo}
                                    values={["expenseform", {}]}
                                    label="Add Expense"/>
                    </div>
                    <div class="col-sm-12">
                        <br />
                        <br />
                    </div>
                    <div class="col-sm-12">
                        <PendingTable />
                    </div>
                    <div class="col-sm-12">
                        <ExpensesTable />
                    </div>
                    <div class="col-sm-12">
                        <HomeInfo />
                    </div>
                    <div class="col-sm-12">
                        <br />
                    </div>
                </div>
            </div>
        </div>
    }
}

export default Home