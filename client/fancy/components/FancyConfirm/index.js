import React from 'react'
import WarnModal from '../res/WarnModal'
import DangerModal from '../res/DangerModal'

// In short:
// Wrap your form components in this one to get a warning/error message (in a modal popup) when their onChange function is called.
//
// Properties for this component:
// wrapIn - By default the provided child component will be wrapped in a <span> tag.
//          Provide a function here if you want to insert more stuff between the form component and the <span>.
//          You might need this if the wrapper <span> messes up your css.
// onlyOnValues - Provide a filter function if you don't want a warning/error modal on every change.
// danger - Show a error modal (red color). The default one is a warning (orange color).
// textLineOne - First line of text in the modal.
// textLineTwo - Second line of text in the modal.

class FancyConfirm extends React.Component {

    constructor(props) {
        super(props)
        this._onChange = this._onChange.bind(this)
        this.closeConfirm = this.closeConfirm.bind(this)
        this.openConfirm = this.openConfirm.bind(this)
        this.state = {showModal: false, val: null}
    }

    closeConfirm() {
        this.setState({showModal: false, val: null});
    }

    openConfirm(val) {
        this.setState({showModal: true, val});
    }

    _onChange(val) {
        if (val.persist) {
            // persist events so target van be read multiple times
            val.persist()
        }
        // handle checkboxes
        if (val.target && val.target.type == 'checkbox') {
            val = val.target.checked
        }
        if (!this.state.showModal && (!this.props.onlyOnValues || this.props.onlyOnValues(val))) {
            this.openConfirm(val)
        } else {
            let toForward = val
            if (this.state.showModal) {
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
            {!this.props.danger && <WarnModal
                show={this.state.showModal}
                onHide={this.closeConfirm}
                onClick={this._onChange}
                textLineOne={this.props.textLineOne}
                textLineTwo={this.props.textLineTwo}/>}
            {this.props.danger && <DangerModal
                show={this.state.showModal}
                onHide={this.closeConfirm}
                onClick={this._onChange}
                textLineOne={this.props.textLineOne}
                textLineTwo={this.props.textLineTwo}/>}
        </span>
    }
}

export default FancyConfirm