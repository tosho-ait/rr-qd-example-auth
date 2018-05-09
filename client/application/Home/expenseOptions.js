import React from "react"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {DropdownButton, MenuItem} from "react-bootstrap"
import {expenseDelete, expenseToAccept} from "../../actions/api"
import {routeDo} from "../../actions/app"

class ExpenseOptions extends React.Component {
    render() {
        let expense = this.props.expense
        let expenseDelete = this.props.expenseDelete
        let expenseToAccept = this.props.expenseToAccept
        let routeDo = this.props.routeDo

        return (expense.isMy)
            ? <DropdownButton bsSize="xsmall"
                              pullRight bsStyle="default"
                              title={<span class="glyphicon glyphicon-align-justify"/>}
                              noCaret>
            <MenuItem eventKey="4"
                      onSelect={(eventKey, event) => {
                          routeDo("expenseform", {expenseToEdit: {...expense, _id: null}})
                      }}>copy</MenuItem>
            <MenuItem eventKey="1"
                      onSelect={(eventKey, event) => {
                          routeDo("expenseinfo", {expenseToView: expense})
                      }}>view</MenuItem>
            <MenuItem divider/>
            {!expense.loan && <MenuItem eventKey="2"
                                        onSelect={(eventKey, event) => {
                                            expenseToAccept(expense._id)
                                        }}>edit tags</MenuItem>}
            <MenuItem eventKey="3"
                      onSelect={(eventKey, event) => {
                          routeDo("expenseform", {expenseToEdit: expense})
                      }}>edit</MenuItem>
            <MenuItem divider/>
            <MenuItem eventKey="5"
                      onSelect={(eventKey, event) => {
                          expenseDelete({data: {eid: expense._id}})
                      }}>delete</MenuItem>
        </DropdownButton>
            : <DropdownButton bsSize="xsmall"
                              pullRight bsStyle="default"
                              title={<span class="glyphicon glyphicon-align-justify"/>}
                              noCaret>
            <MenuItem eventKey="1"
                      onSelect={(eventKey, event) => {
                          routeDo("expenseinfo", {expenseToView: expense})
                      }}>view expense</MenuItem>
            {!expense.loan && <MenuItem eventKey="2"
                                        onSelect={(eventKey, event) => {
                                            expenseToAccept(expense._id)
                                        }}>edit tags</MenuItem>}
        </DropdownButton>
    }
}

export default connect(
    null,
    dispatch => bindActionCreators({
        routeDo,
        expenseDelete: expenseDelete.action,
        expenseToAccept
    }, dispatch)
)(ExpenseOptions)