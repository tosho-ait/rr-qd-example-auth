import React from "react"
import NavBar from "../../components/NavBar"
import ConfirmForm from "./ConfirmForm"
import WelcomeJumbo from "./WelcomeJumbo"
import "../_res/style.css"

const LayoutWelcomeConfirm = () => {
    return <div>
        <NavBar />
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <WelcomeJumbo />
                </div>
                <div class="col-md-6">
                    <ConfirmForm />
                </div>
            </div>
        </div>
    </div>
}

export default LayoutWelcomeConfirm
