import React from "react"
import {reduxForm} from "redux-form"
import FancyListAL from "../../fancy/components/FancyListAL"
import {expenseAccept} from "../../actions/api"

class AcceptForm extends React.Component {

    render() {
        const {
            fields: {_id, cat, subcat},
            handleSubmit, submitting
        } = this.props

        return <div class="row">
            <div class="col-md-6">
                <div class="row">
                    <div class="col-sm-6">
                        <FancyListAL sizeSmall listName="cats" placeholder="category" {...cat} />
                    </div>
                    <div class="col-sm-6">
                        <FancyListAL sizeSmall listName="subcats" placeholder="subcategory" {...subcat}
                                     filterListName="cats" filterValue={cat.value}/>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="row">
                    <div class="col-sm-9 vmiddle p7t">
                        { this.props.label && <span>{this.props.label}</span> }
                    </div>
                    <div class="col-sm-3 text-right vmiddle">
                        <button type="submit" disabled={submitting} onClick={handleSubmit}
                                class="btn btn-default btn-sm">
                            <span>save</span></button>
                    </div>
                </div>
            </div>
        </div >
    }
}


export default reduxForm({
        form: 'acceptform',
        fields: ['_id', 'cat', 'subcat'],
        onSubmit: (data, dispatch) => new Promise((resolve, reject) =>
            dispatch(expenseAccept.action({data, reject, resolve})))
    },
    (state, ownProps) => ({
        initialValues: {
            _id: ownProps.eid,
            cat: ownProps.cat,
            subcat: ownProps.subcat
        }
    })
)(AcceptForm)