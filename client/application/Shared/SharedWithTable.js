import React from "react"
import {connect} from "react-redux"
import moment from "moment"
import PagedTable from "../../fancy/components/PagedTable"
import ActionItem from "../../fancy/components/ActionItem"
import FancyLabelAL from "../../fancy/components/FancyLabelAL"
import {routeDo} from "../../actions/app"

class SharedWithTable extends React.Component {

    constructor(props) {
        super(props);
        this._header = this._header.bind(this)
        this._body = this._body.bind(this)
        this._diff = this._diff.bind(this)
    }

    _diff() {
        let ownerId = this.props.ownerId
        let withowner = this.props.withowner
        let totalMe = 0;
        let totalWith = 0;
        this.props.expenses.map(function (expense) {
            if (expense.ownerId === ownerId && expense.doCountShared) {
                let share = expense.shares.filter(shre => shre.ownerId === withowner)[0]
                if (share) {
                    let shareAmount = share.amount ? share.amount : 0
                    let sharePaid = share.paid ? share.paid : 0
                    totalMe += (shareAmount - sharePaid)
                }
            }
            if (expense.ownerId === withowner && expense.doCountShared) {
                let share = expense.shares.filter(shre => shre.ownerId === ownerId)[0]
                let shareAmount = share.amount ? share.amount : 0
                let sharePaid = share.paid ? share.paid : 0
                if (share) totalWith += (shareAmount - sharePaid)
            }
        })
        let difference = totalMe - totalWith;
        if (difference > 0) {
            return <span>
                <FancyLabelAL listName="contacts" value={withowner}/> ows you {difference.toFixed(2)} for the selected period</span>
        } else if (difference < 0) {
            var toPayback = (-1 * difference.toFixed(2))
            var expenseToEdit = {
                loan: true,
                date: moment().format("DD/MM/YYYY"),
                shares: [{paid: 0, ownerId: ownerId}, {ownerId: withowner, amount: toPayback}]
            }
            return <span>
                You own <FancyLabelAL listName="contacts" value={withowner}/> {toPayback} for the selected period<br />
                <ActionItem action={routeDo}
                            values={["expenseform", {expenseToEdit}]}
                            label="add payback expense"/></span>
        } else {
            return null
        }
    }

    _header() {
        let ownerId = this.props.ownerId
        let ownerName = this.props.ownerName
        let withowner = this.props.withowner
        let totalMe = 0;
        let totalWith = 0;
        this.props.expenses.map(function (expense) {
            if (expense.ownerId === ownerId && expense.doCountShared) {
                let share = expense.shares.filter(shre => shre.ownerId === withowner)[0]
                if (share) {
                    let shareAmount = share.amount ? share.amount : 0
                    let sharePaid = share.paid ? share.paid : 0
                    totalMe += (shareAmount - sharePaid)
                }
            }
            if (expense.ownerId === withowner && expense.doCountShared) {
                let share = expense.shares.filter(shre => shre.ownerId === ownerId)[0]
                let shareAmount = share.amount ? share.amount : 0
                let sharePaid = share.paid ? share.paid : 0
                if (share) totalWith += (shareAmount - sharePaid)
            }
        })
        return [[{title: 'Date', width: 120}, {title: 'Tags'},
            {title: ownerName, classes: 'text-right', width: 130},
            {title: <FancyLabelAL listName="contacts" value={withowner}/>, classes: 'text-right', width: 130}],
            [{title: ''}, {title: ''},
                {title: 'TOTAL: ' + totalMe.toFixed(2), classes: 'text-right'},
                {title: 'TOTAL: ' + totalWith.toFixed(2), classes: 'text-right'}]]
    }

    _body() {
        let ownerId = this.props.ownerId
        let withowner = this.props.withowner
        let body = []
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

            if (my || other)
                body.push({
                    cells: [
                        {value: expense.date},
                        {
                            value: <span>
                                {!expense.loan && <span>
                                    <FancyLabelAL listName="cats" value={expense.myShare.cat}/>&nbsp;
                                    <FancyLabelAL listName="subcats" value={expense.myShare.subcat}/>
                                </span>}
                                {expense.loan && <span> Loan or Payback expense
                                    {expense.isMy && " for "}
                                    {!expense.isMy && " from "}
                                    <FancyLabelAL listName="contacts" value={expense.otherLoan}/>
                                </span>}
                            </span>
                        },
                        {value: my, classes: 'text-right'},
                        {value: other, classes: 'text-right'},
                    ]
                })
        })
        return body
    }

    render() {
        let lines = this._body()
        if (this.props.withowner && lines && lines.length > 0) {
            return <div class="row">
                <div class="col-xs-12 text-right">
                    <strong>{this._diff()}</strong>
                    <br /><br />
                </div>
                <div class="col-xs-12">
                    <PagedTable header={this._header()} body={this._body()}/>
                </div>
            </div>
        }
        return <div/>
    }

}

export default connect(
    state => ({
        expenses: state.expense.all,
        withowner: state.sharedwith.withowner,
        ownerId: state.auth.userDetails._id,
        ownerName: state.auth.userDetails.name
    }),
    null
)(SharedWithTable);