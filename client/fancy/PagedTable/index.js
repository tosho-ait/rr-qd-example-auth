import React from 'react'

import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

import {LBL_FT_NEXT, LBL_FT_PREV} from '../../config/labels'

class PagedTable extends React.Component {

    constructor(props) {
        super(props)
        this._buildHeader = this._buildHeader.bind(this)
        this._buildBody = this._buildBody.bind(this)
        this._buildPagination = this._buildPagination.bind(this)
        this._setSortIndex = this._setSortIndex.bind(this)
        this._getSortFunction = this._getSortFunction.bind(this)
        this._getSortCustom = this._getSortCustom.bind(this)
        this._toggle = this._toggle.bind(this)
        this._resetExpandable = this._resetExpandable.bind(this)
        let sortIndex = -1
        if (this.props.sortBy || this.props.sortBy === 0) {
            sortIndex = this.props.sortBy
        }
        this.defPageSize = 20;
        if (this.props.noPages) {
            this.defPageSize = this.props.body.length
        }
        this.state = {page: 0, sortIndex, sortReverse: false, open: this._resetExpandable()}
    }

    _resetExpandable() {
        let pageSize = (this.props.pageSize) ? this.props.pageSize : this.defPageSize
        let open = []
        for (let i = 0; i < pageSize; i++) {
            open.push(this.props.expanded)
        }
        return open
    }

    _toggle(row) {
        let open = this.state.open.slice()
        if (open[row]) {
            open[row] = false
        } else {
            open[row] = true;
        }
        this.setState({open})
    }

    _setSortIndex(index) {
        this.setState({sortReverse: false, sortIndex: index, open: this._resetExpandable()})
    }

    _getSortCustom(index) {
        if (this.props.header && this.props.header[index] && this.props.header[index].sortFunction) {
            return this.props.header[index].sortFunction
        } else {
            return (a, b) => {
                if (a.localeCompare) {
                    return a.localeCompare(b)
                }
                return 0;
            }
        }
    }

    _getSortFunction() {
        let index = this.state.sortIndex
        if (index < 0) {
            return null
        }
        return (a, b) => {
            if (a.cells && a.cells.length > index && b.cells && b.cells.length > index) {
                let cellA = a.cells[index].value
                let cellB = b.cells[index].value
                return this._getSortCustom(index)(cellA, cellB)
            }
            return 0
        }
    }

    render() {
        let classes = (this.props.classes) ? this.props.classes : ''
        let header = this._buildHeader();
        let body = this._buildBody();
        if (this.props.noPages) {
            return <table class={"table " + classes} width="100%">
                {header}
                {body}
            </table>
        } else {
            let pagination = this._buildPagination();
            return <div class="row">
                <div class="col-xs-12">
                    <table class={"table " + classes} width="100%">
                        {header}
                        {body}
                    </table>
                </div>
                <div class="col-xs-12 text-right">
                    {pagination}
                </div>
            </div>
        }
    }

    _buildHeader() {
        if (this.props.header) {
            let headerRows = []
            if (this.props.header[0] && this.props.header[0].map) {
                this.props.header.map((hRow, rIndex) => {
                    let headerRow = []
                    hRow.map((hCell, cIndex) => {
                        headerRow.push(<th class={hCell.classes} colSpan={hCell.colSpan} width={hCell.width}
                                           key={cIndex + 1}>{hCell.title}</th>)
                    })
                    headerRows.push(<tr key={rIndex}>{headerRow}</tr>)
                })
            } else if (this.props.header[0]) {
                let headerItems = this.props.header.map((hCell, cIndex) => {
                    let sortButton = null
                    if (hCell.sortable) {
                        if (this.state.sortIndex == cIndex) {
                            sortButton = <span class="fancy-ft-text-more-muted pull-right glyphicon glyphicon-sort"
                                               onClick={e=> {
                                                   this.setState({sortReverse: !this.state.sortReverse})
                                               }}/>
                        } else {
                            sortButton = <span class="fancy-ft-text-very-muted pull-right glyphicon glyphicon-sort"
                                               onClick={e=> {
                                                   this._setSortIndex(cIndex)
                                               }}/>
                        }
                    }
                    return <th class={hCell.classes}
                               colSpan={hCell.colSpan}
                               width={hCell.width}
                               key={cIndex}>{hCell.title} {sortButton}</th>
                })
                headerRows.push(<tr key={0}>{headerItems}</tr>)
            }
            return <thead>{headerRows}</thead>
        }
        return null
    }

    _buildBody() {
        let expandable = this.props.expandable
        let body = this.props.body
        let sortFunc = this._getSortFunction()
        if (sortFunc) {
            body = body.sort(sortFunc)
            if (this.state.sortReverse) {
                body.reverse()
            }
        }
        let pageSize = (this.props.pageSize) ? this.props.pageSize : this.defPageSize
        let page = this.state.page
        let bt = pageSize * page
        let tp = pageSize * page + pageSize
        let bodyRows = []
        // count displayed rows
        let cr = 0
        body.map((row, index) => {
            if (index >= bt && index < tp) {
                let displayedRow = cr
                cr++
                let subContentButton = null
                if (expandable) {
                    if (row.childRows && row.childRows.length > 0) {
                        if (row.childRows.length > 0) {
                            if (this.state.open[displayedRow]) {
                                subContentButton = <span onClick={() => this._toggle(displayedRow)}>&nbsp;<span
                                    class="glyphicon glyphicon-chevron-down"/>&nbsp;&nbsp;</span>
                            } else {
                                subContentButton = <span onClick={() => this._toggle(displayedRow)}>&nbsp;<span
                                    class="glyphicon glyphicon-chevron-right"/>&nbsp;&nbsp;</span>
                            }
                        } else {
                            subContentButton =
                                <span>&nbsp;<span
                                    class="glyphicon glyphicon-chevron-right text-muted"/>&nbsp;&nbsp;</span>
                        }
                    }
                }
                let rowContent = row.cells.map((cell, cellIndex) => {
                    if (cell.dangerouslySetValues) {
                        return <td key={cellIndex}
                                   colSpan={cell.colSpan}
                                   class={cell.classes}
                                   width={cell.width}
                                   dangerouslySetInnerHTML={{__html: ((cellIndex == 0 && subContentButton) ? subContentButton : "") + cell.value}}
                        />
                    } else {
                        return <td key={cellIndex} colSpan={cell.colSpan}
                                   class={cell.classes}
                                   width={cell.width}>{cellIndex == 0 && subContentButton}{cell.value}</td>

                    }
                })
                bodyRows.push(<tr key={index} class={row.classes}>{rowContent}</tr>)
                if (expandable) {
                    if (row.childRows && row.childRows.length > 0) {
                        if (this.state.open[displayedRow]) {
                            row.childRows.map((childRow, crIndex) => {
                                let rowContent = childRow.cells.map((cell, cellIndex) => {
                                    if (cell.dangerouslySetValues) {
                                        return <td key={cellIndex}
                                                   colSpan={cell.colSpan}
                                                   class={cell.classes}
                                                   width={cell.width}
                                                   dangerouslySetInnerHTML={{__html: cell.value}}/>
                                    } else {
                                        return <td key={cellIndex}
                                                   colSpan={cell.colSpan}
                                                   class={cell.classes}
                                                   width={cell.width}>{cell.value}</td>
                                    }
                                })
                                bodyRows.push(<tr key={"CR" + crIndex + "R" + index }
                                                  class={childRow.classes}>{rowContent}</tr>)
                            })
                        }
                    }
                }

            }
        })
        return <tbody>{bodyRows}</tbody>
    }

    _buildPagination() {
        //number of pages to display before and after the current one.
        let toShow = 3
        let buttonsTotal = toShow * 2 + 1
        let pageSize = (this.props.pageSize) ? this.props.pageSize : this.defPageSize
        let page = this.state.page
        let size = this.props.body.length
        let pages = Math.floor(size / pageSize)
        if (page > pages) {
            this.setState({page: 0, open: this._resetExpandable()})
        }
        if (size % pageSize > 0) {
            pages++
        }
        if (pages < 2) {
            return null;
        }
        let buttons = []
        let s = page - toShow;
        let e = s + buttonsTotal;
        if (s < 0) {
            e = e - s
            s = 0
        }
        if (e > (pages)) {
            s = s - (e - pages)
            e = pages
        }
        if (s < 0) {
            s = 0
        }
        for (var i = s; i < e; i++) {
            let number = i;
            if (i == s && s != 0) {
                buttons.push(<li key={1}><a onClick={event => {
                    event.preventDefault()
                    this.setState({page: 0, open: this._resetExpandable()})
                }}> 1 </a></li>)
            } else if (i == (s + 1) && (s + 1) != 1) {
                buttons.push(<li key={2}><a onClick={event => {
                    event.preventDefault()
                    this.setState({page: page - 1, open: this._resetExpandable()})
                }}> {LBL_FT_PREV} </a></li>)
            } else if (i == e - 2 && (e - 2) != pages - 2) {
                buttons.push(<li key={pages - 1}><a onClick={event => {
                    event.preventDefault()
                    this.setState({page: page + 1, open: this._resetExpandable()})
                }}> {LBL_FT_NEXT} </a></li>)
            } else if (i == e - 1 && (e - 1) != pages - 1) {
                buttons.push(<li key={pages}><a onClick={event => {
                    event.preventDefault()
                    this.setState({page: pages - 1, open: this._resetExpandable()})
                }}> {pages} </a></li>)
            } else {
                if (i === page) {
                    buttons.push(<li key={i + 1} class="active"><a onClick={event => {
                        event.preventDefault()
                    }}>{i + 1}</a></li>)
                } else {
                    buttons.push(<li key={i + 1}><a onClick={event => {
                        event.preventDefault()
                        this.setState({page: number, open: this._resetExpandable()})
                    }}>{i + 1}</a></li>)
                }
            }
        }
        return <ul class="pagination fancy-ft-pagination ">{buttons}</ul>
    }
}

export default PagedTable;