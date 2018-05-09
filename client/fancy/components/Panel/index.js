import React from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import './index.css'

// In short:
// Expandable Panel component that can preserve its state (expanded/collapsed)
//
// Properties for this component:
// expanded -
// expandKey -
// actions -
// getActions -
// classes -
// panelHeadingClasses -

class Panel extends React.Component {

    constructor(props) {
        super(props)
        this.state = {expanded: props.expanded || false}
    }

    render() {
        let expandend = this.state.expanded
        let expandKey = this.props.expandKey
        if (expandKey && this.props.persistedProps) {
            // ignore component state and get expanded from redux state
            if (this.props.persistedProps[expandKey]) {
                expandend = true
            } else {
                expandend = false
            }
        }
        let contentClasses = 'panel-collapse'
        contentClasses += expandend ? ' open' : ''
        let panelClasses = "panel panel-default " + (this.props.classes || '')
        let panelHeadingClasses = "panel-heading " + (this.props.panelHeadingClasses || '')
        return (
            <div class={panelClasses}>
                <div class={panelHeadingClasses}>
                    <div class="row">
                        <div class="col-xs-6" onClick={() => {
                            this.setState({expanded: !expandend})
                            if (expandKey) {
                                this.props.setStateProp(expandKey, !expandend)
                            }
                        }}>
                            {!expandend && <i class="glyphicon glyphicon-chevron-right panel-title-gi"/>}
                            {expandend && <i class="glyphicon glyphicon-chevron-down panel-title-gi"/>}
                            <span class="panel-title">
                                {this.props.title}
                            </span>
                        </div>
                        <div class='col-xs-6 text-right'>
                            {this.props.actions && this.props.actions}
                            {this.props.getActions && this.props.getActions(() => {
                                this.setState({expanded: true})
                                if (expandKey) {
                                    this.props.setStateProp(expandKey, true)
                                }
                            })}
                        </div>
                    </div>
                </div>
                {expandend && <div class={contentClasses} role="tabpanel" aria-expanded="true">
                    <div class="panel-body">
                        {this.props.children}
                    </div>
                </div>}
            </div>
        )
    }
}

export default connect(
    (state) => ({persistedProps: state.props}),
    (dispatch) => bindActionCreators({
        setStateProp: (key, val) => ({
            type: "DNM",
            meta: {saveStateKey: key, saveStateVal: val}
        })
    }, dispatch)
)(Panel)