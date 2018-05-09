import React from "react"
import {connect} from "react-redux"
import ActionItem from "../../fancy/components/ActionItem"
import moment from "moment"
import {contactAdd} from "../../actions/api"


class SearchPplData extends React.Component {

    render() {
        let people = this.props.people.map(item => {
            let usrImg = <img src={require('../_res/noimage.jpg')}
                              style={{float: "left", width: "110px", height: "110px", marginRight: "10px"}}/>
            if (item.image) {
                usrImg = <img src={"api/usrimg/" + item.image}
                              style={{float: "left", width: "110px", height: "110px", marginRight: "10px"}}/>
            }
            return <div class="col-sm-6" key={item._id}>
                <div class="panel panel-default">
                    <div class="panel-body">
                        <div class="row">
                            <div class="col-xs-12">
                                {usrImg}
                                <h4>{item.name}</h4>
                                <h5>joined {moment(item.created_at).format("MMMM YYYY")}</h5>
                                <h5>{item.country && "from " + item.country}{!item.country && "no country"}</h5>
                                <div width={"100%"}>
                                    <div class="text-right">
                                        {!item.request && !item.friends &&
                                        <ActionItem action={contactAdd}
                                                    classes="btn btn-default btn-sm"
                                                    values={[{data: {uid: item._id}}]}
                                                    label="add contact"/>}
                                        {item.request && !item.friends && !item.rejected &&
                                        <div class="p5t">contact requested</div>}
                                        {item.friends && <div class="p5t">already a contact</div>}
                                        {item.rejected && <div class="p5t">request rejected</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        })
        if (people.length > 0) {
            people.unshift(<div class="col-sm-12"><h4>Search Results:</h4><br/></div>)
        } else if (this.props.notFound) {
            people.unshift(<div class="col-sm-12"><h4>Nothing found.</h4><br/></div>)
        }
        return <div class="row">
            {people}
            <div class="col-sm-12"><br/></div>
        </div>
    }
}

export default connect(
    state => ({
        people: state.searchppl.all,
        notFound: state.searchppl.notFound
    }), null
)(SearchPplData)