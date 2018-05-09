import React from "react"
import {connect} from "react-redux"
import NavBar from "../../components/NavBar"
import FancyLabelAL from "../../fancy/components/FancyLabelAL"

class ExpenseView extends React.Component {

    render() {
        let expense = this.props.router.privateprops.expenseToView
        let total = 0
        expense.shares.map(share=>total += share.amount)

        return <div>
            <NavBar />
            <div class="container">
                <div class="row">
                    <div class="col-md-10 col-md-offset-1"><h1>Expense Details</h1></div>
                    <div class="col-md-10 col-md-offset-1">
                        <hr />
                    </div>
                    <div class="col-md-8 col-md-offset-2">
                        <div class="row">
                            <div class="col-xs-5">
                                <div class="form-group">
                                    <label>At Date</label>
                                    <div>{expense.date}</div>
                                </div>
                            </div>
                            <div class="col-xs-5">
                                <div class="form-group">
                                    <label>Status</label>
                                    {expense.shares.length > 1 && !expense.notAccepted &&
                                    <div>shared and accepted</div>}
                                    {expense.shares.length > 1 && expense.notAccepted &&
                                    <div>shared but not accepted</div>}
                                    {expense.shares.length == 1 && <div>not shared</div>}
                                </div>
                            </div>
                            <div class="col-xs-2">
                                <div class="form-group">
                                    <label>Total</label>
                                    <div>{total}</div>
                                </div>
                            </div>

                        </div>
                        {expense.note && <div class="row">
                            <div class="col-xs-12">
                                <div class="form-group">
                                    <label>Notes</label>
                                    <div>{expense.note}</div>
                                </div>
                            </div>
                        </div>}
                        {!expense.note && <div class="row">
                            <div class="col-xs-12">
                                <div class="form-group">
                                </div>
                            </div>
                        </div>}
                        <div class="row">
                            <div class="col-xs-5">
                                <div class="form-group">
                                    <label>Category</label>
                                    <div>
                                        <FancyLabelAL listName="cats" value={expense.myShare.cat}/>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-5">
                                <div class="form-group">
                                    <label>Subcategory</label>
                                    <div>
                                        <FancyLabelAL listName="subcats" value={expense.myShare.subcat}/>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-2">
                                <div class="form-group">
                                    <label>Amount</label>
                                    <div>{expense.myShare.amount}</div>
                                </div>
                            </div>
                        </div>
                        {expense.shares.map((child, index) =>
                            <div>
                                {child.ownerId != expense.myShare.ownerId && <div class="row">
                                    <div class="col-xs-12">
                                        <hr />
                                    </div>
                                    <div class="col-xs-7">
                                        <div class="form-group">
                                            <label>Shared with</label>
                                            <div>
                                                <FancyLabelAL listName="contacts" value={child.ownerId}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xs-3">
                                        <div class="form-group">
                                        </div>
                                    </div>
                                    <div class="col-xs-2">
                                        <div class="form-group">
                                            <label>Amount</label>
                                            <div>{child.amount}</div>
                                        </div>
                                    </div>
                                </div> }
                            </div>
                        )}
                    </div>
                    <div class="col-md-10 col-md-offset-1">
                        <hr />
                    </div>
                    { expense.image && <div class="col-md-10 col-md-offset-1 text-center">
                        <img class="bilimg" src={"api/image/" + expense.image}/>
                        <hr />
                    </div>}
                    <div class="col-md-10 col-md-offset-1">
                        <br />
                    </div>
                </div>
            </div>
        </div >
    }
}

export default connect(
    state => ({auth: state.auth, router: state.router}),
    null
)(ExpenseView)