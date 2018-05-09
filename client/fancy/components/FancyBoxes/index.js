import React from 'react'
import {Tooltip, OverlayTrigger} from 'react-bootstrap'

import 'bootstrap/dist/css/bootstrap.min.css'

class FancyBoxes extends React.Component {

    constructor(props) {
        super(props)
        this._getOptions = this._getOptions.bind(this)
        this._toggleOption = this._toggleOption.bind(this)
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
                    let filterOptions = filterInList.filter(opt => {
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

            return options
        }
        return []
    }

    _toggleOption(selected) {
        let val = this.props.value
        if (val) {
            if (this.props.multi === true) {
                if (val.constructor === Array) {
                    let toReturn = this.props.value.slice()
                    if (toReturn.indexOf(selected) > -1) {
                        toReturn.splice(toReturn.indexOf(selected), 1)
                    } else {
                        toReturn.push(selected)
                    }
                    this.props.onChange(toReturn)
                } else {
                    this.props.onChange([selected]);
                }
            } else {
                this.props.onChange(selected);
            }
        } else {
            if (this.props.multi === true) {
                this.props.onChange([selected]);
            } else {
                this.props.onChange(selected);
            }
        }
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
            let selectOnSingle = this.props.selectOnSingle
            let selectOnEmpty = this.props.selectOnEmpty
            if (val) {
                if (val.constructor === Array) {
                    if (this.props.optionsListForFilter || !this.props.filterListName === undefined) {
                        // check if value is outside of options and call onChange to remove if needed!
                        // (value might be outside if the options list is not yet loaded, do not check im this case)
                        // and check for optionsListForFilter only if filtering is enabled
                        let newVal = val.filter(item => {
                            let result = false
                            options.map(option => {
                                if (option.value === item) {
                                    result = true
                                }
                            })
                            return result;
                        })
                        if (newVal.length === 0) {
                            this.props.onChange(null);
                        } else if (newVal.length != val.length) {
                            this.props.onChange(newVal);
                        }
                    }
                } else {
                    let found = false
                    //the value might be a int but it gets turned into a string somewhere
                    options.map((item) => {
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
        let options = this._getOptions()
        let val = this.props.value
        let customLabel = this.props.customLabel
        let allOptionsList = this.props.optionsList
        let tooltipTxt = null;
        let showTooltip = this.props.showTooltip
        let lines = options.map((option) => {
            let optionVal = option.value;
            let filteredOption = allOptionsList.filter(x => x.id === optionVal);
            if (filteredOption && filteredOption.length >= 0) {
                let comment = filteredOption[0].comment;
                if (comment) {
                    tooltipTxt = comment;
                }
            }
            let ttp = <Tooltip>{tooltipTxt}</Tooltip>
            return <div class="col-lg-4 col-md-6">
                <div class="checkbox checkbox-inline">
                    <input type="checkbox"
                           checked={val && (val == option.value || (val.constructor == Array && val.indexOf(option.value) > -1) )}
                           onChange={() => this._toggleOption(option.value)}/>

                    {(showTooltip && tooltipTxt) && <OverlayTrigger delay={300} placement="bottom" overlay={ttp}>
                        <label>{customLabel ? option.customLabel : option.label}</label>
                    </OverlayTrigger>}

                    {(!showTooltip || !tooltipTxt) && <label>{customLabel ? option.customLabel : option.label}</label> }

                </div>
            </div>
        })
        return (<div class="row">{lines}</div>
        )
    }
}

export default FancyBoxes