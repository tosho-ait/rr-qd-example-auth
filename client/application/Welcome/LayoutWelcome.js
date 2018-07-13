import React from "react"
import NavBar from "../../components/NavBar"
import LoginForm from "./forms/LoginForm"
import WelcomeJumbo from "./WelcomeJumbo"
import "../_res/style.css"

const LayoutWelcome = () => {
    return <div >
        <NavBar />
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <WelcomeJumbo />
                </div>
                <div class="col-md-6">
                    <LoginForm />
                </div>
            </div>
        </div>
    </div>
}

export default LayoutWelcome
