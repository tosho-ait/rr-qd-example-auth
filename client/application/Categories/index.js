import React from "react"
import {connect} from "react-redux"
import NavBar from "../../components/NavBar"
import ActionItem from "../../fancy/components/ActionItem"
import MessageBar from "../../fancy/components/MessageBar"
import {routeDo} from "../../actions/app"


class Categories extends React.Component {

    render() {
        let cats = null
        if (this.props.all && this.props.all.map) {
            cats = this.props.all.map(cat =>
                <tr key={cat.label}>
                    <td>
                        <div class="row">
                            <div class="col-sm-12">
                                <div class="row">
                                    <div class="col-sm-8">
                                        <h4 class="mt0">{cat.label}</h4>
                                    </div>
                                    <div class="col-sm-4 text-right">
                                        <ActionItem classes="btn btn-sm btn-default " action={routeDo}
                                                    values={["categories/categoryform", {categoryToEdit: cat}]}
                                                    label="Edit"/>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-2"></div>
                            <div class="col-sm-10">
                                {cat.subcats && cat.subcats.map(subcat =>
                                    <span>
                                        <button class="btn btn-sm btn-default ">
                                        {subcat.label}
                                        </button>
                                        &nbsp;
                                    </span>
                                )}
                            </div>
                        </div>
                    </td>
                </tr>)
        }

        return <div>
            <NavBar />
            <div class="container">
                <div class="row">
                    <div class="col-xs-12"><h1>Configure Categories</h1></div>
                    <div class="col-xs-12">
                        <hr />
                    </div>
                    <div class="col-xs-12">
                        <MessageBar />
                    </div>
                    <div class="col-md-12 text-right">
                        <ActionItem classes="btn btn-default "
                                    action={routeDo}
                                    values={["categories/categoryform", {}]}
                                    label="Add Category"/></div>
                    {cats && cats.length > 0 && <div class="col-md-12">
                        <table class="table table-striped">
                            <thead>
                            <tr>
                                <th>
                                    <div class="row">
                                        <div class="col-sm-2">Category</div>
                                        <div class="col-sm-2">Subcategories</div>
                                    </div>
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {cats}
                            </tbody>
                        </table>
                    </div>}
                    {(!cats || cats.length == 0) && <div class="col-md-12">
                        <br/>
                        <div class="well">
                            <h4>You have not added any expense Categories yet.</h4>
                        </div>
                    </div>}
                </div>
                <br />
            </div>
        </div>
    }
}

export default connect(
    state => ({all: state.category.all}),
    null
)(Categories)