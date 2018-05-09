import React from 'react'

class FancyFilter extends React.Component {
    render() {
        let show = false
        if (this.props.filterValue) {
            let filterValue = this.props.filterValue
            let filterProperty = this.props.filterProperty
            if (this.props.optionsListForFilter) {
                this.props.optionsListForFilter.map(optionFromList=> {
                    if (filterValue.constructor === Array) {
                        filterValue.forEach(fv => {
                            if (optionFromList.id == fv && optionFromList.props.indexOf(filterProperty) > -1) {
                                show = true
                            }
                        })
                    } else {
                        if (optionFromList.id == filterValue && optionFromList.props.indexOf(filterProperty) > -1) {
                            show = true
                        }
                    }
                })
            }
        }
        if (show) {
            return this.props.children.length == 1 ? this.props.children[0] : <div>{this.props.children}</div>
        } else {
            return null
        }
    }
}
export default FancyFilter