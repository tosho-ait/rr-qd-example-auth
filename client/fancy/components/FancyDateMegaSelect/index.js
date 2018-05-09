import React from 'react'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import moment from 'moment'
import {Popover, OverlayTrigger} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import * as LABELS from '../../config/labels'

import './index.css'
import './calendar.css'

let DSP_DAYS = 1
let DSP_WEEKS = 2
let DSP_MONTHS = 3

let DSP_QUARTS = 4
let DSP_YEARS = 5

let FORMAT_DAYS = "DD/MM/YYYY"
let FORMAT_WEEKS = "WW/YYYY"
let FORMAT_MONTHS = "MM/YYYY"
let FORMAT_QUARTS_Y = "YYYY"
let FORMAT_YEARS = "YYYY"

let UTYPE_DAYS = "DAYS"
let UTYPE_WEEKS = "WEEKS"
let UTYPE_MONTHS = "MONTHS"
let UTYPE_QUARTS = "QUARTS"
let UTYPE_YEARS = "YEARS"

// In short:
// Date Form input component.
//
// Properties for this component:
// value -
// max -
// min -
// onChange -
// unitType -
// multi -
// disabled -
// placeholder -
// sizeSmall -
// error -
// errorInPopup -
// errorBelow -

class FancyDateMegaSelect extends React.Component {

    constructor(props) {
        super(props)
        this._onChange = this._onChange.bind(this);
        this._displayLeft = this._displayLeft.bind(this);
        this._displayRight = this._displayRight.bind(this);
        this._displayDown = this._displayDown.bind(this);
        this._displayUp = this._displayUp.bind(this);
        this._menuRenderer = this._menuRenderer.bind(this);
        this._renderDays = this._renderDays.bind(this);
        this._renderMonths = this._renderMonths.bind(this);
        this._renderYears = this._renderYears.bind(this);
        this._renderWeeks = this._renderWeeks.bind(this);
        this._renderQuarts = this._renderQuarts.bind(this);

        let displayView = DSP_DAYS
        let unitType = UTYPE_DAYS

        if (props.unitType == UTYPE_MONTHS) {
            displayView = DSP_MONTHS
            unitType = UTYPE_MONTHS
        } else if (props.unitType == UTYPE_YEARS) {
            displayView = DSP_YEARS
            unitType = UTYPE_YEARS
        } else if (props.unitType == UTYPE_WEEKS) {
            displayView = DSP_WEEKS
            unitType = UTYPE_WEEKS
        } else if (props.unitType == UTYPE_QUARTS) {
            displayView = DSP_QUARTS
            unitType = UTYPE_QUARTS
        } else {
            displayView = DSP_DAYS
            unitType = UTYPE_DAYS
        }

        this.state = {displayDate: moment(), displayView, unitType}
    }

    componentWillMount() {
        this.beforeRender()
    }

    componentWillUpdate(nextProps, nextState) {
        this.beforeRender.bind(Object.assign(this, {props: nextProps, state: nextState}))()
    }

    beforeRender() {
        let multi = this.props.multi
        let value = this.props.value
        let max = this.props.max
        let min = this.props.min

        if (value && value.constructor == Array && !multi) {
            if (value.length > 0) {
                this._onChange(value[0])
            } else {
                this._onChange()
            }
        } else if (value && value.constructor != Array && multi) {
            this._onChange([value])
        } else if (value && max && !multi) {
            // TODO works only for months, days and single value...
            if (this.state.unitType == UTYPE_MONTHS) {
                let maxDate = moment(max, FORMAT_MONTHS)
                let valDate = moment(value, FORMAT_MONTHS)
                if (valDate.isAfter(maxDate)) {
                    this._onChange()
                }
            }
            if (this.state.unitType == UTYPE_DAYS) {
                let maxDate = moment(max, FORMAT_DAYS)
                let valDate = moment(value, FORMAT_DAYS)
                if (valDate.isAfter(maxDate)) {
                    this._onChange()
                }
            }
        } else if (value && min && !multi) {
            // TODO works only for days and single value...
            if (this.state.unitType == UTYPE_DAYS) {
                let minDate = moment(min, FORMAT_DAYS)
                let valDate = moment(value, FORMAT_DAYS)
                if (valDate.isBefore(minDate)) {
                    this._onChange()
                }
            }
        }
    }

    _displayLeft(e) {
        e && e.preventDefault && e.preventDefault()
        let displayView = this.state.displayView
        if (displayView == DSP_DAYS || displayView == DSP_WEEKS) {
            this.setState({displayDate: this.state.displayDate.subtract(1, 'months')})
        } else if (displayView == DSP_MONTHS || displayView == DSP_QUARTS) {
            this.setState({displayDate: this.state.displayDate.subtract(1, 'years')})
        } else if (displayView == DSP_YEARS) {
            this.setState({displayDate: this.state.displayDate.subtract(10, 'years')})
        }
    }

    _displayRight(e) {
        e && e.preventDefault && e.preventDefault()
        let displayView = this.state.displayView
        if (displayView == DSP_DAYS || displayView == DSP_WEEKS) {
            this.setState({displayDate: this.state.displayDate.add(1, 'months')})
        } else if (displayView == DSP_MONTHS || displayView == DSP_QUARTS) {
            this.setState({displayDate: this.state.displayDate.add(1, 'years')})
        } else if (displayView == DSP_YEARS) {
            this.setState({displayDate: this.state.displayDate.add(10, 'years')})
        }
    }

    _displayDown(value, selectValue) {
        let multi = this.props.multi
        let displayView = this.state.displayView
        let unitType = this.state.unitType
        if (unitType == UTYPE_DAYS) {
            if (displayView == DSP_DAYS) {
                //we have reached end of down, we need to set the value
                if (multi) {
                    this._onChange(value)
                } else {
                    selectValue(value)
                }
            } else if (displayView == DSP_MONTHS) {
                let downTo = moment(value, FORMAT_MONTHS)
                let displayDate = this.state.displayDate.clone()
                displayDate.year(downTo.year())
                displayDate.month(downTo.month())
                this.setState({displayView: DSP_DAYS, displayDate})
            } else if (displayView == DSP_YEARS) {
                let downTo = moment(value, FORMAT_YEARS)
                let displayDate = this.state.displayDate.clone()
                displayDate.year(downTo.year())
                this.setState({displayView: DSP_MONTHS, displayDate})
            }
        } else if (unitType == UTYPE_WEEKS) {
            if (displayView == DSP_WEEKS) {
                //we have reached end of down, we need to set the value
                if (multi) {
                    this._onChange(value)
                } else {
                    selectValue(value)
                }
            } else if (displayView == DSP_MONTHS) {
                let downTo = moment(value, FORMAT_MONTHS)
                let displayDate = this.state.displayDate.clone()
                displayDate.year(downTo.year())
                displayDate.month(downTo.month())
                this.setState({displayView: DSP_WEEKS, displayDate})
            } else if (displayView == DSP_YEARS) {
                let downTo = moment(value, FORMAT_YEARS)
                let displayDate = this.state.displayDate.clone()
                displayDate.year(downTo.year())
                this.setState({displayView: DSP_MONTHS, displayDate})
            }
        } else if (unitType == UTYPE_MONTHS) {
            if (displayView == DSP_MONTHS) {
                //we have reached end of down, we need to set the value
                if (multi) {
                    this._onChange(value)
                } else {
                    selectValue(value)
                }
            } else if (displayView == DSP_YEARS) {
                let downTo = moment(value, FORMAT_YEARS)
                let displayDate = this.state.displayDate.clone()
                displayDate.year(downTo.year())
                this.setState({displayView: DSP_MONTHS, displayDate})
            }
        } else if (unitType == UTYPE_YEARS) {
            if (displayView == DSP_YEARS) {
                //we have reached end of down, we need to set the value
                if (multi) {
                    this._onChange(value)
                } else {
                    selectValue(value)
                }
            }
        } else if (unitType == UTYPE_QUARTS) {
            if (displayView == DSP_QUARTS) {
                //we have reached end of down, we need to set the value
                if (multi) {
                    this._onChange(value)
                } else {
                    selectValue(value)
                }
            } else if (displayView == DSP_YEARS) {
                let downTo = moment(value, FORMAT_YEARS)
                let displayDate = this.state.displayDate.clone()
                displayDate.year(downTo.year())
                this.setState({displayView: DSP_QUARTS, displayDate})
            }
        }
    }

    _displayUp(e) {
        e && e.preventDefault && e.preventDefault()
        let displayView = this.state.displayView
        let unitType = this.state.unitType
        if (unitType == UTYPE_DAYS) {
            if (displayView == DSP_DAYS) {
                this.setState({displayView: DSP_MONTHS})
            } else if (displayView == DSP_MONTHS) {
                this.setState({displayView: DSP_YEARS})
            }
        } else if (unitType == UTYPE_WEEKS) {
            if (displayView == DSP_WEEKS) {
                this.setState({displayView: DSP_MONTHS})
            } else if (displayView == DSP_MONTHS) {
                this.setState({displayView: DSP_YEARS})
            }
        } else if (unitType == UTYPE_MONTHS) {
            if (displayView == DSP_MONTHS) {
                this.setState({displayView: DSP_YEARS})
            }
        } else if (unitType == UTYPE_QUARTS) {
            if (displayView == DSP_QUARTS) {
                this.setState({displayView: DSP_YEARS})
            }
        }
    }

    _renderWeeks(selectValue) {
        let displayM = this.state.displayDate
        let startM = displayM.clone()
        let endM = displayM.clone()
        startM.startOf('month').startOf('week')
        endM.endOf('month').endOf('week')
        let weeks = []
        let cr = 0
        while (startM < endM) {
            let week = Math.floor(cr / 7)
            let val = startM.format(FORMAT_WEEKS)
            if (!weeks[week]) {
                weeks[week] = []
                weeks[week].push({
                    label: startM.format('WW'),
                    value: val,
                    offRange: true,
                    today: false,
                    selected: this.props.value && this.state.unitType == UTYPE_WEEKS && (this.props.value == val || this.props.value.indexOf(val) > -1)
                })
            }
            // value format depends on the unitType
            weeks[week].push({
                label: startM.format('DD'),
                value: val,
                offRange: (displayM.month() != startM.month()),
                today: (moment().format(FORMAT_DAYS) == startM.format(FORMAT_DAYS)),
                selected: this.props.value && this.state.unitType == UTYPE_WEEKS && (this.props.value == val || this.props.value.indexOf(val) > -1)
            })
            cr++
            startM.add(1, 'd')
        }
        let cal = weeks.map((week, wcr) => <tr>
            {week.map(day => {
                    let cls = "fancy-dms-btn"
                    if (day.offRange) cls += " fancy-dms-off-range"
                    if (day.today) cls += " fancy-dms-now fancy-dms-state-focus"
                    if (day.selected) cls += " fancy-dms-state-selected"
                    return <td>
                        <span class={cls} onClick={e => {
                            this._displayDown(day.value, selectValue)
                        }}>{day.label}</span>
                    </td>
                }
            )}
        </tr>)
        return <div class="fancy-dms-widget fancy-dms-calendar fancy-dms-widget">
            <div class="fancy-dms-header">
                <button class="fancy-dms-btn-left fancy-dms-btn" onClick={this._displayLeft}>
                    <span class="glyphicon glyphicon-chevron-left"/>
                </button>
                <button class="fancy-dms-btn-view fancy-dms-btn" onClick={this._displayUp}>
                    {displayM.format("MMMM YYYY")}</button>
                <button class="fancy-dms-btn-right fancy-dms-btn" onClick={this._displayRight}>
                    <span class="glyphicon glyphicon-chevron-right"/>
                </button>
            </div>
            <div style={{position: "relative", overflow: "hidden"}}>
                <table class="fancy-dms-nav-view fancy-dms-calendar-grid">
                    <thead>
                    <tr>
                        <th></th>
                        <th>{LABELS.LBL_FDMS_MONDAY_SHORT}</th>
                        <th>{LABELS.LBL_FDMS_TUESDAY_SHORT}</th>
                        <th>{LABELS.LBL_FDMS_WEDNESDAY_SHORT}</th>
                        <th>{LABELS.LBL_FDMS_THURSDAY_SHORT}</th>
                        <th>{LABELS.LBL_FDMS_FRIDAY_SHORT}</th>
                        <th>{LABELS.LBL_FDMS_SATURDAY_SHORT}</th>
                        <th>{LABELS.LBL_FDMS_SUNDAY_SHORT}</th>
                    </tr>
                    </thead>
                    <tbody>{cal}</tbody>
                </table>
            </div>
        </div>
    }

    _renderDays(selectValue) {
        let maxDay
        if (this.props.max) {
            maxDay = moment(this.props.max, FORMAT_DAYS)
        }
        let minDay
        if (this.props.min) {
            minDay = moment(this.props.min, FORMAT_DAYS)
        }
        let displayM = this.state.displayDate
        let startM = displayM.clone()
        let endM = displayM.clone()
        startM.startOf('month').startOf('week')
        endM.endOf('month').endOf('week')
        let weeks = []
        let cr = 0;
        while (startM < endM) {
            let week = Math.floor(cr / 7)
            if (!weeks[week]) {
                weeks[week] = []
            }
            // value format depends on the unitType
            let val = startM.format(FORMAT_DAYS)
            weeks[week].push({
                label: startM.format('DD'),
                value: val,
                offRange: (displayM.month() != startM.month()),
                disabled: (maxDay && startM.isAfter(maxDay)) || (minDay && startM.isBefore(minDay)),
                today: (moment().format(FORMAT_DAYS) == startM.format(FORMAT_DAYS)),
                selected: this.props.value && this.state.unitType == UTYPE_DAYS && (this.props.value == val || this.props.value.indexOf(val) > -1)
            })
            cr++
            startM.add(1, 'd')
        }
        let cal = weeks.map(week => <tr>
            {week.map(day => {
                    let cls = "fancy-dms-btn"
                    if (day.offRange || day.disabled) cls += " fancy-dms-off-range"
                    if (day.today) cls += " fancy-dms-now fancy-dms-state-focus"
                    if (day.selected) cls += " fancy-dms-state-selected"
                    return <td><span class={cls} onClick={e => {
                        if (!day.disabled)
                            this._displayDown(day.value, selectValue)
                    }}>{day.label}</span></td>
                }
            )}
        </tr>)
        return <div class="fancy-dms-widget fancy-dms-calendar">
            <div class="fancy-dms-header">
                <button class="fancy-dms-btn-left fancy-dms-btn" onClick={this._displayLeft}>
                    <span class="glyphicon glyphicon-chevron-left"/>
                </button>
                <button class="fancy-dms-btn-view fancy-dms-btn" onClick={this._displayUp}>
                    {displayM.format("MMMM YYYY")}</button>
                <button class="fancy-dms-btn-right fancy-dms-btn" onClick={this._displayRight}>
                    <span class="glyphicon glyphicon-chevron-right"/>
                </button>
            </div>
            <div style={{position: "relative", overflow: "hidden"}}>
                <table class="fancy-dms-nav-view fancy-dms-calendar-grid">
                    <thead>
                    <tr>
                        <th>{LABELS.LBL_FDMS_MONDAY_SHORT}</th>
                        <th>{LABELS.LBL_FDMS_TUESDAY_SHORT}</th>
                        <th>{LABELS.LBL_FDMS_WEDNESDAY_SHORT}</th>
                        <th>{LABELS.LBL_FDMS_THURSDAY_SHORT}</th>
                        <th>{LABELS.LBL_FDMS_FRIDAY_SHORT}</th>
                        <th>{LABELS.LBL_FDMS_SATURDAY_SHORT}</th>
                        <th>{LABELS.LBL_FDMS_SUNDAY_SHORT}</th>
                    </tr>
                    </thead>
                    <tbody>{cal}</tbody>
                </table>
            </div>
        </div>
    }

    _renderMonths(selectValue) {
        let maxMonth
        if (this.props.max) {
            if (this.state.unitType == UTYPE_DAYS) {
                maxMonth = moment(moment(this.props.max, FORMAT_DAYS).format(FORMAT_MONTHS), FORMAT_MONTHS)
            } else {
                maxMonth = moment(this.props.max, FORMAT_MONTHS)
            }
        }
        let minMonth
        if (this.props.min) {
            if (this.state.unitType == UTYPE_DAYS) {
                minMonth = moment(moment(this.props.min, FORMAT_DAYS).format(FORMAT_MONTHS), FORMAT_MONTHS)
            } else {
                minMonth = moment(this.props.min, FORMAT_MONTHS)
            }
        }
        let displayM = this.state.displayDate
        let startM = displayM.clone()
        let endM = displayM.clone()
        startM.startOf('year')
        endM.endOf('year')
        let months = []
        let cr = 0;
        while (startM < endM) {
            let row = Math.floor(cr / 3)
            if (!months[row]) {
                months[row] = []
            }
            // value format depends on the unitType
            let val = startM.format(FORMAT_MONTHS)
            months[row].push({
                label: startM.format('MMM'),
                value: val,
                disabled: (maxMonth && startM.isAfter(maxMonth)) || (minMonth && startM.isBefore(minMonth)),
                today: (moment().format(FORMAT_MONTHS) == startM.format(FORMAT_MONTHS)),
                selected: this.props.value && this.state.unitType == UTYPE_MONTHS && (this.props.value == val || this.props.value.indexOf(val) > -1)
            })
            cr++
            startM.add(1, 'M')
        }
        let cal = months.map(row => <tr>
            {row.map(month => {
                    let cls = "fancy-dms-btn"
                    if (month.disabled) cls += " fancy-dms-off-range"
                    if (month.today) cls += " fancy-dms-now fancy-dms-state-focus"
                    if (month.selected) cls += " fancy-dms-state-selected"
                    return <td><span class={cls} onClick={e => {
                        if (!month.disabled)
                            this._displayDown(month.value, selectValue)
                    }}>{month.label}</span></td>
                }
            )}
        </tr>)
        return <div class="fancy-dms-widget fancy-dms-calendar fancy-dms-widget">
            <div class="fancy-dms-header">
                <button class="fancy-dms-btn-left fancy-dms-btn" onClick={this._displayLeft}>
                    <span class="glyphicon glyphicon-chevron-left"/>
                </button>
                <button class="fancy-dms-btn-view fancy-dms-btn"
                        onClick={this._displayUp}>
                    {displayM.format("YYYY")}</button>
                <button class="fancy-dms-btn-right fancy-dms-btn" onClick={this._displayRight}>
                    <span class="glyphicon glyphicon-chevron-right"/>
                </button>
            </div>
            <div style={{position: "relative", overflow: "hidden"}}>
                <table class="fancy-dms-nav-view fancy-dms-calendar-grid">
                    <tbody>{cal}</tbody>
                </table>
            </div>
        </div>
    }

    _renderQuarts(selectValue) {
        let displayM = this.state.displayDate
        let quarts = []
        quarts[0] = []
        quarts[1] = []
        let val = "I/" + displayM.format(FORMAT_QUARTS_Y)
        quarts[0].push({
            label: val,
            value: val,
            today: false,
            selected: this.props.value && this.state.unitType == UTYPE_QUARTS
            && (this.props.value == val || (this.props.value.constructor == Array && this.props.value.indexOf(val) > -1))
        })
        val = "II/" + displayM.format(FORMAT_QUARTS_Y)
        quarts[0].push({
            label: val,
            value: val,
            today: false,
            selected: this.props.value && this.state.unitType == UTYPE_QUARTS
            && (this.props.value == val || (this.props.value.constructor == Array && this.props.value.indexOf(val) > -1))
        })
        val = "III/" + displayM.format(FORMAT_QUARTS_Y)
        quarts[1].push({
            label: val,
            value: val,
            today: false,
            selected: this.props.value && this.state.unitType == UTYPE_QUARTS
            && (this.props.value == val || (this.props.value.constructor == Array && this.props.value.indexOf(val) > -1))
        })
        val = "IV/" + displayM.format(FORMAT_QUARTS_Y)
        quarts[1].push({
            label: val,
            value: val,
            today: false,
            selected: this.props.value && this.state.unitType == UTYPE_QUARTS
            && (this.props.value == val || (this.props.value.constructor == Array && this.props.value.indexOf(val) > -1))
        })
        let cal = quarts.map(row => <tr>
            {row.map(quart => {
                    let cls = "fancy-dms-btn"
                    if (quart.today) cls += " fancy-dms-now fancy-dms-state-focus"
                    if (quart.selected) cls += " fancy-dms-state-selected"
                    return <td><span class={cls} onClick={e => {
                        this._displayDown(quart.value, selectValue)
                    }}>{quart.label}</span></td>
                }
            )}
        </tr>)
        return <div class="fancy-dms-widget fancy-dms-calendar fancy-dms-widget">
            <div class="fancy-dms-header">
                <button class="fancy-dms-btn-left fancy-dms-btn" onClick={this._displayLeft}>
                    <span class="glyphicon glyphicon-chevron-left"/>
                </button>
                <button class="fancy-dms-btn-view fancy-dms-btn" onClick={this._displayUp}>
                    {displayM.format("YYYY")}</button>
                <button class="fancy-dms-btn-right fancy-dms-btn" onClick={this._displayRight}>
                    <span class="glyphicon glyphicon-chevron-right"/>
                </button>
            </div>
            <div style={{position: "relative", overflow: "hidden"}}>
                <table class="fancy-dms-nav-view fancy-dms-calendar-grid">
                    <tbody>{cal}</tbody>
                </table>
            </div>
        </div>
    }

    _renderYears(selectValue) {
        let maxYear
        if (this.props.max) {
            if (this.state.unitType == UTYPE_DAYS) {
                maxYear = moment(moment(this.props.max, FORMAT_DAYS).format(FORMAT_YEARS), FORMAT_YEARS)
            } else if (this.state.unitType == UTYPE_MONTHS) {
                maxYear = moment(moment(this.props.max, FORMAT_MONTHS).format(FORMAT_YEARS), FORMAT_YEARS)
            } else {
                maxYear = moment(this.props.max, FORMAT_YEARS)
            }
        }
        let minYear
        if (this.props.min) {
            if (this.state.unitType == UTYPE_DAYS) {
                minYear = moment(moment(this.props.min, FORMAT_DAYS).format(FORMAT_YEARS), FORMAT_YEARS)
            } else if (this.state.unitType == UTYPE_MONTHS) {
                minYear = moment(moment(this.props.min, FORMAT_MONTHS).format(FORMAT_YEARS), FORMAT_YEARS)
            } else {
                minYear = moment(this.props.min, FORMAT_YEARS)
            }
        }
        let displayM = this.state.displayDate
        let startM = displayM.clone()
        let endM = displayM.clone()
        startM = moment(startM.startOf('year').format(FORMAT_DAYS).replace(/.$/, "0"), FORMAT_DAYS)
        endM = moment(endM.endOf('year').format(FORMAT_DAYS).replace(/.$/, "9"), FORMAT_DAYS)
        let startY = startM.clone().year()
        let endY = endM.clone().year()
        startM.subtract(1, 'Y')
        endM.add(1, 'Y')
        let years = []
        let cr = 0;
        while (startM < endM) {
            let row = Math.floor(cr / 4)
            if (!years[row]) {
                years[row] = []
            }
            // value format depends on the unitType
            let val = startM.format(FORMAT_YEARS)
            years[row].push({
                label: startM.format('YYYY'),
                value: val,
                disabled: (maxYear && startM.isAfter(maxYear)) || (minYear && startM.isBefore(minYear)),
                today: (moment().format(FORMAT_YEARS) == startM.format(FORMAT_YEARS)),
                selected: this.props.value && this.state.unitType == UTYPE_YEARS && (this.props.value == val || this.props.value.indexOf(val) > -1)
            })
            cr++
            startM.add(1, 'Y')
        }
        let cal = years.map(row => <tr>
            {row.map(years => {
                    let cls = "fancy-dms-btn"
                    if (years.disabled) cls += " fancy-dms-off-range"
                    if (years.today) cls += " fancy-dms-now fancy-dms-state-focus"
                    if (years.selected) cls += " fancy-dms-state-selected"
                    return <td><span class={cls} onClick={e => {
                        if (!years.disabled)
                            this._displayDown(years.value, selectValue)
                    }}>{years.label}</span></td>
                }
            )}
        </tr>)
        return <div class="fancy-dms-widget fancy-dms-calendar fancy-dms-widget">
            <div class="fancy-dms-header">
                <button class="fancy-dms-btn-left fancy-dms-btn" onClick={this._displayLeft}>
                    <span class="glyphicon glyphicon-chevron-left"/>
                </button>
                <button class="fancy-dms-btn-view fancy-dms-btn" onClick={this._displayUp}>
                    {startY} - {endY}</button>
                <button class="fancy-dms-btn-right fancy-dms-btn" onClick={this._displayRight}>
                    <span class="glyphicon glyphicon-chevron-right"/>
                </button>
            </div>
            <div style={{position: "relative", overflow: "hidden"}}>
                <table class="fancy-dms-nav-view fancy-dms-calendar-grid">
                    <tbody>{cal}</tbody>
                </table>
            </div>
        </div>
    }

    _menuRenderer({focusedOption, focusOption, options, selectValue, valueArray}) {

        if (this.state.displayView == DSP_DAYS) {
            return this._renderDays(selectValue)
        }
        if (this.state.displayView == DSP_MONTHS) {
            return this._renderMonths(selectValue)
        }
        if (this.state.displayView == DSP_YEARS) {
            return this._renderYears(selectValue)
        }
        if (this.state.displayView == DSP_WEEKS) {
            return this._renderWeeks(selectValue)
        }
        if (this.state.displayView == DSP_QUARTS) {
            return this._renderQuarts(selectValue)
        } else {
            return <span>NOT IMPLEMENTED YET</span>
        }
    }

    _onChange(e) {
        let onChange = this.props.onChange
        let multi = this.props.multi
        let value = this.props.value
        let result = null
        if (e) {
            if (e.constructor !== Array) {
                if (multi) {
                    if (value && value.constructor == Array) {
                        result = value.slice()
                        if (value.indexOf(e) > -1) {
                            result.splice(result.indexOf(e), 1);
                        } else {
                            result.push(e)
                        }
                    } else {
                        result = [e]
                    }
                } else {
                    result = e
                }
            } else {
                if (multi) {
                    if (e.length > 0) {
                        //we might get not only the value but the entire option object
                        result = e.map(obj => obj.value ? obj.value : obj)
                    }
                } else {

                }
            }
        }
        onChange(result)
    }

    render() {
        let canClear = !(this.props.noClear === true)
        let optionsList = []
        if (this.props.value) {
            if (this.props.value.map) {
                optionsList = this.props.value.map(val => ({value: val, label: val}))
            } else {
                optionsList = [{value: this.props.value, label: this.props.value}]
            }
        }
        optionsList.push({})
        let error = this.props.error
        let errorInPopup = this.props.errorInPopup
        let errorBelow = this.props.errorBelow
        let wrapperClasses = ""
        if (this.props.sizeSmall) wrapperClasses += " Select-small "
        if (error && (errorInPopup || errorBelow)) wrapperClasses += " has-error "
        let toReturn = <div class="fancy-dms">
            <Select placeholder={this.props.placeholder ? this.props.placeholder : LABELS.LBL_FDMS_SELECT}
                    disabled={this.props.disabled}
                    clearValueText=""
                    noResultsText=" "
                    multi={this.props.multi}
                    clearable={canClear}
                    searchable={false}
                    value={this.props.value}
                    options={optionsList}
                    menuRenderer={this._menuRenderer}
                    onChange={this._onChange}/>
        </div>

        toReturn = <div class={wrapperClasses}>{toReturn}</div>
        if (error && (errorInPopup)) {
            const popover = <Popover>{error}</Popover>
            toReturn = <OverlayTrigger placement="top" overlay={popover}>
                {toReturn}
            </OverlayTrigger>
        }

        return toReturn
    }
}

export default FancyDateMegaSelect