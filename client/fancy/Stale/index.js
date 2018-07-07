import React from "react"
import {connect} from "react-redux"

// In short:
// Use the Stale component to reload data marked as stale the track reducer.
// Status of the target data is marked with the "track" and "trackStaleUp" augments in your actions
//
// Properties for this component:
// target - API call to track
// staleByDefault - execute onStale() if there is no status present at init of the component
// callOnInit - execute API call on init

class Stale extends React.Component {

    constructor(props) {
        super(props)
        this._onStale = this._onStale.bind(this)
        this._staleKey = this._staleKey.bind(this)
        if (!props.track.stale[this._staleKey()] && props.staleByDefault) {
            this._onStale()
        }
        if (props.callOnInit) {
            this._onStale()
        }
    }

    _staleKey() {
        if (this.props.target) {
            if (this.props.target.name) {
                return this.props.target.name
            } else {
                throw "invalid 'target' property. must be an API call."
            }
        } else {
            throw "'target' property is mandatory!"
        }
    }

    _onStale() {
        if (this.props.target) {
            if (this.props.target.action) {
                // do the API call
                this.props.dispatch(this.props.target.action())
            } else {
                throw "invalid 'target' property. must be an API call."
            }
        } else {
            throw "'target' property is mandatory!"
        }
    }

    componentWillMount() {
        this.beforeRender()
    }

    componentWillUpdate(nextProps, nextState) {
        this.beforeRender.bind(Object.assign(this, {props: nextProps, state: nextState}))()
    }

    beforeRender() {
        if (this.props.track.stale[this._staleKey()] && this.props.track.stale[this._staleKey()] < this.props.track.STALE_LOAD) {
            this._onStale()
        }
    }

    render() {
        return null
    }
}

export default connect(
    state => ({track: state.track}),
    null
)(Stale)