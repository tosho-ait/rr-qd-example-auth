import React from "react"
import {connect} from "react-redux"
import RrAction from "../RrAction"
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
                    <li>
                        <NavDropdown title={auth.userDetails.name} id="basic-nav-dropdown">
                            <li><RrAction action={routeDo} values={["settings", {}]} label="user settings">
                                <i class="glyphicon glyphicon-cog"/></RrAction></li>
                            { auth.userDetails.admin &&
                            <li><RrAction action={routeDo} values={["admin", {}]} label="admin panel">
                                <i class="glyphicon glyphicon-king"/></RrAction>
                            </li> }
                            <MenuItem divider/>
                            <li><RrAction action={logoutDo} label="logout">
                                <i class="glyphicon glyphicon-log-out"/></RrAction></li>
                        </NavDropdown>
                    </li>
                </Nav>
            </Navbar.Collapse>
        }

        return <Navbar inverse fixedTop>
            <Navbar.Header>
                <Navbar.Brand>
                    <a href="#">RR-QD EXAMPLE</a>
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
