import { Input, Select, DatePicker } from 'antd'
import moment from 'moment'
import './index.less'

export default {
  table: {
    dataSource: [],
    columns: [],
    rowKey: 'id',
    loading: false,
  },
  pagination: {
    pageSize: 10,
    current: 1,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '30', '40', '50'],
    showTotal: total => `共${total}条`,
    showQuickJumper: true
  },
  paginationKey: {
    size: "pageSize",
    currPage: "page",
    total: 'pagination.totalCount',
    list: 'data'
  },
  listKey: "",
}

export function handleCustomColumns (data, _this) {
  return data.map(item => {
    let Component = Input
    let width = 200

    if (item.fieldType == 'select') {
      Component = Select
    }
    if (item.fieldType == 'select-multiple') {
      Component = Select
      width = 300
    }
    if (item.fieldType == 'date') {
      Component = DatePicker
    }

    return {
      title: item.fieldName,
      dataIndex: item.customizeField,
      key: item.customizeField,
      width,
      show: true,
      render: value => {
        if (value) {
          if (item.fieldType === 'date') return moment(Number(value)).format('YYYY-MM-DD') || '--'
          if (item.fieldType === 'select') return item.fieldsContentList.find(option => option.value == value)?.label || '--'
          if (item.fieldType === 'select-multiple') {
            const values = !Array.isArray(value) && JSON.parse(value) || value

            return values.map(val => {
              return item.fieldsContentList.find(option => option.value == val)?.label
            }).join(',') || '--'
          }

          return value
        }

        return '--'
      },
      onCell: record => {
        let initialValue = record[item.customizeField] && record[item.customizeField] || undefined
        let props = {}
        const rules = []

        if (item.fieldType == 'select' || item.fieldType == 'select-multiple') {
          props.defaultOpen = true
          props.options = item.fieldsContentList || []
        }

        if (item.fieldType == 'select-multiple') {
          props.mode = 'multiple'

          if (record[item.customizeField] && record[item.customizeField]) {
            initialValue = !Array.isArray(record[item.customizeField]) && JSON.parse(record[item.customizeField]) || record[item.customizeField]
          } else {
            initialValue = []
          }
        }

        if (item.fieldType == 'date') {
          initialValue = record[item.customizeField] && record[item.customizeField] && moment(Number(record[item.customizeField])) || undefined
        }

        if (item.fieldType == 'input') rules.push({ max: 300, message: '内容长度不能超过300个字符！' })

        return {
          record,
          editable: true,
          formconfig: {
            type: item.fieldType == 'select-multiple' ? 'select' : item.fieldType,
            component: Component,
            fieldName: item.customizeField,
            props: {
              placeholder: item.fieldType == 'input' ? '请输入' : '请选择',
              ...props
            },
            rules: rules,
            initialValue,
          },
          onSave: _this.props.handleOnSave,
          handleRefresh: _this.handleRefresh
        }
      }
    }
  })
}