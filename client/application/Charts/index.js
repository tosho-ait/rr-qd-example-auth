import React from "react"
import NavBar from "../../components/NavBar"
import PeriodSelectFormTwo from "../../components/PeriodSelectFormTwo"
import ChartsTabs from "./chartsTabs"
import RequestsData from "../Contacts/RequestsData"
import MessageBar from "../../fancy/components/MessageBar"
import HomeInfo from "../wells/HomeInfo"

class Charts extends React.Component {

    render() {
        return <div>
            <NavBar />
            <div class="container">
                <div class="row">
                    <div class="col-sm-12">
                        <RequestsData />
                    </div>
                    <div class="col-sm-12">
                        <h1>Charts</h1>
                    </div>
                    <div class="col-sm-12">
                        <hr />
                    </div>
                    <div class="col-sm-12">
                        <MessageBar />
                    </div>
                    <div class="col-sm-8">
                        <PeriodSelectFormTwo />
                    </div>
                    <div class="col-sm-4">
                    </div>
                    <div class="col-sm-12">
                        <br />
                        <br />
                    </div>
                    <div class="col-sm-12">
                        <ChartsTabs />
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

export default Charts