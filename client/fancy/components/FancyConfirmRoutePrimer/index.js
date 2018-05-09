import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

// In short:
// Wrap your input components in a FancyConfirmRoutePrimer to get an error/warning message after
// changing the URL/closing the browser if you have unsaved changes/data.
// FancyConfirmRoutePrimer only marks the input as modified. Use a FancyConfirmRouteTrigger to watch
// for events that trigger the warning.
//
// Properties for this component:
// wrapIn -
// classes -

class FancyConfirmRoutePrimer extends React.Component {

    constructor(props) {
        super(props)
        this._onChange = this._onChange.bind(this)
    }

    _onChange(val) {
        this.props.confirmRoutePrime()
        if (this.props.onChange) {
            this.props.onChange(val)
        }
        React.Children.only(this.props.children).props.onChange(val)
    }

    render() {
        let child = React.Children.only(this.props.children)
        let props = Object.assign({}, child.props, {
            onChange: this._onChange,
            classes: this.props.classes + " " + child.props.classes
        })
        let clone = React.cloneElement(child, {...props})
        if (this.props.wrapIn) {
            clone = this.props.wrapIn(clone)
        }
        return clone
    }
}

export default connect(null,
    dispatch => bindActionCreators({confirmRoutePrime: () => ({type: "DNM", meta: {confirmRoutePrime: true}})}, dispatch)
)(FancyConfirmRoutePrimer)