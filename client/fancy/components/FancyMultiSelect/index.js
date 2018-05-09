import React from 'react'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import {Popover, OverlayTrigger} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import * as LABELS from '../../config/labels'

import './style.css'

// In short:
// Multiselect form input component.
//
// Properties for this component:
// listName -
// value -
// onChange -
// noClear -
// customRenderValue -
// selectOnSingle -
// selectOnEmpty -
// noSelectAll -
// group -
// keepValOrder -
// placeholder -
// selectAllText-
// blocked -
// multi -
// targetNameInFilter -
// filterListName -
// filterValue -

class FancyMultiSelect extends React.Component {

    constructor(props) {
        super(props)
        this._getOptions = this._getOptions.bind(this)
        this._doChange = this._doChange.bind(this)
        this._doChangeAll = this._doChangeAll.bind(this)
        this._doClickGroup = this._doClickGroup.bind(this)
        this._selectAll = this._selectAll.bind(this)
        this.menuRenderer = this.menuRenderer.bind(this)
        this.renderValue = this.renderValue.bind(this)
        this._onChange = this._onChange.bind(this)
    }

    _getOptions() {
        let group = this.props.group
        let labelProperty = "label"
        if (this.props.labelProperty) {
            labelProperty = this.props.labelProperty
        }
        if (this.props.optionsList) {
            let filterByProp = this.props.filterByProp
            let allOptionsList = this.props.optionsList
            let options = []
            let currentGroup = null
            allOptionsList.map(optionFromList => {
                if (group && optionFromList.groupLabel && (!currentGroup || currentGroup.label != optionFromList.groupLabel)) {
                    let groupId = currentGroup ? currentGroup.value - 1 : -1
                    currentGroup = {value: groupId, label: optionFromList.groupLabel, group: true}
                    options.push(currentGroup)
                }
                let option = {value: optionFromList.id, label: optionFromList[labelProperty]}
                if (currentGroup) {
                    option.groupId = currentGroup.value
                }
                // this.props.optionsListForFilter - means our dropdown/multiselect is filtered by another dropdown/multiselect
                if (this.props.optionsListForFilter) {
                    // the name of the property/array in the optionsListForFilter that shows what IDs from our list are allowed
                    let targetNameInFilter = this.props.targetNameInFilter
                    // this is the value of the other dropdown/multiselect we filter by
                    let filterValue = this.props.filterValue
                    //  the list of the other dropdown/multiselect should contain arrays with the allowed values (only ids, for each option) of this dropdown/multiselect
                    let filterInList = this.props.optionsListForFilter
                    // get the all selected options in the dropdown/multiselect we filter by
                    let filterOptions = filterInList.filter(opt=> {
                        // filterValue and be array or single value
                        if (!filterValue) {
                            return false
                        } else if (filterValue.constructor === Array) {
                            return filterValue.indexOf(opt.id) > -1
                        } else {
                            return opt.id == filterValue
                        }
                    })
                    if (filterOptions.length > 0) {
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
            return options;
        }
        return [];
    }

    _onChange(val) {
        if (this.props.keepValOrder && val && val.map && val.length > 1 && this.props.optionsList && this.props.optionsList.map) {
            //sort te output
            let ordered = this.props.optionsList.map(option=> option.id)
            val = val.sort((a, b) => ordered.indexOf(a) - ordered.indexOf(b))
        }
        if (!this.props.blocked) {
            this.props.onChange(val)
        }
    }

    _doChange(option) {
        let val = this.props.value
        if (!val) val = []
        if (option) {
            val = val.slice()
            if (val.indexOf(option) < 0) {
                val.push(option)
            } else {
                val.splice(val.indexOf(option), 1);
            }
        } else {
            val = []
        }
        if (val.length < 1) {
            this._onChange(null);
        } else {
            this._onChange(val);
        }
    }

    _doChangeAll(options) {
        let val = this.props.value
        if (!val) val = []
        if (options) {
            val = val.slice()
            options.map(option => {
                if (val.indexOf(option) < 0) {
                    val.push(option)
                } else {
                    val.splice(val.indexOf(option), 1);
                }
            })
        } else {
            val = []
        }
        if (val.length < 1) {
            this._onChange(null);
        } else {
            this._onChange(val);
        }
    }

    _doClickGroup(group, options) {
        let val = this.props.value
        if (!val) val = []
        let optionsOfGroup = options.filter(opt => opt.groupId == group.value)
        let optionsOfGroupSelected = optionsOfGroup.filter(opt => val.indexOf(opt.value) > -1)
        if (optionsOfGroup.length === optionsOfGroupSelected.length) {
            this._doChangeAll(optionsOfGroupSelected.map(optS=>optS.value))
        } else {
            let optionsOfGroupNOtSelected = optionsOfGroup.filter(opt => val.indexOf(opt.value) < 0)
            this._doChangeAll(optionsOfGroupNOtSelected.map(optS=>optS.value))
        }
    }

    _selectAll(options) {
        let values = this.props.value
        if (values && values.length && values.length === options.length) {
            this._onChange(null);
        } else {
            let allVals = []
            options.map(option=> {
                allVals.push(option.value)
            })
            this._onChange(allVals);
        }
    }

    menuRenderer({focusedOption, focusOption, options, selectValue, valueArray}) {
        let selectAllText = LABELS.LBL_FMS_SELECT_ALL
        if (this.props.selectAllText) {
            selectAllText = this.props.selectAllText
        }
        let blocked = this.props.blocked
        let noSelectAll = this.props.noSelectAll
        let multipleOptions = options && options.length > 1
        let group = this.props.group
        let values = this.props.value
        let allChecked = false
        if (values && values.length && values.length === options.length) {
            allChecked = true
        }
        let lines = options.map(opt=> {
            if (opt.group && group) {
                return <li class="listitem-ms" onClick={()=> {
                    this._doClickGroup(opt, options)
                }}>
                    <div>
                        <label style={{cursor: "pointer"}}><strong>{opt.label}</strong></label>
                    </div>
                </li>
            } else {
                let checked = false
                values && values.map && values.map(val=> {
                    if (val == opt.value) {
                        checked = true
                    }
                })
                return <li class="listitem-ms"
                           onClick={()=> {
                               this._doChange(opt.value)
                           }}>
                    <div class="checkbox checkbox-default">
                        { group && <span>&nbsp;&nbsp;</span>}
                        <input type="checkbox" checked={checked}/>
                        <label style={{"max-width": "97%"}}>{opt.label}</label>
                    </div>
                </li>
            }
        })
        let ulClass = "list-unstyled"
        if (blocked) {
            ulClass += " text-vary-muted"
        }
        return <ul class={ulClass}>
            {!noSelectAll && multipleOptions && <li class="listitem-ms"
                                                    onClick={()=> {
                                                        this._selectAll(options)
                                                    }}>
                <div class="checkbox checkbox-default">
                    { group && <span>&nbsp;&nbsp;</span>}
                    <input type="checkbox" checked={allChecked}/>
                    <label style={{"max-width": "97%"}}><strong>{selectAllText}</strong></label>
                </div>
            </li> }
            {lines}
        </ul>
    }

    renderValue(values) {
        let customRenderValue = this.props.customRenderValue
        let displayAllSelected = this.props.displayAllSelected
        if (!this.props.optionsList || !this.props.optionsList.filter || !values || !values.length) {
            return null;
        }
        let selectedTextMultiple = LABELS.LBL_FMS_SELECTED_MULTIPLE
        if (this.props.multipleSelectedLabel) selectedTextMultiple = this.props.multipleSelectedLabel
        let count = values.length

        if (count == 1 || displayAllSelected) {
            if (customRenderValue) {
                return customRenderValue(values, this.props.optionsList)
            } else {
                let selected = this.props.optionsList.filter(option => values.indexOf(option.id) > -1)
                return <div class="dispalyDiv95">{selected.map((std, idx) =>
                    <span>{idx > 0 && ", "}{std.label}</span>) }</div>
            }
        } else {
            let labelMultiple = <strong>{count + ' ' + selectedTextMultiple}</strong>
            if (customRenderValue) {
                labelMultiple = customRenderValue(values, this.props.optionsList)
            }
            if (this.props.popoverOnMultiple) {
                let selected = this.props.optionsList.filter(option => values.indexOf(option.id) > -1)
                let list = selected.map(option=><li class="fancy-ms-noWrap">{option.label}</li>)
                let ttp = <Popover id={"someId"} bsClass="fancy-ms-popoverwide">
                    <ul class="list-unstyled fancy-ms-mb0">{list}</ul>
                </Popover>
                return <OverlayTrigger delay={300} placement="bottom" overlay={ttp}>
                    <div class="fancy-ms-inlinediv fancy-ms-w90pct">{labelMultiple}</div>
                </OverlayTrigger>
            } else {
                return labelMultiple
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
        let selectOnSingle = this.props.selectOnSingle
        let selectOnEmpty = this.props.selectOnEmpty
        if (this.props.optionsList) {
            let options = this._getOptions()
            let values = this.props.value

            if (values && values.constructor === Array) {
                if (this.props.optionsListForFilter || !this.props.filterListName) {
                    // check if value is outside of options and call onChange to remove if needed
                    // (value might be outside if the options list is not yet loaded, do not check im this case)
                    // and check for optionsListForFilter only if filtering is enabled
                    let newValues = values.filter(item => {
                        let result = false
                        options.map(option=> {
                            if (option.value === item) {
                                result = true
                            }
                        })
                        return result;
                    })
                    if (newValues.length === 0) {
                        this._onChange(null)
                    } else if (newValues.length !== values.length) {
                        this._onChange(newValues)
                    }
                } else {
                    if (values.length === 0) {
                        this._onChange(null)
                    }
                }
            } else {
                if (options.length == 1 && selectOnSingle) {
                    this._onChange([options[0].value])
                } else if (options.length > 0 && selectOnEmpty) {
                    this._onChange([options[0].value])
                } else if (values && values.constructor !== Array) {
                    // so we can switch between FancyMultiSelect and FancyList for the same value property, this will fix non array values
                    this._onChange([])
                }
            }
        }
    }

    render() {
        let placeholder = LABELS.LBL_FMS_SELECT
        if (this.props.placeholder) {
            placeholder = this.props.placeholder
        }
        let val = this.props.value
        let options = this._getOptions();
        let selectOnSingle = this.props.selectOnSingle
        let selectOnEmpty = this.props.selectOnEmpty
        let clearable = !(this.props.noClear === true)
        //hide the 'X' on selectOnSingle or selectOnEmpty
        if ((options.length == 1 && selectOnSingle) || selectOnEmpty) {
            clearable = false
        }
        if ((!val && val != 0) || val == "") {
            clearable = false
        }
        return <div class="fancy-ms"><Select
            clearValueText=""
            noResultsText=" "
            placeholder={placeholder}
            disabled={this.props.disabled}
            clearable={clearable}
            value={this.props.value}
            options={options}
            onChange={this._doChange}
            menuRenderer={this.menuRenderer}
            valueRenderer={this.renderValue}/></div>
    }
}

export default FancyMultiSelect