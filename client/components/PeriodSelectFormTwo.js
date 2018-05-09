import React from "react"
import {reduxForm} from "redux-form"
import PeriodSelect from "./PeriodSelect"
import {getExpenses} from "../actions/api"


class PeriodSelectFormTwo extends React.Component {

    constructor(props) {
        super(props)
        this.onSubmit = this.onSubmit.bind(this)
        if (!props.state.track.stale["expenses"]) {
            let dispatch = this.props.dispatch
            dispatch(getExpenses.action({data: {period: this.props.fields.period.value}}))
        }
    }

    onSubmit(data) {
        let dispatch = this.props.dispatch
        return new Promise(function (resolve, reject) {
            dispatch(getExpenses.action({data, reject, resolve}))
        })
    }

    componentWillMount() {
        this.beforeRender()
    }

    componentWillUpdate(nextProps, nextState) {
        this.beforeRender.bind(Object.assign(this, {props: nextProps, state: nextState}))()
    }

    beforeRender() {
        const {fields: {period, filter}, handleSubmit, state} = this.props
        if (state.track.stale["expenses"] && state.track.stale["expenses"] < state.track.STALE_LOAD) {
            handleSubmit(this.onSubmit({period: period.value, filter: filter.value}))
        }
    }

    render() {
        const {fields: {period, filter}, handleSubmit, error, submitting} = this.props
        return <div>
            <form class="form-horizontal">
                <div class="row">
                    <div class="col-sm-6">
                        <PeriodSelect {...period}
                                      onSubmit={this.onSubmit}
                                      handleSubmit={handleSubmit.bind(this)}
                                      onChange={value=> {
                                          period.onChange(value)
                                          handleSubmit(this.onSubmit({period: value, filter: filter.value}))
                                      }}
                        />
                    </div>
                    <div class="col-sm-6">
                        <input type="text"
                               placeholder="filter expenses"
                               {...filter}
                               onChange={event=> {
                                   filter.onChange(event)
                                   handleSubmit(this.onSubmit({period: period.value, filter: event.target.value}))
                               }} class="form-control"/>
                    </div>
                </div>
            </form>
        </div>
    }
}

export default reduxForm({
        form: 'periodselecttwo',
        fields: ['period', 'filter']
    },
    state => ({state, initialValues: {period: state.expense.period, filter: state.expense.filter}} ))
(PeriodSelectFormTwo)