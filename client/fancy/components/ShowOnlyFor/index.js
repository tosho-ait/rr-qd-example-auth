import React from 'react'
import {connect} from 'react-redux'

class ShowOnlyFor extends React.Component {

    render() {
        let authorityFlag = !this.props.hasAnyRight
        if (this.props.userRights && this.props.hasAnyRight) {
            this.props.userRights.map(userRight => {
                if (this.props.hasAnyRight && userRight.authority) {
                    if (this.props.hasAnyRight.constructor === Array && this.props.hasAnyRight.indexOf(userRight.authority) > -1) {
                        authorityFlag = true
                    }
                    if (typeof this.props.hasAnyRight === 'string' && this.props.hasAnyRight === userRight.authority) {
                        authorityFlag = true
                    }
                }
            })
        }
        let userFlag = !this.props.userId
        if (this.props.currentUserId && this.props.userId) {
            if (this.props.currentUserId === this.props.userId) {
                userFlag = true
            }
        }
        let flag = authorityFlag && userFlag
        if (flag && !this.props.inverse) {
            return React.Children.only(this.props.children)
        } else if (!flag && this.props.inverse) {
            return React.Children.only(this.props.children)
        }
        return null
    }
}

function mapStateToProps(state) {
    let userRights = []
    let userAssignments = []
    let currentUserId = null
    if (state.auth && state.auth.userDetails) {
        userRights = state.auth.userDetails.authorities
        userAssignments = state.auth.userDetails.assignments
        currentUserId = state.auth.userDetails.userId
    }
    return {currentUserId, userRights, userAssignments}
}

export default connect(mapStateToProps, null)(ShowOnlyFor);