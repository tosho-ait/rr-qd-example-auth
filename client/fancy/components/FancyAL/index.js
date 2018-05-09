import React from "react"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"

class FancyAL extends React.Component {

    constructor(props) {
        super(props)
        this.state = {requestedList: ""}
    }

    componentWillMount() {
        this.beforeRender()
    }

    componentWillReceiveProps(nextProps) {
        this.beforeRender.bind(Object.assign(this, {props: nextProps}))()
    }

    beforeRender() {
        if (this.props.listName && !this.props.noAutoLoad) {
            if (!this.props.myList) {
                if (this.state.requestedList != this.props.listName) {
                    // nasty but can't call setState() here
                    // this prevents multiple loadList() calls since we can get multiple beforeRender() calls while the list is loading
                    this.state = {requestedList: this.props.listName}
                    this.props.loadList({data: {listName: this.props.listName}})
                }
            } else {
                this.state = {requestedList: ""}
            }
        }
    }

    render() {
        let optionsList = undefined
        if (this.props.listName && this.props.toProp) {
            if (this.props.myList) {
                optionsList = this.props.myList
            }
        }
        const childrenWithProps = React.Children.map(this.props.children,
            (child) => {
                let props = Object.assign({}, this.props, child.props)
                return React.cloneElement(child, {...props, [this.props.toProp]: optionsList})
            }
        )
        if (!childrenWithProps || childrenWithProps.length == 0) {
            return null
        } else {
            return childrenWithProps.length == 1 ? childrenWithProps[0] : <div>{childrenWithProps}</div>
        }
    }
}

export default connect(
    (state, ownProps) => ({myList: state.lists.lists[ownProps.listName]}),
    (dispatch, ownProps) => {
        if (ownProps.autoLoadAction) {
            return bindActionCreators({loadList: ownProps.autoLoadAction}, dispatch)
        } else {
            return bindActionCreators({loadList: window.fancy.autoLoadAction}, dispatch)
        }
    }
)(FancyAL)