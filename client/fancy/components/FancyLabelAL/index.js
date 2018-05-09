import React from 'react'
import FancyLabel from '../FancyLabel'
import FancyAL from '../FancyAL'

// In short:
// Autoload version of FancyLabel

class FancyLabelAL extends React.Component {
    render() {
        return <FancyAL
            listName={this.props.listName}
            autoLoadAction={this.props.autoLoadAction}
            toProp="optionsList"
            noAutoLoad={this.props.noAutoLoad}>
            <FancyLabel {...this.props} />
        </FancyAL>
    }
}

export default FancyLabelAL