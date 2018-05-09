import {getExpenses, expenseDelete, EXP_TO_ACPT_REQ, expenseAccept, expenseReject} from "../actions/api"
import moment from "moment"

let dateFormat = "DD/MM/YYYY"

let year = moment().year()
let month = moment().month() + 1

let defaultState = {
    all: [],
    filter: '',
    period: {mode: 'm', year: year, month: month, day: 1, label: month + '/' + year},
    daysBetween: 0,
    expected: null,
    toAccept: null,
    allEmpty: true,
}


let processExpense = ownerId => expense => {
    let myPart = expense.shares.filter(shre => shre.ownerId === ownerId)[0]
    let otherPart = expense.shares.filter(shre => shre.ownerId !== ownerId)[0]
    let rejected = expense.shares.filter(shre => shre.rejected === true).length > 0
    let notAccepted = expense.shares.filter(shre => shre.accepted != true).length > 0
    expense.myShare = myPart
    if (otherPart) {
        expense.otherLoan = otherPart.ownerId
    }
    expense.rejected = rejected
    expense.notAccepted = notAccepted
    expense.isMy = expense.ownerId === ownerId
    expense.doCount = !expense.rejected && !expense.notAccepted && !expense.loan
    expense.doCountShared = !expense.rejected && !expense.notAccepted
    expense.mdate = moment.utc(expense.date, dateFormat)
    return expense;
}

const expense = (state = defaultState, action) => {

    switch (action.type) {
        case getExpenses.request:
            return Object.assign({}, state, {expected: action.meta.parameters.data})
        case getExpenses.response:
            if (state.expected
                && state.expected.period
                && action.meta.parameters.data.period
                && action.meta.parameters.data.filter == state.expected.filter
                && state.expected.period.mode == action.meta.parameters.data.period.mode
                && state.expected.period.year == action.meta.parameters.data.period.year
                && state.expected.period.month == action.meta.parameters.data.period.month
                && state.expected.period.day == action.meta.parameters.data.period.day
            ) {
                let from, to
                let all = action.payload.target.all
                let pending = action.payload.target.pending
                let ownerId = action.payload.target.ownerId
                let daysBetween = 0
                all = all.map(processExpense(ownerId))
                pending = pending.map(processExpense(ownerId))
                all.map(expense => {
                    let date = moment.utc(expense.date, dateFormat)
                    if (!from || date.isBefore(from)) {
                        from = date
                    }
                    if (!to || date.isAfter(to)) {
                        to = date
                    }
                })
                all = all.sort((a, b)=> {
                    if (a.notAccepted && b.notAccepted) {
                        return 0
                    }
                    if (a.notAccepted) {
                        return -1
                    }
                    if (b.notAccepted) {
                        return 1
                    }
                    if (b.mdate.isSame(a.mdate)) return 0
                    if (b.mdate.isAfter(a.mdate)) return 1
                    if (b.mdate.isBefore(a.mdate)) return -1
                    return 0
                })
                if (from && to) {
                    daysBetween = to.diff(from, 'days')
                }
                let allEmpty = true;
                all.map((expense) => {
                    if (!expense.notAccepted) {
                        allEmpty = false;
                    }
                })
                daysBetween++
                return Object.assign({}, state, {
                    all,
                    pending,
                    //data: action.payload.target.data,
                    period: action.meta.parameters.data.period,
                    filter: action.payload.target.filter,
                    expected: null,
                    toAccept: null,
                    daysBetween,
                    allEmpty
                })
            } else {
                return state
            }
        case expenseDelete.response:
            return Object.assign({}, state, {
                all: state.all.filter(expense => expense._id != action.payload.eid),
                pending: state.pending.filter(expense => expense._id != action.payload.eid)
            })
        case EXP_TO_ACPT_REQ:
            return Object.assign({}, state, {toAccept: action.eid})
        case expenseAccept.response:
            let allEmptyAcc = state.allEmpty
            return Object.assign(
                {},
                state,
                {
                    all: state.all.map(expense => {
                        if (expense._id == action.payload.eid) {
                            let myShare = Object.assign(
                                {},
                                expense.myShare,
                                {accepted: true, cat: action.payload.cat, subcat: action.payload.subcat})
                            expense = Object.assign({}, expense, {
                                shares: expense.shares.map(share => {
                                    if (share._id == action.payload.sid) {
                                        allEmptyAcc = false;
                                        return Object.assign(
                                            {},
                                            share,
                                            {accepted: true, cat: action.payload.cat, subcat: action.payload.subcat})
                                    }
                                    return share
                                }), rejected: false, notAccepted: false, myShare
                            })
                        }
                        return expense
                    }),
                    pending: state.pending.map(expense => {
                        if (expense._id == action.payload.eid) {
                            let myShare = Object.assign(
                                {},
                                expense.myShare,
                                {accepted: true, cat: action.payload.cat, subcat: action.payload.subcat})
                            expense = Object.assign({}, expense, {
                                shares: expense.shares.map(share => {
                                    if (share._id == action.payload.sid) {
                                        return Object.assign(
                                            {},
                                            share,
                                            {accepted: true, cat: action.payload.cat, subcat: action.payload.subcat})
                                    }
                                    return share
                                }), rejected: false, notAccepted: false, myShare
                            })
                        }
                        return expense
                    }),
                    toAccept: null,
                    allEmpty: allEmptyAcc
                })
        case expenseReject.response:
            return Object.assign(
                {},
                state,
                {
                    all: state.all.map(expense=> {
                        if (expense._id === action.payload.eid) {
                            expense = Object.assign({}, expense, {
                                shares: expense.shares.map(share => {
                                    if (share._id === action.payload.sid) {
                                        return Object.assign(
                                            {},
                                            share,
                                            {rejected: true})
                                    }
                                    return share
                                }),
                                rejected: true
                            })
                        }
                        return expense
                    }),
                    pending: state.pending.map(expense=> {
                        if (expense._id === action.payload.eid) {
                            expense = Object.assign({}, expense, {
                                shares: expense.shares.map(share => {
                                    if (share._id === action.payload.sid) {
                                        return Object.assign(
                                            {},
                                            share,
                                            {rejected: true})
                                    }
                                    return share
                                }),
                                rejected: true
                            })
                        }
                        return expense
                    }),
                    toAccept: null
                })
        default:
            return state
    }
}

export default expense



