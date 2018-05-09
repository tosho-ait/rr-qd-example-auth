import React from "react"
import {connect} from "react-redux"
import {Tabs, Tab} from "react-bootstrap"
import CategoriesTable from "./categoriesTable"
import SubcatsTable from "./subcatsTable"
import CategoriesChart from "./categoriesChart"
import SubcatsChart from "./subcatsChart"
import {Chart} from "react-google-charts"

class ChartsTabs extends React.Component {

    render() {
        if (!this.props.allEmpty) {
            return <div>
                <Tabs defaultActiveKey={0} id="uncontrolled-tab-example">
                    <Tab eventKey={0} title="all">
                        <div key={0} class="row">
                            <div class="col-sm-6">
                                <CategoriesTable daysBetween={this.props.daysBetween} cats={this.props.cats}
                                                 expenses={this.props.expenses}/>
                            </div>
                            <div class="col-sm-6">
                                <CategoriesChart gid="all" cats={this.props.cats}
                                                 expenses={this.props.expenses}/>
                            </div>
                        </div>
                    </Tab>
                    {this.props.cats.map((cat, index)=> <Tab eventKey={index + 2} title={cat.label}>
                        <div key={index + 2} class="row">
                            <div class="col-sm-6">
                                <SubcatsTable daysBetween={this.props.daysBetween} catid={cat._id}
                                              subcats={cat.subcats} expenses={this.props.expenses}/>
                            </div>
                            <div class="col-sm-6">
                                <SubcatsChart gid={cat.label} catid={cat._id} subcats={cat.subcats}
                                              expenses={this.props.expenses}/>
                            </div>
                        </div>
                    </Tab>)}
                </Tabs>
            </div>
        }
        return <div/>
    }

}

export default connect(
    state => ({
        daysBetween: state.expense.daysBetween,
        cats: state.category.all,
        allEmpty: state.expense.allEmpty,
        stale: state.track,
        expenses: state.expense.all,
        owner: state.auth.userDetails.email
    }),
    null
)(ChartsTabs)