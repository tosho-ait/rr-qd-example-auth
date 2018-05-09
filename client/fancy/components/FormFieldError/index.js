import React from 'react'

class FormFieldError extends React.Component {
    render() {
        let content = ""
        if (this.props.field && this.props.field.touched && this.props.field.error) {
            content = <div class="text-danger"><b>{this.props.field.error}</b></div>
        }
        return (
            <span> {content} </span>
        )
    }
}

export default FormFieldError