import React from 'react'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import {Popover, OverlayTrigger} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import * as LABELS from '../../config/labels'

import './index.css'

// In short:
// List form input component.
//
// Properties for this component:
// listName -
// excludeOptions -
// value -
// onChange -
// customLabel -
// noClear -
// selectOnSingle -
// selectOnEmpty -
// placeholder -
// disabled -
// multi -
// targetNameInFilter -
// filterListName -
// filterValue -
// sizeSmall -
// error -
// errorInPopup -
// errorBelow -

class FancyList extends React.Component {

    constructor(props) {
        super(props)
        this._getOptions = this._getOptions.bind(this)
        this._handleChange = this._handleChange.bind(this)
    }

    _getOptions() {
        let customLabel = this.props.customLabel
        if (this.props.optionsList) {
            let filterByProp = this.props.filterByProp
            let allOptionsList = this.props.optionsList
            let options = []
            allOptionsList.map(optionFromList => {
                let extra = undefined
                if (customLabel) {
                    extra = customLabel(optionFromList)
                }
                //do not set the customLabel directly in the label for the option object because the label is used for searching
                let option = {value: optionFromList.id, label: optionFromList.label, customLabel: extra}
                // this.props.fetchFilterList - means our dropdown/multiselect is filtered by another dropdown/multiselect
                if (this.props.optionsListForFilter) {
                    // the name of the property/array in the fetchFilterList that shows what IDs from our list are allowed
                    let targetNameInFilter = this.props.targetNameInFilter
                    // this is the value of the other dropdown/multiselect we filter by
                    let filterValue = this.props.filterValue
                    //  the list of the other dropdown/multiselect should contain arrays with the allowed values (only ids, for each option) of this dropdown/multiselect
                    let filterInList = this.props.optionsListForFilter
                    // get the all selected options in the dropdown/multiselect we filter by
                    let filterOptions = filterInList.filter(opt=> {
                        // filterValue and be array or single value
                        if (!filterValue) {
                            return false;
                        } else if (filterValue.constructor === Array) {
                            return filterValue.indexOf(opt.id) > -1
                        } else {
                            return opt.id === filterValue
                        }
                    })
                    if (filterOptions.length > 0) {
                        // we have all the currently selected options in the optionsListForFilter
                        // now we need to find what options from optionsList are allowed
                        let passesFilter = false
                        filterOptions.map(fOpt => {
                            if (fOpt && fOpt[targetNameInFilter] && fOpt[targetNameInFilter].indexOf(optionFromList.id) > -1) {
                                passesFilter = true
                            }
                        })
                        if (passesFilter) {
                            if (!filterByProp || (filterByProp && optionFromList.props && optionFromList.props.indexOf(filterByProp) > -1)) {
                                options.push(option)
                            }
                        }
                    }
                } else {
                    if (!filterByProp || (filterByProp && optionFromList.props && optionFromList.props.indexOf(filterByProp) > -1)) {
                        options.push(option)
                    }
                }
            })

            if (this.props.excludeOptions) {
                options = options.filter(option => {
                    return this.props.excludeOptions.indexOf(option.value) < 0;
                })
            }

            return options;
        }
        return [];
    }

    _handleChange(selected) {
        let val = undefined
        if (selected) {
            if (selected.constructor === Array && selected.length > 0) {
                val = selected.map(item =>(item.value))
            } else if (selected.value) {
                val = selected.value
            }
        }
        if (val && this.props.multi && val.constructor !== Array) {
            val = [val]
        }
        this.props.onChange(val)
    }

    componentWillMount() {
        this.beforeRender()
    }

    componentWillUpdate(nextProps, nextState) {
        this.beforeRender.bind(Object.assign(this, {props: nextProps, state: nextState}))()
    }

    beforeRender() {
        if (this.props.optionsList) {
            let options = this._getOptions();
            let val = this.props.value
            let multi = this.props.multi === true
            let selectOnSingle = this.props.selectOnSingle
            let selectOnEmpty = this.props.selectOnEmpty

            if (val) {
                // so we can switch between FancyMultiSelect and FancyList for the same value property
                if (val.constructor !== Array && multi) {
                    this.props.onChange([])
                } else if (val.constructor === Array && !multi) {
                    this.props.onChange(null)
                }
            }
            if (val) {
                if (val.constructor === Array) {
                    if (this.props.optionsListForFilter || !this.props.filterListName) {
                        // check if value is outside of options and call onChange to remove if needed!
                        // (value might be outside if the options list is not yet loaded, do not check im this case)
                        // and check for optionsListForFilter only if filtering is enabled
                        let newVal = val.filter(item => {
                            let result = false
                            options.map(option=> {
                                if (option.value === item) {
                                    result = true
                                }
                            })
                            return result;
                        })
                        if (newVal.length === 0) {
                            this.props.onChange(null)
                        } else if (newVal.length != val.length) {
                            this.props.onChange(newVal)
                        }
                    }
                } else {
                    let found = false
                    //the value might be a int but it gets turned into a string somewhere
                    options.map((item)=> {
                        if (val == item.value) {
                            found = true
                            val = item.value
                        }
                    })
                    if (!found && (this.props.optionsListForFilter || this.props.filterListName === undefined)) {
                        // check if value is outside of options and call onChange to remove if needed!
                        // (value might be outside if the options list is not yet loaded, do not check in this case)
                        // and check for optionsListForFilter only if filtering is enabled
                        this.props.onChange(null);
                    }
                }
            } else {
                if (options.length == 1 && selectOnSingle) {
                    this._handleChange(options[0])
                } else if (options.length > 0 && selectOnEmpty) {
                    this._handleChange(options[0])
                }
            }
        }
    }

    render() {
        let placeholder = LABELS.LBL_FL_SELECT
        if (this.props.placeholder) {
            placeholder = this.props.placeholder
        }
        let options = this._getOptions();
        let val = this.props.value
        let selectOnSingle = this.props.selectOnSingle
        let selectOnEmpty = this.props.selectOnEmpty
        let multi = this.props.multi === true
        let customLabel = this.props.customLabel
        let clearable = !(this.props.noClear === true)

        //hide the 'X' on selectOnSingle or selectOnEmpty
        if ((options.length == 1 && selectOnSingle) || selectOnEmpty) clearable = false

        let error = this.props.error
        let errorInPopup = this.props.errorInPopup
        let errorBelow = this.props.errorBelow

        let wrapperClasses = ""
        if (this.props.sizeSmall) wrapperClasses += " Select-small "

        if (error && (errorInPopup || errorBelow)) wrapperClasses += " has-error "

        let divClass = "fancy-list"

        if ((!val && val != 0) || val == "") {
            clearable = false
        }
        if (!multi && clearable) {
            divClass += " svShrtd"
        }

        let toReturn = <div class={divClass}><Select
            clearValueText=""
            noResultsText=" "
            placeholder={placeholder}
            value={val}
            disabled={this.props.disabled}
            clearable={clearable}
            options={options}
            matchProp="label"
            onChange={this._handleChange}
            multi={multi}
            optionRenderer={(option)=> {
                if (customLabel) {
                    return option.customLabel
                } else {
                    return option.label
                }
            }}
        /></div>
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

export default FancyList