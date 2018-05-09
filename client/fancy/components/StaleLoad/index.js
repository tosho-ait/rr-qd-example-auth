import React from "react"
import {connect} from "react-redux"

// In short:
// Use the StaleLoad component to reload data marked as stale in your reducers.
// Status of the target data is marked with the "staleUp", "staleLoad" and ""staleDown" augments in your actions
//
// Properties for this component:
// staleTarget - key to identify the target data, must be the same as the value of the "staleUp",
//               "staleLoad" and ""staleDown" in your actions
// staleOnInit - execute onStale() if there is no status present at init of the component
// onStale - function to execute on stale data
// onInit - function to always execute on init

class StaleLoad extends React.Component {

    constructor(props) {
        super(props)
        if (!props.track.stale[props.staleTarget] && props.staleOnInit) {
            props.onStale()
        }
        if (props.onInit) {
            props.onInit(props.track.stale[props.staleTarget])
        }
    }

    componentWillMount() {
        this.beforeRender()
    }

    componentWillUpdate(nextProps, nextState) {
        this.beforeRender.bind(Object.assign(this, {props: nextProps, state: nextState}))()
    }

    beforeRender() {
        if (this.props.track.stale[this.props.staleTarget] && this.props.track.stale[this.props.staleTarget] < this.props.track.STALE_LOAD) {
            this.props.onStale()
        }
    }

    render() {
        return null
    }
}

export default connect(
    state => ({track: state.track}),
    null
)(StaleLoad)