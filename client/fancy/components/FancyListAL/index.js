import React from "react"
import FancyList from "../FancyList"
import FancyAL from "../FancyAL"

// In short:
// Autoload version of FancyList

class FancyListAL extends React.Component {
    render() {
        return <FancyAL
            listName={this.props.listName}
            autoLoadAction={this.props.autoLoadAction}
            toProp="optionsList">
            <FancyAL
                listName={this.props.filterListName}
                autoLoadAction={this.props.autoLoadAction}
                toProp="optionsListForFilter">
                <FancyList {...this.props}
                           targetNameInFilter={this.props.targetNameInFilter
                               ? this.props.targetNameInFilter
                               : this.props.listName}/>
            </FancyAL>
        </FancyAL>
    }
}

export default FancyListAL