import React from 'react'
import FancyMultiSelect from '../FancyMultiSelect'
import FancyAL from '../FancyAL'

// In short:
// FancyMultiSelect version of FancyList

class FancyMultiSelectAL extends React.Component {
    render() {
        return <FancyAL
            listName={this.props.listName}
            autoLoadAction={this.props.autoLoadAction}
            toProp="optionsList">
            <FancyAL
                listName={this.props.filterListName}
                autoLoadAction={this.props.autoLoadAction}
                toProp="optionsListForFilter">
                <FancyMultiSelect {...this.props}
                                  targetNameInFilter={this.props.targetNameInFilter
                                      ? this.props.targetNameInFilter
                                      : this.props.listName}/>
            </FancyAL>
        </FancyAL>
    }
}

export default FancyMultiSelectAL