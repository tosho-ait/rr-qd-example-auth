import React from "react"
import NavBar from "../../components/NavBar"
import SettingsForm from "./SettingsForm"
import "../_res/style.css"

class Settings extends React.Component {

    render() {
        return <div>
            <NavBar />
            <div class="container">
                <SettingsForm />
            </div>
        </div>
    }
}

export default Settings
