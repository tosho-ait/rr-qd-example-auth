import React from 'react'
import {connect} from 'react-redux'

// In short:
// Use this to do the routing of the application. Show/Hide children based on properties from route and auth.
// If the provided properties "match" to the current route/auth, display all children without the fallBack one. Otherwise display only the fallBack
//
// Properties for this component:
// fallBack - Marks it as fallBack route. The component itself always displays it's content. And parent RrRoute components can recognize it by this flag.
// routeStartsWith - Show/Hide content based on current URL.
// routeMatches - Show/Hide content based on current URL.
// privatePropsContain - Show/Hide content based on the private (hidden) props of the route.
// isAuthenticated - Show content on if auth.isAuthenticated.
// authConfirmed - Show content on if auth.confirmed. Confirmation check must be triggered somewhere else.
// childMatches - If any of the child RrRoute components "matches" (will be shown) then show all children. Show the fallBack otherwise.
// overridePublic - Override the current URL in the router reducer

class RrRoute extends React.Component {

    render() {
        if (this.props.fallBack) {
            return this.props.children
        } else {
            let toReturn = matches(this.props, this.props.router, this.props.auth, this.props.overridePublic)
            let children = []
            React.Children.map(this.props.children,
                (child) => {
                    if ((child.props && child.props.fallBack && !toReturn) || (child.props && !child.props.fallBack && toReturn)) {
                        children.push(child)
                    }
                }
            )
            if (children.length === 0) {
                return null
            } else if (children.length === 1) {
                return children[0]
            } else {
                return <div class={this.props.classes}>{children}</div>
            }
        }
    }
}
export default connect(
    state => ({router: state.router, auth: state.auth}),
    dispatch => ({})
)(RrRoute)


let matches = (props, router, auth, overridePublic) => {

    let routeStartsWith = props.routeStartsWith
    let routeMatches = props.routeMatches
    let privatePropsContain = props.privatePropsContain
    let isAuthenticated = props.isAuthenticated
    let authConfirmed = props.authConfirmed
    let childMatches = props.childMatches
    let hasAnyRight = props.hasAnyRight

    let publicPart = router.publicpart

    if (overridePublic || overridePublic === "") {
        publicPart = overridePublic
    }

    let toReturn = true;

    if (isAuthenticated && !auth.isAuthenticated) {
        toReturn = false
    }
    if (authConfirmed && (!auth.confirmed || !auth.isAuthenticated)) {
        toReturn = false
    }
    if (hasAnyRight && auth.userDetails && auth.userDetails.authorities && auth.userDetails.authorities.map) {
        let rightMatches = false
        auth.userDetails.authorities.map(userRight => {
            if (userRight.authority && hasAnyRight.indexOf(userRight.authority) > -1) {
                rightMatches = true
            }
        })
        toReturn = rightMatches
    }
    if (privatePropsContain && !router.privateprops[privatePropsContain]) {
        toReturn = false
    }
    if (routeStartsWith) {
        let match = false
        if (routeStartsWith.constructor === Array) {
            routeStartsWith.forEach(part => {
                if (publicPart.startsWith(part)) {
                    match = true
                }
            })
        } else {
            match = publicPart.startsWith(routeStartsWith)
        }
        if (!match) {
            toReturn = false
        }
    }
    if (routeMatches) {
        let match = false
        if (routeMatches.constructor === Array) {
            routeMatches.forEach(part => {
                if (publicPart == part) {
                    match = true
                }
            })
        } else {
            match = publicPart == routeMatches
        }
        if (!match) {
            toReturn = false
        }
    }
    if (childMatches) {
        let match = false
        React.Children.map(props.children,
            (child) => {
                if (child.props && !child.props.fallBack && matches(child.props, router, auth, overridePublic)) {
                    match = true
                }
            }
        )
        if (!match) {
            toReturn = false
        }
    }
    return toReturn
}