import React from "react"
import {connect} from "react-redux"
import {RrAction} from "rr-qd"
import {Navbar, Nav, NavDropdown, MenuItem} from "react-bootstrap"
import {routeDo, logoutDo} from "../../actions/app"

class NavBar extends React.Component {

    render() {
        let auth = this.props.auth
        let content = "";
        if (auth.isAuthenticated === true) {
            content = <Navbar.Collapse>
                <Nav>
                    <li><RrAction action={routeDo} values={["", {}]} label="Home" icon="list-alt"/></li>
                </Nav>
                <Nav pullRight>
                    <NavDropdown title={auth.userDetails.name} id="basic-nav-dropdown">
                        <li><RrAction action={routeDo} values={["settings", {}]}>
                            <i class="glyphicon glyphicon-cog"/>&nbsp;&nbsp;User settings</RrAction></li>
                        { auth.userDetails.admin &&
                        <li><RrAction action={routeDo} values={["admin", {}]}>
                            <i class="glyphicon glyphicon-king"/>&nbsp;&nbsp;Admin panel</RrAction>
                        </li> }
                        <MenuItem divider/>
                        <li><RrAction action={logoutDo}>
                            <i class="glyphicon glyphicon-log-out"/>&nbsp;&nbsp;Logout</RrAction></li>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        }

        return <Navbar inverse fixedTop>
            <Navbar.Header>
                <Navbar.Brand>
                    <RrAction action={routeDo} values={["", {}]} classes="navbar-brand">RR-QD EXAMPLE</RrAction>
                </Navbar.Brand>
                <Navbar.Toggle />
            </Navbar.Header>
            {content}
        </Navbar>
    }
}


export default connect(
    state => ({auth: state.auth}),
    dispatch => ({})
)(NavBar)
