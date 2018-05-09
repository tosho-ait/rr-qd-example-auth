import React from "react"
import NavBar from "../../components/NavBar"
import RecoverForm from "./RecoverForm"
import WelcomeJumbo from "./WelcomeJumbo"
import "../_res/style.css"

const LayoutWelcomeRecover = () => {
    return <div>
        <NavBar />
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <WelcomeJumbo />
                </div>
                <div class="col-md-6">
                    <RecoverForm />
                </div>
            </div>
        </div>
    </div>
}

export default LayoutWelcomeRecover
