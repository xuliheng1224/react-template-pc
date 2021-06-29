import React from 'react'
import { CustomPage } from '@/components'
import getFormConfig from './@config/form'
import getTableConfig from './@config/table'


export default class BasicPage extends CustomPage {

  state = {
    selectedRowKeys: [],
    selectedRows: []
  }

  handleOnDownload = () => {
    console.log('导入')
  }

  distribution = (selectedRowKeys, selectedRows) => {
    console.log('批量分配', selectedRowKeys, selectedRows)
  }

  examine = (selectedRowKeys, selectedRows) => {
    console.log('批量审核', selectedRowKeys, selectedRows)
  }

  render () {
    const { location } = this.props
    return <CustomPage location={location} getFormConfig={getFormConfig} getTableConfig={getTableConfig(this)} />
  }
}
