import React from 'react'
import FancyBoxes from '../FancyBoxes'
import FancyAL from '../FancyAL'

class FancyBoxesAL extends React.Component {
    render() {
        return (
            <FancyAL listName={this.props.listName} toProp="optionsList">
                <FancyAL listName={this.props.filterListName} toProp="optionsListForFilter">
                    <FancyBoxes {...this.props} targetNameInFilter={this.props.targetNameInFilter ?this.props.targetNameInFilter :this.props.listName}/>
                </FancyAL>
            </FancyAL>
        )
    }
}

export default FancyBoxesAL