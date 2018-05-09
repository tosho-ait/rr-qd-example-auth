import React from 'react'
import {Popover, OverlayTrigger} from 'react-bootstrap'

import './index.css'

class FancyInput extends React.Component {

    constructor(props) {
        super(props)
        this._handleChange = this._handleChange.bind(this)
    }

    _handleChange(e) {
        let value = e.target.value
        if (value && this.props.onlyInt) {
            value = parseInt(value, 10)
            if (Number.isNaN(value)) {
                value = ""
            }
            if (this.props.minInt && value < this.props.minInt) {
                value = this.props.minInt
            }
            if (this.props.maxInt && value > this.props.maxInt) {
                value = this.props.maxInt
            }
        }
        this.props.onChange("" + value)
    }

    render() {
        let disabled = this.props.disabled
        let textCenter = this.props.textCenter
        let sizeSmall = this.props.sizeSmall
        let redBackgroundError = this.props.redBackgroundError
        let value = this.props.value
        let showClear = true
        if (!value && value !== 0) {
            showClear = false
        }
        if (disabled) {
            showClear = false
        }
        let error = this.props.error
        let errorInPopup = this.props.errorInPopup
        let errorBelow = this.props.errorBelow

        let inputClasses = "form-control "
        if (textCenter) {
            inputClasses += " text-center "
        }
        if (sizeSmall) {
            inputClasses += " input-sm "
        } else {
            inputClasses += " fancy-fi-height "
        }
        if (showClear) {
            inputClasses += " fancy-fi-clear-pad "
        }
        let wrapperClasses = "btn-group fancy-fi"
        if (error && (errorInPopup || errorBelow)) {
            inputClasses += " fancy-fi-has-error "
            if (redBackgroundError) {
                inputClasses += " fancy-fi-back-red "
            }
        }
        let toReturn = <div class={wrapperClasses}>
            <input disabled={disabled} class={inputClasses} placeholder={this.props.placeholder}
                   value={this.props.value === undefined || this.props.value === null ? "" : this.props.value}
                   onChange={this._handleChange}/>
            {showClear && <span class="fancy-fi-clear" onClick={()=> this.props.onChange(undefined)}><span
                class="fancy-fi-select-clear">×</span></span>}
        </div>
        if (error && errorInPopup) {
            const popover = <Popover>{error}</Popover>
            toReturn = <OverlayTrigger placement="top" overlay={popover}>
                {toReturn}
            </OverlayTrigger>
        }
        return toReturn
    }
}

export default FancyInput