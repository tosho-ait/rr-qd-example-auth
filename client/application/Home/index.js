import React from "react"
import NavBar from "../../components/NavBar"
import MessageBar from "../../fancy/MessageBar"

class Home extends React.Component {
    render() {
        return <div>
            <NavBar />
            <div class="container">
                <div class="row">
                    <div class="col-sm-12">
                        <h1>Home</h1>
                    </div>
                    <div class="col-sm-12">
                        <hr />
                    </div>
                    <div class="col-sm-12">
                        <MessageBar />
                    </div>
                    <div class="col-sm-12">
                
                    </div>
                </div>
            </div>
        </div>
    }
}

export default Home