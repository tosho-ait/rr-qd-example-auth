import React from "react"
import {connect} from "react-redux"
import {routeDo} from "../../actions/app"
import ActionItem from "../../fancy/components/ActionItem"


class HomeInfo extends React.Component {

    render() {
        // new user without any expenses
        if (this.props.stats && this.props.stats.ec == 0) {
            if (this.props.track.stale["stats"] == this.props.track.STALE_NOT) {
                return <div class="well">
                    <h4>Wellcome!</h4>
                    <br />
                    <h5>This is your home screen. It contains a list of your Expenses.</h5>
                    <h5>You can view yor Expenses by Period or optionally a Filter from the controls above.</h5>
                    <br />
                    <h5>But first, you can start by adding expenses using the "Add Expense" button.</h5>
                    <h5>You also need to
                        <ActionItem action={routeDo} values={["categories", {}]}>
                            configure the Categories and Subcategories </ActionItem>
                        you assign your Expenses to.</h5>
                </div>
            }
        }
        if (this.props.allEmpty) {
            if (this.props.track.stale["expenses"] == this.props.track.STALE_NOT) {
                return <div class="well">
                    <h4>You have no expenses registered for the selected period and filters.</h4>
                </div>
            }
        }
        return <div/>
    }
}

export default connect(
    state => ({
        expenses: state.expense.all,
        allEmpty: state.expense.allEmpty,
        track: state.track,
        stats: state.stats,
    }),
    null
)(HomeInfo)