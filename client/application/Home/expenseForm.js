import React from "react"
import {reduxForm} from "redux-form"
import NavBar from "../../components/NavBar"
import {expenseFormSubmit} from "../../actions/api"
import moment from "moment"
import FancyListAL from "../../fancy/components/FancyListAL"
import FancyDateMegaSelect from "../../fancy/components/FancyDateMegaSelect"


class ExpenseForm extends React.Component {
    constructor(props) {
        super(props)
        moment.locale("en", {week: {dow: 1}})
    }

    componentWillMount() {
        this.beforeRender()
    }

    componentWillUpdate(nextProps, nextState) {
        this.beforeRender.bind(Object.assign(this, {props: nextProps, state: nextState}))()
    }

    beforeRender() {
        const {
            fields: {_id, date, note, shares, loan},
            handleSubmit, error, submitting
        } = this.props
        let loanOrPayback = loan.value === true
        if (loanOrPayback) {
            while (shares.length < 2) {
                shares.addField({paid: 0, amount: 0})
                shares.length++
            }
            while (shares.length > 2) {
                shares.removeField(shares.length - 1)
                shares.length--
            }
        }
    }

    render() {
        const {
            fields: {_id, date, note, shares, loan, image},
            handleSubmit, error, submitting
        } = this.props
        let loanOrPayback = loan.value === true

        let noContacts = false
        if (this.props.stats && this.props.stats.fc == 0) {
            noContacts = true
        }

        return <div>
            <NavBar />
            <div class="container">
                <form onSubmit={handleSubmit}>
                    <div class="row">
                        <div class="col-md-8 col-md-offset-2"><h1>Add Expense</h1></div>
                        <div class="col-md-10 col-md-offset-1">
                            <hr />
                        </div>
                        <div class="col-md-8 col-md-offset-2">
                            {error && <div class="alert alert-danger"> {error} </div>}
                        </div>
                        <div class="col-md-8 col-md-offset-2">
                            <div class="row">
                                <div class="col-xs-6">
                                    <div class="form-group">
                                        <label>At Date</label>
                                        <FancyDateMegaSelect {...date} />
                                    </div>
                                </div>
                                <div class="col-xs-4"></div>
                                <div class="col-xs-2">
                                    {shares.map((child, index) => <div>
                                        {index === 0 && !loanOrPayback &&
                                        <div class="form-group">
                                            <label>Paid</label>
                                            <input class="form-control"
                                                   type="number" {...child.paid}/>
                                        </div>}
                                    </div>)}
                                </div>
                            </div>
                            {shares.map((child, index) =><div>
                                {index === 0 && !loanOrPayback && <div class="row">
                                    <div class="col-xs-6">
                                        <div class="form-group">
                                            <label>Category</label>
                                            <FancyListAL listName="cats"
                                                         placeholder="category" {...child.cat} />
                                        </div>
                                    </div>
                                    <div class="col-xs-6">
                                        <div class="form-group">
                                            <label>Subcategory</label>
                                            <FancyListAL listName="subcats"
                                                         placeholder="subcategory" {...child.subcat}
                                                         filterListName="cats"
                                                         filterValue={child.cat.value}/>
                                        </div>
                                    </div>
                                </div>}
                            </div>)}
                            <div class="row">
                                <div class="col-xs-10">
                                    <div class="form-group">
                                        <label>Additional notes</label>
                                        <input type="text" class="form-control" {...note}/>
                                    </div>
                                </div>
                                <div class="col-xs-2">
                                    {!loanOrPayback && <div class="form-group">
                                        <label>Share</label>
                                        <button type="button"
                                                class="btn btn-default btn-block"
                                                disabled={noContacts}
                                                onClick={() => {
                                                    let paid = 0
                                                    let amount = 0
                                                    if (!isNaN(shares[0].paid.value / 2)) {
                                                        amount = shares[0].paid.value / 2
                                                    }
                                                    shares.addField({paid, amount})
                                                }}>
                                            <span class="glyphicon glyphicon-plus"> </span>
                                            <span class="glyphicon glyphicon-user"> </span>
                                        </button>
                                    </div>}
                                </div>
                            </div>
                            {!shares.length && <div>No Shares Defined.</div>}
                            {shares.map((child, index) => <div>
                                {index > 0 && <div class="row">
                                    <div class="col-xs-12">
                                        <hr />
                                    </div>
                                    <div class="col-xs-8">
                                        <div class="form-group">
                                            <label>Shared with</label>
                                            <FancyListAL listName="contacts"
                                                         placeholder="contect" {...child.ownerId} />
                                        </div>
                                    </div>
                                    <div class="col-xs-1">
                                        {!loanOrPayback && <div class="form-group">
                                            <div class="text-right pad0lr m23t">
                                                <button type="button" class="btn btn-default"
                                                        onClick={() => {
                                                            shares.removeField(index)
                                                        }}>
                                                    <span class="glyphicon glyphicon-remove"> </span>
                                                </button>
                                            </div>
                                        </div>}
                                    </div>
                                    <div class="col-xs-1">
                                    </div>
                                    <div class="col-xs-2">
                                        <div class="form-group">
                                            <label>Amount</label>
                                            <input class="form-control" type="number" {...child.amount}/>
                                        </div>
                                    </div>
                                    <div class="col-xs-2">
                                        <div class="form-group">
                                            {child.error}
                                        </div>
                                    </div>
                                </div> }
                            </div>)}
                        </div>
                        <div class="col-md-10 col-md-offset-1">
                            <hr />
                        </div>
                        <div class="col-md-8 col-md-offset-2">
                            <div class="row">
                                <div class="col-xs-12 text-right">
                                    <div class="checkbox">
                                        <input type="checkbox" checked={loan.value}
                                               onChange={loan.onChange}/>
                                        <label>
                                            <strong>Transfer to a Contact</strong>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-10 col-md-offset-1">
                            <hr />
                        </div>
                        { image && image.value && <div class="col-md-10 col-md-offset-1 text-center">
                            <img class="bilimg" src={"api/image/" + image.value}/>
                            <hr />
                        </div>}
                        <div class="col-md-8 col-md-offset-2 text-right">
                            <button type="submit" disabled={submitting} onClick={handleSubmit}
                                    class="btn btn-default">
                                <span>Save</span>
                            </button>
                            <br /><br />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    }
}

export default reduxForm({
        form: 'expenseform',
        fields: ['_id', 'date', 'note', 'ownerId', 'shares[]._id',
            'shares[].ownerId', 'shares[].amount', 'shares[].paid',
            'shares[].cat', 'shares[].subcat', 'loan', 'image'],
        onSubmit: (data, dispatch) => new Promise((resolve, reject) =>
            dispatch(expenseFormSubmit.action({data, reject, resolve})))
    },
    state => (state.router.privateprops.expenseToEdit)
        ? {
        initialValues: state.router.privateprops.expenseToEdit,
        stats: state.stats,
    }
        : {
        initialValues: {
            shares: [{paid: 0, ownerId: state.auth.userDetails._id}],
            date: moment().format("DD/MM/YYYY"),
        },
        stats: state.stats,
    }
)
(ExpenseForm)
