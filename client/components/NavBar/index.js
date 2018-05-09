import React from "react"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import ActionItem from "../../fancy/components/ActionItem"
import {Navbar, Nav, NavDropdown, MenuItem} from "react-bootstrap"
import {uploadToExpense} from "../../actions/api"
import {routeDo, logoutDo} from "../../actions/app"

class NavBar extends React.Component {

    constructor(props) {
        super(props)
        this.onFileSelect = this.onFileSelect.bind(this)
    }

    onFileSelect(event) {
        event.preventDefault();
        const files = [...event.target.files]
        const formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('file', files[0]);
        this.props.uploadToExpense({formData})
    }

    render() {
        let auth = this.props.auth
        let content = "";
        if (auth.isAuthenticated === true) {
            content = <Navbar.Collapse>
                <Nav>
                    <li><ActionItem action={routeDo} values={["", {}]} label="Expenses" icon="list-alt"/></li>
                    <li><ActionItem action={routeDo} values={["charts", {}]} label="Charts" icon="stats"/></li>
                    <li><ActionItem action={routeDo} values={["shared", {}]} label="Shared" icon="scale"/></li>
                    {/*<li class="mt8"><span class="btn btn-default btn-file">*/}
                        {/*snap a bill <input onChange={this.onFileSelect} type="file" accept="image/*" capture="camera"/></span>*/}
                    {/*</li>*/}
                </Nav>
                <Nav pullRight>
                    <li>
                        <NavDropdown title={auth.userDetails.name} id="basic-nav-dropdown">
                            <li><ActionItem action={routeDo} values={["connections/my", {}]} label="contacts"
                                            icon="user"/></li>
                            <li><ActionItem action={routeDo} values={["categories", {}]} label="categories"
                                            icon="wrench"/></li>
                            <li><ActionItem action={routeDo} values={["settings", {}]} label="user settings"
                                            icon="cog"/></li>
                            { auth.userDetails.admin &&
                            <li><ActionItem action={routeDo} values={["admin", {}]} label="admin panel" icon="king"/>
                            </li> }
                            <MenuItem divider/>
                            <li><ActionItem action={logoutDo} label="logout" icon="log-out"/></li>
                        </NavDropdown>
                    </li>
                </Nav>
            </Navbar.Collapse>
        }

        return <Navbar inverse fixedTop>
            <Navbar.Header>
                <Navbar.Brand>
                    <a href="#">budgetSimply.io</a>
                </Navbar.Brand>
                <Navbar.Toggle />
            </Navbar.Header>
            {content}
        </Navbar>
    }
}


export default connect(
    state => ({auth: state.auth}),
    dispatch => bindActionCreators({uploadToExpense: uploadToExpense.action}, dispatch)
)(NavBar)
