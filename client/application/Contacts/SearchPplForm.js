import React from "react"
import {reduxForm} from "redux-form"
import {searchPpl} from "../../actions/api"

class SearchPplForm extends React.Component {
    render() {
        const {fields: {criteria}, handleSubmit, error, submitting} = this.props;
        return <div>
            <form class="form-horizontal" onSubmit={handleSubmit}>
                <div class="row">
                    <div class="col-xs-2"></div>
                    <div class="col-xs-6">
                        <input class="form-control" type="text" {...criteria} placeholder="find contacts"/>
                    </div>
                    <div class="col-xs-4">
                        <button type="submit"
                                disabled={submitting || !criteria.value || criteria.value.length < 3}
                                class="btn btn-success">
                            <span>Search</span>
                        </button>
                    </div>
                    <div class="col-xs-12"><br /></div>
                </div>
            </form>
        </div>
    }
}

export default reduxForm({
    form: 'searchppl',
    fields: ['criteria'],
    onSubmit: (data, dispatch) => {
        return new Promise(function (resolve, reject) {
            dispatch(searchPpl.action({data, reject, resolve}));
        })
    }
})(SearchPplForm)