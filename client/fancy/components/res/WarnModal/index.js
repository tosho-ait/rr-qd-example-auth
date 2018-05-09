import React from 'react'
import {Modal} from 'react-bootstrap'
import * as LABELS from '../../../config/labels'

class WarnModal extends React.Component {

    render() {
        let textTitle = this.props.textTitle ?this.props.textTitle :LABELS.LBL_LBL_ATTENTION
        let textClick = this.props.textClick ?this.props.textClick :LABELS.LBL_BTN_CONFIRM
        let textHide = this.props.textHide ?this.props.textHide :LABELS.LBL_BTN_CLOSE
        let textLineOne = this.props.textLineOne ?this.props.textLineOne :""
        let textLineTwo = this.props.textLineTwo ?this.props.textLineTwo :""
        let confirmOnlyReject = this.props.confirmOnlyReject
        return <Modal animation={false} show={this.props.show} onHide={this.props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{textTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div class="alert alert-warning mb0">
                    <p><strong>{textLineOne}</strong></p>
                    <strong>{textLineTwo}</strong>
                </div>
            </Modal.Body>
            <Modal.Footer>
                {!confirmOnlyReject && <a onClick={this.props.onClick} class={'action-item btn btn-warning'}>{textClick}</a>}
                <a onClick={this.props.onHide} class={'action-item  btn btn-grey'}>{textHide}</a>
            </Modal.Footer>
        </Modal>
    }
}

export default WarnModal