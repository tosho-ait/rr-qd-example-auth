import React from "react"
import {RrAction} from "rr-qd"
import {routeDo} from "../../actions/app"

let Footer = () => {
    return <footer class="container">
        <br/>
        <div class="row">
            <div class="col-lg-12 text-center">
                <RrAction action={routeDo} values={["", ""]} classes="gerylink" label="Home"/>
                &nbsp;|&nbsp;
                <RrAction action={routeDo} values={["therms", ""]} classes="gerylink" label="Terms of Service"/>
                &nbsp;|&nbsp;
                <RrAction action={routeDo} values={["policy", ""]} classes="gerylink" label="Privacy Policy"/>
                &nbsp;|&nbsp;
                <RrAction action={routeDo} values={["about", ""]} classes="gerylink" label="About"/>
            </div>
        </div>
        <br/>
    </footer>
}

export default Footer
