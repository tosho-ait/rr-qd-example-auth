import React from "react"
import {connect} from "react-redux"
import {routeDo} from "../../actions/app"
import ActionItem from "../../fancy/components/ActionItem"

class SharedExpensesInfo extends React.Component {

    constructor(props) {
        super(props);
        this._body = this._body.bind(this)
    }

    _body() {
        let ownerId = this.props.ownerId
        let withowner = this.props.withowner
        let toReturn = false
        this.props.expenses.map(function (expense) {
            let my, other

            if (expense.ownerId === ownerId && expense.doCountShared) {
                let share = expense.shares.filter(shre => shre.ownerId === withowner)[0]
                if (share) my = (share.amount - share.paid)
            }

            if (expense.ownerId === withowner && expense.doCountShared) {
                let mySharePaid = expense.myShare.paid ? expense.myShare.paid : 0
                let myShareAmount = expense.myShare.amount ? expense.myShare.amount : 0
                if (expense.myShare) other = (myShareAmount - mySharePaid)
            }

            if (my || other) {
                toReturn = true
            }

        })
        return toReturn
    }

    render() {
        // new user without any expenses
        if (this.props.stats && this.props.stats.fc == 0) {
            if (this.props.track.stale["stats"] == this.props.track.STALE_NOT) {
                return <div class="well">
                    <h4>Wellcome!</h4>
                    <br />
                    <h5>This is your home shared expenses screen.</h5>
                    <h5>It shows you your balance of hared expenses with other people.</h5>
                    <br />
                    <h5>You need to
                        <ActionItem action={routeDo} values={["connections/find", {}]}>
                            add other people as contacts </ActionItem>
                        if you want to keep track of shared expenses with them.</h5>
                </div>
            }
        }
        let withowner = this.props.withowner
        if (this.props.track.stale["expenses"] == this.props.track.STALE_NOT) {
            if (!withowner || withowner.length < 1) {
                return <div class="well">
                    <h4>Select a contact to view your shared expenses.</h4></div>
            }

            if (withowner && !this._body()) {
                return <div class="well">
                    <h4>You have no expenses registered for the selected period, filters and contact.</h4>
                </div>
            }
        }

        return <div/>
    }
}

export default connect(
    state => ({
        expenses: state.expense.all,
        withowner: state.sharedwith.withowner,
        ownerId: state.auth.userDetails._id,
        ownerName: state.auth.userDetails.name,
        stats: state.stats,
        track: state.track,
    }),
    null
)(SharedExpensesInfo);