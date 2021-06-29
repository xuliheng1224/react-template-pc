import React, { Fragment } from 'react'
import { Button, Alert } from 'antd'
import getDefaultColumns from './defaultColumns'

export default (page) => {
  return {

    // table实例的ID，用于保存自定义列的配置数据
    id: 'CUSTOM_TABLE:aftersale_operationImport',

    // 是否自动调列表接口
    automatic: false,

    // 是否可编辑，这个属性控制table是否开启编辑功能
    editable: true,

    // 设置横向和纵向的滚动宽度
    scroll: { x: 1850, y: 600 },

    // 设置一个字段作为每一行的key
    rowKey: 'id',

    // 是否显示 ‘刷新’ 按钮
    showRefresh: false,

    // 是否显示 ‘设置行高’ 的按钮
    showLineHeight: true,

    // 是否显示 ‘设置列‘ 的按钮
    showTableConfig: true,

    // 是否显示 ’全屏‘ 的按钮
    showFullScreen: true,

    // 是否显示表格上面的滚动条
    showScroller: true,

    // 表格的默认列
    defaultColumns: getDefaultColumns,

    // 表格的自定义列
    customColumns: {
      moduleType: 1
    },

    // 设置多选或单选
    rowSelection: {
      type: 'checkbox',
      onChange: (keys, rows) => page.setState(prevState => {
        return { selectedRowKeys: keys, selectedRows: rows }
      })
    },

    // 分页参数
    paginationKey: {
      size: "pageSize",
      currPage: "page",
      total: 'pagination.totalCount',
      list: 'data'
    },

    renderTableTips: () => {
      return '提示信息'
    },

    // 获取表格数据的接口
    handleRequestData: async (params) => {
      const formData = Object.assign({}, params)
      console.log("参数", formData);
      const data = []
      for (let i = 1; i <= 100; i++) {
        data.push({
          id: i,
          importTime: '2021-6-27 18:00:00',
          importTotal: i * 10,
          successNum: i * 8,
          failedNum: i * 2,
          createUserName: '许立恒',
          importStatusName: '成功或失败',
          type: i % 2,
          active: i * 2
        })
      }
      return {
        data,
        pagination: {
          page: 1,
          pageCount: 1,
          pageSize: 10,
          totalCount: 100
        }
      }
    },

    handleOnSave: async (rows, handleRefresh) => {
      console.log('rows', rows);
      handleRefresh()
      // http({
      //   method: 'POST',
      //   url: '/api/customizefields/fields/setValue',
      //   data: {
      //     type: 2,
      //     businessId: values.id,
      //     ...values
      //   }
      // }).finally(() => {
      // _this.tableRef.current.handleRefresh()
      // })
    },

    // 表格上面的操作按钮
    renderOperation: () => {
      return (
        <Fragment>
          <Button type='primary' icon="import" onClick={page.handleOnDownload} style={{ marginLeft: '10px' }}>导入</Button>
        </Fragment>
      )
    },

    // 表格选中的按钮
    renderBatchOperation: () => {
      const { selectedRowKeys, selectedRows } = page.state;
      return (
        <Fragment>
          <Button type='primary' onClick={() => page.distribution(selectedRowKeys, selectedRows)} style={{ marginLeft: '10px' }}>批量分配</Button>
          <Button type='primary' onClick={() => page.examine(selectedRowKeys, selectedRows)} style={{ marginLeft: '10px' }}>批量审核</Button>
        </Fragment>
      )
    }
  }
}
