import React from 'react'
import moment from 'moment'

class FancySetMomentLocale extends React.Component {
    constructor(props) {
        super(props)
        let locale = this.props.locale ? this.props.locale : 'en'
        moment.locale(locale)
    }

    render() {
        return null
    }
}

export default FancySetMomentLocale