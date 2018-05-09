import React from "react"
import NavBar from "../../components/NavBar"
import "../_res/style.css"

const About = () => {
    return <div>
        <NavBar />
        <div class="container">
            <div><h1>About</h1></div>
            <hr />
            <br />
            <p>budgetSimply.io was created because of the need to track and organise my personal and my family's
                finances. The idea to have a simple and yet functional tool to manage my money turned slowly
                into this web application. My hope it that it will be useful not only to me but also to many other
                people.</p>
            <p>budgetSimply.io is a minimalist, free online expenses tracker. It will help you find out where
                your money is going, and the best way to keep more of it in your pocket. It's simple and fast to
                use interface will encourage you to keep track of every expense and by this get a detailed
                database of your spending with time.</p>
            <p>For now you can reach me via netbits.io@gmail.com</p>
            <br />
            <br />
        </div>
    </div>
}

export default About
