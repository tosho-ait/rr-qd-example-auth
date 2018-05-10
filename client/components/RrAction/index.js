import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import './index.css'

const confirmRouteRelease = () => ({type: "DNM", meta: {confirmRouteRelease: true}})

class RrAction extends React.Component {

    constructor(props) {
        super(props)
        this.onClick = this.onClick.bind(this)
        this.openConfirm = this.openConfirm.bind(this)
        this.closeConfirm = this.closeConfirm.bind(this)
        this.openConfirmRoute = this.openConfirmRoute.bind(this)
        this.closeConfirmRoute = this.closeConfirmRoute.bind(this)
        this.state = {showConfirmComponent: false, showConfirmRouteComponent: false}
    }

    onClick(event) {
        event.preventDefault()
        event.stopPropagation()
        if (!this.props.disabled) {
            let confirmComponent = this.props.confirmComponent
            let confirmRouteComponent = this.props.confirmRouteComponent
            if (confirmComponent && !this.state.showModal) {
                this.openConfirm()
            } else if ((confirmRouteComponent && this.props.confirmRoutePrimed) && !this.state.showConfirmRouteComponent) {
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
                if (confirmRouteComponent && this.props.confirmRoutePrimed && this.props.confirmRouteRelease) {
                    this.props.confirmRouteRelease()
                }
                this.props.onClick && this.props.onClick(this.props)
                this.closeConfirm()
                this.closeConfirmRoute()
            }
        }
    }

    closeConfirm() {
        this.setState({showConfirmComponent: false})
    }

    openConfirm() {
        this.setState({showConfirmComponent: true})
    }

    closeConfirmRoute() {
        this.setState({showConfirmRouteComponent: false})
    }

    openConfirmRoute() {
        this.setState({showConfirmRouteComponent: true})
    }

    render() {
        let classes = this.props.classes ? this.props.classes : ''
        let style = this.props.style ? this.props.style : null
        let confirmComponent = this.props.confirmComponent
        let confirmRouteComponent = this.props.confirmRouteComponent
        let confirmRoutePrimed = this.props.confirmRoutePrimed
        if (this.props.disabled) {
            classes += this.props.disabledClass ? (" " + this.props.disabledClass) : " disabled"
        }
        let toReturn = <a onClick={this.onClick} class={'rr-qd-action ' + classes} style={style} href={this.props.link}>
            {this.props.label && <span>&nbsp;</span>} {this.props.label} {this.props.children}
            { confirmComponent && confirmComponent({
                visible: this.state.showConfirmComponent,
                onHide: this.closeConfirm,
                onClick: this.onClick
            })}
            { confirmRouteComponent && confirmRoutePrimed && confirmRouteComponent({
                visible: this.state.showConfirmRouteComponent,
                onHide: this.closeConfirmRoute,
                onClick: this.onClick
            })}
        </a>
        if (this.props.wrapIn) {
            toReturn = this.props.wrapIn(toReturn)
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
)(RrAction)