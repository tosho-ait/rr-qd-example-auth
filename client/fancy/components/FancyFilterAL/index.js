import React from 'react'
import FancyFilter from '../FancyFilter'
import FancyAL from '../FancyAL'

class FancyFilterAL extends React.Component {
    render() {
        return (
            <FancyAL listName={this.props.listName} toProp="optionsList">
                <FancyAL listName={this.props.filterListName} toProp="optionsListForFilter">
                    <FancyFilter {...this.props} targetNameInFilter={this.props.listName}>{this.props.children}</FancyFilter>
                </FancyAL>
            </FancyAL>
        )
    }
}

export default FancyFilterAL