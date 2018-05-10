import React from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Modal} from 'react-bootstrap'
import RrAction from "../RrAction"

import * as LABELS from '../../config/labels'

const msgClearMessage = () => ({type: "DNM", meta: {hideMessage: true}})
const msgClearError = () => ({type: "DNM", meta: {hideErrorMessage: true}})

class MessageBar extends React.Component {

    render() {
        let content = ""
        let inModal = this.props.inModal
        let inModalError = this.props.inModalError

        let msgClearMessage = this.props.msgClearMessage
        let msgClearError = this.props.msgClearError

        if (this.props.messages._error && (inModal || inModalError)) {
            content = <Modal animation={false} show={true} onHide={msgClearError}>
                <Modal.Body>
                    <div class="alert alert-danger mb0">
                        <h5>{LABELS.LBL_MSG_ERROR}</h5>
                        <span>{this.props.messages._error.text}<br /> </span>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <RrAction
                        onClick={() => {
                            msgClearError()
                        }}
                        label={LABELS.LBL_BTN_CLOSE}
                        classes="action-item btn btn-grey"/>
                </Modal.Footer>
            </Modal>
        } else if (this.props.messages._message && inModal) {
            content = <Modal animation={false} show={true} onHide={msgClearMessage}>
                <Modal.Body>
                    <div class="alert alert-success mb0">
                        <h5>{LABELS.LBL_MSG_SUCCESS}</h5>
                        <span>{this.props.messages._message.text}<br /> </span>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <RrAction
                        onClick={() => {
                            msgClearMessage()
                        }}
                        label={LABELS.LBL_BTN_CLOSE}
                        classes="action-item  btn btn-grey"/>
                </Modal.Footer>
            </Modal>
        } else if (this.props.messages._error && (!inModal && !inModalError)) {
            content = <div class="alert alert-danger">
                <h5 class="mt2">{LABELS.LBL_MSG_ERROR}</h5>
                <span>{this.props.messages._error.text}<br /> </span>
            </div>
        } else if (this.props.messages._message && !inModal) {
            content = <div class="alert alert-success">
                <h5 class="mt2">{LABELS.LBL_MSG_SUCCESS}</h5>
                <span>{this.props.messages._message.text}<br /> </span>
            </div>
        } else if (this.props.messages._info && !inModal) {
            content = <div class="alert alert-info">
                <h5 class="mt2">{LABELS.LBL_MSG_INFO}</h5>
                <span>{this.props.messages._info.text}<br /> </span>
            </div>
        } else if (this.props.messages._warning && !inModal) {
            content = <div class="alert alert-warning">
                <h5 class="mt2">{LABELS.LBL_MSG_WARNING}</h5>
                <span>{this.props.messages._warning.text}<br /> </span>
            </div>
        }
        return <div>{content}</div>
    }
}

export default connect(
    (state, ownProps) => ({messages: state.router.messages}),
    (dispatch) => bindActionCreators({msgClearError, msgClearMessage}, dispatch)
)(MessageBar)