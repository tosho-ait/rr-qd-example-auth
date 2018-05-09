import React from "react"
import NavBar from "../../components/NavBar"
import RegisterForm from "./RegisterForm"
import WelcomeJumbo from "./WelcomeJumbo"
import "../_res/style.css"

const LayoutWelcomeReg = () => {
    return <div class="white">
        <NavBar />
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <WelcomeJumbo />
                </div>
                <div class="col-md-6">
                    <RegisterForm />
                </div>
            </div>
        </div>
    </div>
}

export default LayoutWelcomeReg
