import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Tooltip, OverlayTrigger} from 'react-bootstrap'
import WarnModal from '../res/WarnModal'
import DangerModal from '../res/DangerModal'
import * as LABELS from '../../config/labels'

import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

const confirmRouteRelease = () => ({type: "DNM", meta: {confirmRouteRelease: true}})

class ActionItem extends React.Component {

    constructor(props) {
        super(props)
        this.onClick = this.onClick.bind(this)
        this.openConfirm = this.openConfirm.bind(this)
        this.closeConfirm = this.closeConfirm.bind(this)
        this.openConfirmRoute = this.openConfirmRoute.bind(this)
        this.closeConfirmRoute = this.closeConfirmRoute.bind(this)
        this.state = {showModal: false, showModalRoute: false}
    }

    onClick(event) {
        event.preventDefault()
        event.stopPropagation()
        if (!this.props.disabled) {
            let confirmText = this.props.confirmText
            if (confirmText && !this.state.showModal) {
                this.openConfirm()
            } else if ((this.props.confirmRouteTrigger && this.props.confirmRoutePrimed) && !this.state.showModalRoute) {
                this.openConfirmRoute()
            } else {
                if (this.props.values && this.props.action) {
                    if (this.props.values.constructor === Array) {
                        this.props.boundAction(...this.props.values)
                    } else {
                        this.props.boundAction(this.props.values)
                    }
                } else if (this.props.action) {
                    this.props.boundAction()
                }
                if (this.props.confirmRouteTrigger && this.props.confirmRoutePrimed && this.props.confirmRouteRelease) {
                    this.props.confirmRouteRelease()
                }
                this.props.onClick && this.props.onClick(this.props)
                this.closeConfirm()
                this.closeConfirmRoute()
            }
        }
    }

    closeConfirm() {
        this.setState({showModal: false})
    }

    openConfirm() {
        this.setState({showModal: true})
    }

    closeConfirmRoute() {
        this.setState({showModalRoute: false})
    }

    openConfirmRoute() {
        this.setState({showModalRoute: true})
    }

    render() {
        let iconClasses = this.props.icon ? (' glyphicon glyphicon-' + this.props.icon) : ''
        let iconClasses2 = this.props.icon2 ? (' glyphicon glyphicon-' + this.props.icon2) : ''
        let classes = this.props.classes ? this.props.classes : ''
        let style = this.props.style ? this.props.style : null
        if (this.props.disabled) {
            classes += this.props.disabledClass ? (" " + this.props.disabledClass) : " disabled"
        }
        let confirmText = this.props.confirmText
        let confirmTextTwo = this.props.confirmTextTwo || ""
        let confirmOnlyReject = this.props.confirmOnlyReject
        let tooltip = this.props.tooltip
        let wrapIn = this.props.wrapIn
        let toReturn = <a onClick={this.onClick} class={'action-item ' + classes} style={style} href={this.props.link}>
            {this.props.icon && <span><i class={iconClasses}/>{this.props.label &&
            <span>&nbsp;</span>}</span>} {this.props.label} {this.props.children}
            { confirmText && <DangerModal
                show={this.state.showModal}
                onHide={this.closeConfirm}
                onClick={this.onClick}
                confirmOnlyReject={confirmOnlyReject}
                textLineOne={confirmText}
                textLineTwo={confirmTextTwo}/>}
            {this.props.icon2 && <span><i class={iconClasses2}/></span>}
        </a>
        if (this.props.confirmRouteTrigger && this.props.confirmRoutePrimed) {
            toReturn = <a onClick={this.onClick} class={'action-item ' + classes} style={style} href={this.props.link}>
                {this.props.icon && <span><i class={iconClasses}/>{this.props.label &&
                <span>&nbsp;</span>}</span>} {this.props.label} {this.props.children}
                <WarnModal
                    show={this.state.showModalRoute}
                    onHide={this.closeConfirmRoute}
                    onClick={this.onClick}
                    textLineOne={LABELS.LBL_RC_CONFIRM_L1}
                    textLineTwo={LABELS.LBL_RC_CONFIRM_L2}/>
            </a>
        }
        if (tooltip) {
            let ttp = <Tooltip id={"someId"}>{tooltip}</Tooltip>
            toReturn = <OverlayTrigger delay={300} placement="bottom" overlay={ttp}>
                {toReturn}
            </OverlayTrigger>
        }
        if (wrapIn) {
            toReturn = wrapIn(toReturn)
        }
        return toReturn
    }
}

export default connect(
    state => ({confirmRoutePrimed: state.router.confirmRoute}),
    (dispatch, ownProps) => {
        let toBind = {confirmRouteRelease}
        if (ownProps.action && typeof ownProps.action != 'string') {
            if (ownProps.action.action) {
                toBind.boundAction = ownProps.action.action
            } else {
                toBind.boundAction = ownProps.action
            }
        }
        return bindActionCreators(toBind, dispatch)
    }
)(ActionItem)