import React, { Component } from 'react'
import { Table, Tooltip, Icon, Divider, Dropdown, Menu, Slider } from 'antd'
import Router from 'umi/router'
import withRouter from 'umi/withRouter'
import { EditableFormRow, EditableCell } from './@components/EditableTable'
import SettingTableCol from './@components/SettingTableCol'
import TableConfig, { handleCustomColumns } from './config'
import './index.less'
import { getCustomColumns, getDtaList } from './service'

const { table, pagination, paginationKey } = TableConfig

@withRouter
export default class CustomTable extends Component {
  settingTableRef = React.createRef()

  state = {
    tableSize: 'default',
    isFullScreen: false,
    selectedRowKeys: [],
    scrollWidth: 0,
    scrollValue: 0,
    // isScroll: true,
    defaultColumns: this.props.defaultColumns || [],
    customColumns: [],

    tableState: {
      dataSource: table.dataSource,
      columns: table.columns,
      rowKey: this.props.rowKey || table.rowKey,
      loading: table.loading,
      onRow: this.props.onRow || (() => { }),
      scroll: this.props.scroll,
      components: this.props.editable ? { body: { row: EditableFormRow, cell: EditableCell } } : undefined,
      expandedRowRender: typeof this.props.expandedRowRender === 'function' ? this.props.expandedRowRender : undefined
    },

    rowSelection: this.props.rowSelection && {
      ...this.props.rowSelection,
      selectedRowKeys: [],
      onChange: (selectedRowKeys, selectedRows) => { this.handleOnTableSelectionChange(selectedRowKeys, selectedRows) }
    },

    pagination: {
      pageSize: pagination.pageSize,
      current: pagination.current,
      total: pagination.total,
      showSizeChanger: pagination.showSizeChanger,
      pageSizeOptions: pagination.pageSizeOptions,
      showQuickJumper: pagination.showQuickJumper,
      showTotal: pagination.showTotal,
      onChange: (page, a, b) => { this.handleOnPageNoChange(page, a, b) },
      onShowSizeChange: (current, size, a, b) => { this.handleOnPageSizeChange(current, size, a, b) }
    },
  }

  // table ?????????????????????????????????
  handleOnTableSelectionChange = (selectedRowKeys, selectedRows) => {
    this.setState(prevState => {
      const { rowSelection } = prevState

      rowSelection.selectedRowKeys = selectedRowKeys

      return { rowSelection, selectedRowKeys }
    })

    if (typeof this.props.rowSelection.onChange === 'function') this.props.rowSelection.onChange(selectedRowKeys, selectedRows)
  }

  // ????????????
  handleOnPageNoChange = (page) => {
    if (this.state.pagination.current == page) return

    if (this.props.keepalive !== false) {
      const { pathname, query } = this.props.location

      query.page = String(page)
      Router.replace({ pathname, query })
    }

    this.setState(prevState => {
      const { pagination } = prevState

      pagination.current = page

      return { pagination }
    }, () => {
      this.handleGetPaginationInfo(true)
    })
  }

  // pageSize??????
  handleOnPageSizeChange = (current, size) => {
    if (this.props.keepalive !== false) {
      const { pathname, query } = this.props.location

      query.pageSize = String(size)
      Router.replace({ pathname, query })
    }

    this.setState(prevState => {
      const { pagination } = prevState

      pagination.current = current
      pagination.pageSize = size

      return { pagination }
    }, () => {
      this.handleGetPaginationInfo(true)
    })
  }

  // ????????????
  handleOnChangeLineHeight = (tableSize) => {
    this.setState({ tableSize })
  }

  // ??????????????????
  handleSetTableCol = () => {
    const { defaultColumns, customColumns } = this.state
    const { columns } = this.state.tableState

    this.settingTableRef.current.show({ columns, defaultColumns, customColumns })
  }

  //??????fullscreenchange??????
  watchFullScreen = () => {
    document.addEventListener('fullscreenchange', (e) => {
      this.setState({ isFullScreen: document.fullscreenElement ? true : false })
    }, false)
  }

  // ??????
  handleChangeFullScreen = () => {
    if (!this.state.isFullScreen) {
      this.inFullScreen()
    } else {
      this.outFullScreen()
    }
  }

  // ??????????????????
  inFullScreen = () => {
    var de = document.documentElement

    if (de.requestFullscreen) {
      de.requestFullscreen()
    } else if (de.mozRequestFullScreen) {
      de.mozRequestFullScreen()
    } else if (de.webkitRequestFullScreen) {
      de.webkitRequestFullScreen()
    }
  }

  // ??????????????????
  outFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen()
    }
  }

  // table loading
  handleOnTableLoading = () => {
    this.setState(prevState => {
      const { tableState } = prevState

      tableState.loading = true
      tableState.dataSource = []

      return { tableState }
    })
  }

  // ??????????????????
  getPaginationParams = () => {
    const pagiantionParams = {}

    if (this.props.pagination !== false) {
      const { size, currPage, offset } = this.props.paginationKey

      // ???????????????
      pagiantionParams[size] = this.state.pagination.pageSize
      // ???????????????????????????
      if (currPage) {
        pagiantionParams[currPage] = this.state.pagination.current
      }
      // ??????offset???????????????
      if (offset) {
        pagiantionParams[offset] = (this.state.pagination.current - 1) * this.state.pagination.pageSize
      }
    }

    return pagiantionParams
  }

  // ???????????????????????????????????????????????? ????????????????????????????????????
  getPathedData = (dataSource, path) => {
    let retVal = dataSource
    const elements = path.split('.')

    for (var i = 0; i < elements.length; i++) {
      if (!retVal[elements[i]]) return

      retVal = retVal[elements[i]]
    }

    return retVal
  }

  // ????????????
  handleGetPaginationInfo = (isPage) => {
    // ??????loading
    this.handleOnTableLoading()

    // ??????????????????
    const params = this.getPaginationParams()

    const formData = this.props.handleRequestData ? this.props.handleRequestData(this.props.formData) : this.props.formData

    setTimeout(() => {
      return getDtaList({ ...formData, ...params }).then(res => {

        console.log('??????????????????', res);

        const total = this.getPathedData(res, this.props.paginationKey.total || paginationKey.total)
        const list = this.getPathedData(res, this.props.paginationKey.list || paginationKey.list)

        this.setState(prevState => {
          prevState.tableState.loading = false

          if (prevState.rowSelection) {
            // ??????????????????
            if (!isPage) {
              prevState.rowSelection.selectedRowKeys = []
              prevState.selectedRowKeys = []
            }
          }

          if (list) {
            // ??????????????????
            prevState.tableState.dataSource = list
            prevState.pagination.total = total || 0
          } else {
            // ?????????????????????
            prevState.tableState.dataSource = []
          }

          return prevState
        }, () => {
          if (this.props.showScroller) {
            this.calcTableScrollWidth() // ??????????????????
          }
        })
      }).catch(() => {
        this.setState(prevState => {
          prevState.tableState.loading = false
        })
      })
    }, 1500)
  }

  // ?????????????????????
  handleOnReset = () => {
    this.setState(prevState => {
      prevState.tableState.dataSource = []
      prevState.pagination.total = 0

      if (prevState.rowSelection) {
        prevState.rowSelection.selectedRowKeys = []
        prevState.selectedRowKeys = []
      }

      return prevState
    })
  }


  // ????????????????????????????????????
  handleRefresh = () => {
    this.handleGetPaginationInfo()
  }

  // ???????????????
  async getCustomColumns () {
    const { customColumns } = this.props

    if (customColumns && customColumns.moduleType) {
      const res = await getCustomColumns(customColumns)
      const data = (Array.isArray(res.data) && handleCustomColumns(res.data, this)) || []
      this.setState({ customColumns: data }, () => {
        this.initTableConfig()
      })
    } else if (Array.isArray(customColumns)) {
      this.setState({ customColumns }, () => {
        this.initTableConfig()
      })
    } else {
      this.setState({ customColumns: [] }, () => {
        this.initTableConfig()
      })
    }
  }

  // ???url??????????????????pageSize????????????
  initCurrentPage = () => {
    const { page, pageSize } = this.props.location.query

    this.setState(prevState => {
      if (page) prevState.pagination.current = Number(page)
      if (pageSize) prevState.pagination.pageSize = Number(pageSize)

      return { ...prevState }
    })
  }

  // ??????table???????????????
  calcTableScrollWidth () {
    const scrollWidth = this.tableHeader.scrollWidth
    const clientWidth = this.tableHeader.clientWidth
    const scroll = Math.floor(scrollWidth - clientWidth)
    this.setState({ scrollWidth: scroll })
  }

  // slider??????????????????table???????????????
  handleOnSliderChange = (value) => {
    this.tableHeader.scrollTo(value, this.tableHeader.scrollTop)
    this.tableBody.scrollTo(value, this.tableBody.scrollTop)
  }

  // ??????????????????size????????????????????????table???????????????
  watchWindowResize () {
    window.addEventListener('resize', (e) => {
      this.calcTableScrollWidth()
    }, false)
  }

  // ??????table???????????????????????????slider??????
  watchTableScroll () {
    this.tableHeader.addEventListener('scroll', () => {
      this.setState({ scrollValue: this.tableHeader.scrollLeft })
    })
  }

  // ?????????????????? - ??????localStorage???key
  getStorageKey () {
    const tableId = this.props.id
    const str = localStorage.getItem('currentUser')

    if (str && str != 'null' && str != 'undefined') {
      const user = JSON.parse(str)

      return `${user.username}:${tableId}`
    }

    return tableId
  }

  // ?????????????????? - ????????????
  handleGetSelectedList () {
    const key = this.getStorageKey()
    const str = localStorage.getItem(key)

    if (str && str != 'null' && str != 'undefined') {
      const selectedList = JSON.parse(str)

      return Array.isArray(selectedList) && selectedList || []
    } else {
      return []
    }
  }

  // ????????? table????????????
  initTableConfig = () => {
    const { defaultColumns, customColumns } = this.state
    const selectedColumns = this.handleGetSelectedList()
    if (Array.isArray(defaultColumns) && Array.isArray(customColumns)) {
      let columns = []

      // ???????????????????????????????????????????????????????????????????????????
      if (selectedColumns.length > 0) {
        const all = [...defaultColumns, ...customColumns]

        selectedColumns.forEach(item => {
          all.forEach(item2 => {
            if (item2.dataIndex == item || item2.key == item) {
              item2.show = true
              item2.selected = true
              columns.push(item2)
            } else if (!item2.selected) {
              item2.show = false
            }
          })
        })
      } else {
        // ??????????????????fixed??????
        const columns1 = defaultColumns.filter(item => item.show && !item.fixed)
        const fixedLeftColumns = defaultColumns.filter(item => item.show && item.fixed == 'left')
        const fixedRightColumns = defaultColumns.filter(item => item.show && item.fixed == 'right')
        const columns2 = customColumns.filter(item => item.show)

        columns = [...fixedLeftColumns, ...columns1, ...columns2, ...fixedRightColumns]
      }
      const x = columns.reduce((x, item) => {
        if (item.width) return x + item.width

        return x
      }, 0)
      this.setState(prevState => {
        prevState.tableState.columns = columns

        if (x) {
          prevState.tableState.scroll.x = x < 1000 ? 1000 : x
        }

        return prevState
      })
    }
  }

  // ?????????
  handleOnTableColChange = (columns) => {
    const columns1 = columns.filter(item => !item.fixed)
    const fixedLeftColumns = columns.filter(item => item.fixed == 'left')
    const fixedRightColumns = columns.filter(item => item.fixed == 'right')
    const columns3 = [...fixedLeftColumns, ...columns1, ...fixedRightColumns]
    const x = columns3.reduce((x, item) => {
      if (item.width) return x + item.width

      return x
    }, 0)


    this.setState(prevState => {
      prevState.tableState.columns = columns3

      if (x) {
        prevState.tableState.scroll.x = x < 1000 ? 1000 : x
      }

      return prevState
    }, () => {
      this.calcTableScrollWidth()
    })
  }

  componentDidMount () {
    this.tableHeader = document.querySelector('#custom-table .ant-table-content .ant-table-scroll .ant-table-header')
    this.tableBody = document.querySelector('#custom-table .ant-table-content .ant-table-scroll .ant-table-body')

    const { page, pageSize } = this.props.location.query

    this.getCustomColumns()

    if (this.props.automatic !== false) {
      this.handleGetPaginationInfo()
    } else {
      if (page || pageSize) {
        this.initCurrentPage()
      }
    }

    this.watchFullScreen()

    if (this.props.showScroller) {
      this.watchWindowResize()
      this.watchTableScroll()
    }
  }

  componentWillUnmount () {
    window.removeEventListener('resize', () => { })
    document.removeEventListener('fullscreenchange', () => { })
    this.tableHeader.removeEventListener('scroll', () => { })
  }

  render () {
    const { tableSize, isFullScreen, selectedRowKeys, scrollWidth, scrollValue } = this.state
    const { showOperateBar, showRefresh, showLineHeight, showTableConfig, showFullScreen, showScroller, location, id } = this.props
    const pagination = this.props.pagination === false ? false : this.state.pagination
    const tableTips = typeof this.props.renderTableTips === 'function' ? this.props.renderTableTips() : null
    const operation = typeof this.props.renderOperation === 'function' ? this.props.renderOperation() : null
    const batchOperation = typeof this.props.renderBatchOperation === 'function' ? this.props.renderBatchOperation() : null
    const menus = (
      <Menu>
        <Menu.Item onClick={() => this.handleOnChangeLineHeight('default')} style={{ padding: '5px 25px' }}>??????</Menu.Item>
        <Menu.Item onClick={() => this.handleOnChangeLineHeight('middle')} style={{ padding: '5px 25px' }}>??????</Menu.Item>
        <Menu.Item onClick={() => this.handleOnChangeLineHeight('small')} style={{ padding: '5px 25px' }}>??????</Menu.Item>
      </Menu>
    )
    this.state.tableState.rowSelection = this.state.rowSelection

    return (
      <div className='custom-table-container'>
        {
          <div className='custom-table-tips-bar'>
            {tableTips}
          </div>
        }
        {
          showOperateBar === false ? null : (
            <div className='custom-table-operate-bar'>
              {operation}

              {
                operation && (showRefresh || showLineHeight || showTableConfig || showFullScreen) ? (<Divider type="vertical" className='divider' />) : null
              }

              {
                showRefresh ? (
                  <Tooltip title='??????'>
                    <Icon type="reload" className='icon-button' onClick={this.handleGetPaginationInfo} />
                  </Tooltip>
                ) : null
              }

              {
                showLineHeight ? (
                  <Dropdown overlay={menus} trigger={['click']} placement="bottomCenter">
                    <Tooltip title='????????????'>
                      <Icon type="line-height" className='icon-button' />
                    </Tooltip>
                  </Dropdown>
                ) : null
              }

              {
                showTableConfig ? (
                  <Tooltip title='?????????????????????'>
                    <Icon type="setting" className='icon-button' onClick={this.handleSetTableCol} />
                  </Tooltip>
                ) : null
              }

              {
                showFullScreen ? (
                  <Tooltip title={isFullScreen ? '????????????' : '??????'}>
                    <Icon type={isFullScreen ? 'fullscreen-exit' : 'fullscreen'} className='icon-button' onClick={this.handleChangeFullScreen} />
                  </Tooltip>
                ) : null
              }

            </div>
          )
        }

        {
          showScroller ? (
            <div className='custom-table-scroll-bar'>
              <Slider className='custom-table-slider' value={scrollValue} tipFormatter={() => '???????????????????????????????????????'} max={scrollWidth} onChange={this.handleOnSliderChange} />
            </div>
          ) : null
        }

        <Table id='custom-table' size={tableSize} {...this.state.tableState} pagination={pagination} />

        {
          selectedRowKeys.length > 0 ? (
            <div className='custom-table-batch-operate-bar'>
              <div className='total-count'>????????? <a>{selectedRowKeys.length}</a> ???</div>

              <div className='buttons'>
                {batchOperation}
              </div>
            </div>
          ) : null
        }

        <SettingTableCol ref={this.settingTableRef} onChange={this.handleOnTableColChange} id={id} location={location} />
      </div>
    )
  }
}
