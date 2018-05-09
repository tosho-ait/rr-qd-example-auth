import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import WarnModal from '../res/WarnModal'
import * as LABELS from '../../config/labels'

// In short:
// Wrap your input components that will cause a URL change/reload of a form/etc... in a FancyConfirmRouteTrigger to get a
// warning message if you have unsaved changes in FancyConfirmRoutePrimer wrapped inputs.
// FancyConfirmRouteTrigger only watches for events that will require a warning message.
// Use the FancyConfirmRoutePrimer component to mark inputs that need to be watched.
//
// Properties for this component:
// wrapIn -

class FancyConfirmRouteTrigger extends React.Component {

    constructor(props) {
        super(props)
        this._onChange = this._onChange.bind(this)
        this.closeConfirm = this.closeConfirm.bind(this)
        this.openConfirm = this.openConfirm.bind(this)
        this.state = {showModal: false, val: null}
    }

    closeConfirm() {
        this.setState({showModal: false, val: null})
    }

    openConfirm(val) {
        this.setState({showModal: true, val})
    }

    _onChange(val) {
        if (this.props.confirmRoutePrimed && !this.state.showModal) {
            this.openConfirm(val)
        } else {
            let toForward = val
            if (this.state.showModal) {
                // we have a confirm after a trigger
                this.props.confirmRouteRelease()
                toForward = this.state.val
            }
            React.Children.only(this.props.children).props.onChange(toForward)
            this.closeConfirm()
        }
    }

    render() {
        let child = React.Children.only(this.props.children)
        let props = Object.assign({}, child.props, {onChange: this._onChange})
        let clone = React.cloneElement(child, {...props})
        if (this.props.wrapIn) {
            clone = this.props.wrapIn(clone)
        }
        return <span>
            {clone}
            <WarnModal
                show={this.state.showModal}
                onHide={this.closeConfirm}
                onClick={this._onChange}
                textLineOne={LABELS.LBL_RC_CONFIRM_L1}
                textLineTwo={LABELS.LBL_RC_CONFIRM_L2}/>
        </span>
    }
}

export default connect(
    state => ({confirmRoutePrimed: state.router.confirmRoute}),
    dispatch => bindActionCreators({
        confirmRouteRelease: () => ({
            type: "DNM",
            meta: {confirmRouteRelease: true}
        })
    }, dispatch)
)(FancyConfirmRouteTrigger)