import React from 'react'
import * as LABELS from '../../config/labels'

import 'bootstrap/dist/css/bootstrap.min.css'

class ErrorBar extends React.Component {
    render() {
        let content = ""
        if (this.props.errorMessage && this.props.errorMessage.length > 0) {
            content = <div class="alert alert-danger">
                <h5>{LABELS.LBL_MSG_ERROR}</h5>
                <span> {this.props.errorMessage}<br /> </span>
            </div>
        }
        return <div>{content}</div>
    }
}

export default ErrorBar;