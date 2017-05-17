import Immutable from 'immutable'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { ContentBox, ContentBoxHeader, ContentBoxParagraph } from '../Common/ContentBox'
import { WindowScroller, Table, Column, AutoSizer, SortDirection, SortIndicator} from 'react-virtualized'
import './PocketTables.css'
import axios from 'axios'

export default class PocketTabels extends PureComponent {
  static contextTypes = {
    list: PropTypes.instanceOf(Immutable.List).isRequired
  };

  constructor (props, context) {
    super(props, context)

    this.state = {
      disableHeader: false,
      headerHeight: 30,
      height: 270,
      list: Immutable.List(),
      hideIndexRow: false,
      overscanRowCount: 10,
      rowHeight: 40,
      rowCount: 1000,
      scrollToIndex: undefined,
      sortBy: 'sort_id',
      sortDirection: SortDirection.ASC,
      useDynamicRowHeight: false
    }

    this._getRowHeight = this._getRowHeight.bind(this)
    this._headerRenderer = this._headerRenderer.bind(this)
    this._noRowsRenderer = this._noRowsRenderer.bind(this)
    this._onRowCountChange = this._onRowCountChange.bind(this)
    this._onScrollToRowChange = this._onScrollToRowChange.bind(this)
    this._rowClassName = this._rowClassName.bind(this)
    this._sort = this._sort.bind(this)
  }


  componentDidMount() {
    axios.get(`http://localhost:9000/pocket`)
      .then(res => {
        const list = Immutable.List(res.data)
        console.log(list)
        this.setState({ list });
      });
  }

  render () {
    const {
      disableHeader,
      headerHeight,
      height,
      hideIndexRow,
      overscanRowCount,
      rowHeight,
      rowCount,
      scrollToIndex,
      sortBy,
      sortDirection,
      list,
      useDynamicRowHeight
    } = this.state

    // const { list } = this.context
    const sortedList = this._isSortEnabled()
      ? list
        .sortBy(item => item[sortBy])
        .update(list =>
          sortDirection === SortDirection.DESC
            ? list.reverse()
            : list
        )
      : list

    const rowGetter = ({ index }) => this._getDatum(sortedList, index)

    return (
        <div>
          <WindowScroller
            ref={this._setRef}
            scrollElement={ null}
          >
            {({ height, isScrolling, scrollTop }) => (
                <AutoSizer disableHeight>
                  {({ width }) => (
                    <Table
                      autoHeight
                      height={height}
                      isScrolling={isScrolling}
                      rowCount={list.size}
                      scrollTop={scrollTop}
                      ref='Table'
                      disableHeader={disableHeader}
                      headerClassName='headerColumn'
                      headerHeight={headerHeight}
                      noRowsRenderer={this._noRowsRenderer}
                      overscanRowCount={overscanRowCount}
                      rowClassName={this._rowClassName}
                      rowHeight={ 30 }
                      rowGetter={rowGetter}
                      scrollToIndex={scrollToIndex}
                      sort={this._sort}
                      sortBy={sortBy}
                      sortDirection={sortDirection}
                      width={width}
                    >
                      {!hideIndexRow &&
                        <Column
                          label='序号'
                          cellDataGetter={
                            ({ columnData, dataKey, rowData }) => rowData.sort_id
                          }
                          dataKey='sort_id'
                          disableSort={!this._isSortEnabled()}
                          width={60}
                        />
                      }
                      <Column
                        dataKey='created_at'
                        disableSort={!this._isSortEnabled()}
                        headerRenderer={this._headerRenderer}
                        width={90}
                      />
                      <Column
                        width={210}
                        disableSort
                        label='标题'
                        dataKey='resolved_title'
                        className='exampleColumn'
                        cellRenderer={
                          ({ cellData, columnData, dataKey, rowData, rowIndex }) => (<a href={rowData.resolved_url} target="_blank">{cellData}</a>)
                        }
                        flexGrow={1}
                      />
                    </Table>
                  )}
                </AutoSizer>
              )}
          </WindowScroller>
        </div>
    )
  }

  _getDatum (list, index) {
    return list.get(index % list.size)
  }

  _getRowHeight ({ index }) {
    const { list } = this.context

    return this._getDatum(list, index).size
  }

  _headerRenderer ({
    columnData,
    dataKey,
    disableSort,
    label,
    sortBy,
    sortDirection
  }) {
    return (
      <div>
        收录日期
        {sortBy ===dataKey &&
          <SortIndicator sortDirection={sortDirection} />
        }
      </div>
    )
  }

  _isSortEnabled () {
    const { list } = this.context
    const { rowCount } = this.state

    return rowCount <= list.size
  }

  _noRowsRenderer () {
    return (
      <div className='noRows'>
        No rows
      </div>
    )
  }

  _onRowCountChange (event) {
    const rowCount = parseInt(event.target.value, 10) || 0

    this.setState({ rowCount })
  }

  _onScrollToRowChange (event) {
    const { rowCount } = this.state
    let scrollToIndex = Math.min(rowCount - 1, parseInt(event.target.value, 10))

    if (isNaN(scrollToIndex)) {
      scrollToIndex = undefined
    }

    this.setState({ scrollToIndex })
  }

  _rowClassName ({ index }) {
    if (index < 0) {
      return 'headerRow'
    } else {
      return index % 2 === 0 ? 'evenRow' : 'oddRow'
    }
  }

  _sort ({ sortBy, sortDirection }) {
    this.setState({ sortBy, sortDirection })
  }

  _updateUseDynamicRowHeight (value) {
    this.setState({
      useDynamicRowHeight: value
    })
  }
}