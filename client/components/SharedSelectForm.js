import React from "react"
import {reduxForm} from "redux-form"
import {updateSharedWith} from "../actions/api"
import FancyListAL from "../fancy/components/FancyListAL"


class SharedSelectForm extends React.Component {

    constructor(props) {
        super(props)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onSubmit(data) {
        let dispatch = this.props.dispatch
        return new Promise(function (resolve, reject) {
            dispatch(updateSharedWith(data))
            resolve()
        })
    }

    render() {
        const {fields: {withowner}, handleSubmit, error, submitting} = this.props;
        return <div>
            <form class="form-horizontal">
                <FancyListAL listName="contacts" placeholder="contact" {...withowner} onChange={value=> {
                    withowner.onChange(value)
                    handleSubmit(this.onSubmit({withowner: value}))
                }}/>
            </form>
        </div>
    }
}

export default reduxForm({
        form: 'sharedselect',
        fields: ['withowner']
    },
    state => ((state.sharedwith.withowner) ? {initialValues: state.sharedwith} : {}))
(SharedSelectForm)