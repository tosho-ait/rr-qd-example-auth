import React from "react"
import NavBar from "../../components/NavBar"
import ResetForm from "./ResetForm"
import WelcomeJumbo from "./WelcomeJumbo"
import "../_res/style.css"

const LayoutWelcomeRst = () => {
    return <div>
        <NavBar />
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <WelcomeJumbo />
                </div>
                <div class="col-md-6">
                    <ResetForm />
                </div>
            </div>
        </div>
    </div>
}

export default LayoutWelcomeRst
