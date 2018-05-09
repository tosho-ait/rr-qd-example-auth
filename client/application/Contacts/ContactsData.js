import React from "react"
import {connect} from "react-redux"
import moment from "moment"

class ContactaData extends React.Component {

    render() {
        let people = null
        if (this.props.contacts) {
            people = this.props.contacts.map(item => {
                    let usrImg = <img src={require('../_res/noimage.jpg')}
                                      style={{float: "left", width: "110px", height: "110px", marginRight: "10px"}}/>
                    if (item.image) {
                        usrImg = <img src={"api/usrimg/" + item.image}
                                      style={{float: "left", width: "110px", height: "110px", marginRight: "10px"}}/>
                    }
                    return <div class="col-sm-6" key={item.fid}>
                        <div class="panel panel-default">
                            <div class="panel-body">
                                <div class="row">
                                    <div class="col-xs-12">
                                        {usrImg}
                                        <h4>{item.name}</h4>
                                        <h5>joined {moment(item.created_at).format("MMMM YYYY")}</h5>
                                        <h5>{item.country && "from " + item.country}{!item.country && "no country"}</h5>
                                        <div width={"100%"}>
                                            <div class="text-right"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            )
        }
        if (people && people.length < 1) {
            people.push(<div class="col-sm-12" key={"no_contacts"}>
                <br />
                <div class="well">
                    <h4>You have no contacts. Use the "Find New Contacts" tab above to find and add some.</h4>
                </div>
            </div>)
        } else if (people) {
            people.unshift(<div class="col-sm-12" key={"count"}><h4>You have {people.length} contacts</h4><br/></div>)
        }
        return <div class="row">{people}</div>
    }
}

export default connect(
    state => ({contacts: state.contact.contacts}),
    null
)(ContactaData)