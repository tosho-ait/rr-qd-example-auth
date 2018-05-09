import React from "react"
import {connect} from "react-redux"
import PagedTable from "../../fancy/components/PagedTable"
import FancyLabelAL from "../../fancy/components/FancyLabelAL"
import ActionItem from "../../fancy/components/ActionItem"
import AcceptForm from "./acceptForm"
import ExpenseOptions from "./expenseOptions"
import {OverlayTrigger, Tooltip} from "react-bootstrap"
import {bindActionCreators} from "redux"
import {expenseDelete, expenseToAccept, expenseAccept, expenseReject} from "../../actions/api"

class ExpensesTable extends React.Component {

    constructor(props) {
        super(props)
        this._header = this._header.bind(this)
        this._body = this._body.bind(this)
    }

    _header() {
        let ownerId = this.props.ownerId
        let total = 0;
        let daysBetween = this.props.daysBetween
        this.props.expenses.map(function (expense) {
            let share = expense.shares.filter(shre => shre.ownerId === ownerId)[0]
            if (share && expense.doCount)
                total += share.amount
        })
        let totLbl = 'TOTAL ' + total.toFixed(2)
        let avglbl = ''
        if (daysBetween > 0 && total > 0) {
            avglbl = daysBetween > 1 && daysBetween + ' days average ' + (total / daysBetween).toFixed(2)
        }
        let lbl = <span>{avglbl}&nbsp;&nbsp;&nbsp;&nbsp;{totLbl}</span>
        return [
            [
                {title: 'Date', width: 90},
                {width: 30},
                {title: 'Tags'},
                {title: 'Amount', width: 110, classes: 'text-right'},
                {width: 30}
            ], [
                {title: lbl, colSpan: 4, classes: 'text-right'},
                {}
            ]
        ]
    }

    _body() {
        let body = []
        this.props.expenses.map((expense) => {
            if (!expense.notAccepted) {
                let warn = <span/>
                if (expense.shares.length > 1)
                    warn = <OverlayTrigger placement="right"
                                           overlay={<Tooltip id="tooltip">you have shared this expense</Tooltip>}>
                        <span class="glyphicon glyphicon-plus"/>
                    </OverlayTrigger>

                if (!expense.isMy)
                    warn = <OverlayTrigger placement="right"
                                           overlay={<Tooltip id="tooltip">this expense was shared with you</Tooltip>}>
                        <span class="glyphicon glyphicon-transfer"/>
                    </OverlayTrigger>

                if (expense.notAccepted && !expense.expenseToAccept)
                    warn = <OverlayTrigger placement="right"
                                           overlay={<Tooltip id="tooltip">this shared expense is not yet
                                               accepted</Tooltip>}>
                        <span class="glyphicon glyphicon-warning-sign"/>
                    </OverlayTrigger>

                if (expense.rejected && !expense.expenseToAccept)
                    warn = <OverlayTrigger placement="right"
                                           overlay={<Tooltip id="tooltip">this shared expense was rejected</Tooltip>}>
                        <span class="glyphicon glyphicon-remove-circle"/>
                    </OverlayTrigger>

                let note = null
                if (expense.note)
                    note = <OverlayTrigger placement="right" overlay={<Tooltip id="tooltip">{expense.note}</Tooltip>}>
                        <span class="glyphicon glyphicon-tags"/>
                    </OverlayTrigger>

                let pic = null
                if (expense.image)
                    pic = <OverlayTrigger placement="right"
                                          overlay={<Tooltip id="tooltip">this expense has an attached image</Tooltip>}>
                        <span class="glyphicon glyphicon-camera"/>
                    </OverlayTrigger>

                let dropdpwn = <ExpenseOptions expense={expense}/>
                if (expense.isMy || !expense.rejected) {
                    body.push({
                        cells: [
                            {value: <div class="inline-block">{expense.date}</div>, classes: "vmiddle"},
                            {value: warn, classes: "vmiddle"},
                            {
                                value: <span>
                                {expense.loan && <span> Transfer
                                    {expense.isMy && " for "}
                                    {!expense.isMy && " from "}
                                    <FancyLabelAL listName="contacts" value={expense.otherLoan}/>&nbsp;
                                    {!expense.myShare.accepted && <span>
                                        <ActionItem classes="btn btn-xs btn-default " action={expenseAccept}
                                                    values={[{data: {_id: expense._id}}]} label="accept"/>&nbsp;

                                        <ActionItem classes="btn btn-xs btn-default " action={expenseReject}
                                                    values={[{data: {_id: expense._id}}]} label="reject"/>&nbsp;
                                    </span>}
                                </span>}
                                    {!expense.loan && expense.myShare.accepted && this.props.toAccept != expense._id &&
                                    <span>
                                    {note && <span>{note}&nbsp;&nbsp;</span>}
                                        {pic && <span>{pic}&nbsp;&nbsp;</span>}
                                        <FancyLabelAL noAutoLoad listName="cats" value={expense.myShare.cat}/>&nbsp;
                                        <FancyLabelAL noAutoLoad listName="subcats"
                                                      value={expense.myShare.subcat}/>&nbsp;&nbsp;
                                </span>}
                                    {!expense.loan && this.props.toAccept == expense._id && <span>
                                    <AcceptForm eid={expense._id}
                                                cat={expense.myShare.cat}
                                                subcat={expense.myShare.subcat}
                                                label={<span>
                                                        {pic && <span>{pic}&nbsp;&nbsp;</span>}
                                                    {note && <span>{note}&nbsp;&nbsp;</span>}
                                                    {expense.shareNote}
                                                    </span>}/>
                                </span>}
                                    {!expense.loan && !expense.myShare.accepted && this.props.toAccept != expense._id &&
                                    <span>
                                    {note && <span>{note}&nbsp;&nbsp;</span>}
                                        {pic && <span>{pic}&nbsp;&nbsp;</span>}
                                        <ActionItem classes="btn btn-xs btn-default " action={expenseToAccept}
                                                    values={[expense._id]} label="accept"/>&nbsp;
                                        <ActionItem classes="btn btn-xs btn-default " action={expenseReject}
                                                    values={[{data: {_id: expense._id}}]} label="reject"/>&nbsp;
                                        {expense.shareNote}
                                </span>}
                            </span>
                                , classes: "vmiddle"
                            },
                            {value: expense.myShare.amount.toFixed(2), classes: 'text-right vmiddle'},
                            {value: dropdpwn, classes: "vmiddle"}
                        ]
                    })
                }
            }
        })
        return body
    }

    render() {
        if (!this.props.allEmpty) {
            return <div>
                <PagedTable header={this._header()} body={this._body()}/>
                <FancyLabelAL listName="cats" value={"-"}/>
                <FancyLabelAL listName="subcats" value={"-"}/>

            </div>
        }
        return <div/>

    }
}

export default connect(
    state => ({
        daysBetween: state.expense.daysBetween,
        expenses: state.expense.all,
        allEmpty: state.expense.allEmpty,
        stale: state.track,
        toAccept: state.expense.toAccept,
        ownerId: state.auth.userDetails._id,
    }),
    dispatch => bindActionCreators({expenseDelete, expenseToAccept}, dispatch)
)(ExpensesTable)