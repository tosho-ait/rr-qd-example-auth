import React from 'react'

// In short:
// Display the label of a List form potion
//
// Properties for this component:
// listName -
// noAutoLoad -
// value -

class FancyLabel extends React.Component {

    _getLabel() {
        let prop = 'label'
        if (this.props.property) {
            prop = this.props.property
        }
        if (this.props.labelProperty) {
            prop = this.props.labelProperty
        }
        if (this.props.optionsList && this.props.value) {
            var result = this.props.optionsList.filter(obj => {
                return obj.id == this.props.value
            })
            return (result[0] && result[0][prop]) ? result[0][prop] : ''
        }
        return ''
    }

    render() {
        return <span>{this._getLabel.bind(this)()}</span>
    }
}

export default FancyLabel
