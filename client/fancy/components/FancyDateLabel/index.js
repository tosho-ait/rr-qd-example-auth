import React from 'react'
import moment from 'moment'

let dateFormatJava = "DD/MM/YYYY HH:mm:ss.SSS"
let dateFormat = "DD/MM/YYYY"

// In short:
// Display a formatted js date
//
// Properties for this component:
// value -

class FancyDateLabel extends React.Component {

    render() {
        let value = (this.props.value) ? moment(this.props.value, dateFormatJava).format(dateFormat) : ""
        return <span>{value}</span>
    }
}

export default FancyDateLabel