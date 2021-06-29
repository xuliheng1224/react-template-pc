import React, { Component } from 'react'
import { Form, Select, Tooltip } from 'antd'
import './index.less'

const EditableContext = React.createContext()
const EditableRow = ({ form, index, ...props }) => {
  return (
    <EditableContext.Provider value={form}>
      <tr {...props} />
    </EditableContext.Provider>
  )
}
const EditableFormRow = Form.create()(EditableRow)

class EditableCell extends Component {
  state = {
    editing: false,
  }

  toggleEdit = () => {
    const editing = !this.state.editing

    this.setState({ editing }, () => {
      if (editing) {
        this.formItem.focus()

        if (this.props.formconfig.type === 'cascader') {
          this.formItem.input.input.click()
        }

        if (this.props.formconfig.type === 'date') {
          this.formItem.picker.input.click()
        }
      }
    })
  }

  save = e => {
    const { record, onSave, formconfig, handleRefresh } = this.props

    this.form.validateFields((error, values) => {
      if (error && error[formconfig.fieldName]) return

      if (typeof onSave === 'function') {
        if (formconfig.type === 'cascader') {
          record[formconfig.fieldName] = values[formconfig.fieldName]
          record[formconfig.labelName] = this.formItem.getLabel().split(' / ').join(',')

          // onSave(record, handleGetPaginationInfo)
        } else if (formconfig.type === 'date') {
          record[formconfig.fieldName] = values[formconfig.fieldName] && JSON.stringify(new Date(values[formconfig.fieldName]).getTime()) || ''

          // onSave(record, handleGetPaginationInfo)
        } else if (formconfig.type === 'select') {
          if (Array.isArray(values[formconfig.fieldName])) {
            record[formconfig.fieldName] = JSON.stringify(values[formconfig.fieldName])
          } else {
            record[formconfig.fieldName] = values[formconfig.fieldName]
          }

          // onSave(record, handleGetPaginationInfo)
        } else {
          record[formconfig.fieldName] = values[formconfig.fieldName]
        }
        onSave(record, handleRefresh)
      }


      this.toggleEdit()
    })
  }

  // 异步save
  asyncSave = () => {
    this.saveTimeout = setTimeout(() => {
      this.save()
      clearTimeout(this.saveTimeout)
    }, 0)
  }

  // 级联选择框的弹层显示/隐藏时
  handleCascaderPopupVisibleChange = visible => {
    if (!visible) this.asyncSave()
  }

  // 日期选择框的弹层显示/隐藏时
  handleDatePopupVisibleChange = visible => {
    if (!visible) this.asyncSave()
  }

  renderCell = form => {
    const { children, formconfig } = this.props
    const { fieldName, initialValue, props, rules, instance, component, type } = formconfig
    const Formitemcomponent = instance || component

    this.form = form

    const formItem = (
      <Form.Item style={{ margin: 0 }}>
        {
          (!type || type == 'input' || type == 'number') && form.getFieldDecorator(fieldName, { rules, initialValue })(
            <Formitemcomponent ref={node => (this.formItem = node)} {...props} onPressEnter={this.save} onBlur={this.save} style={{ width: '100%' }} />
          )
        }

        {
          type == 'select' && form.getFieldDecorator(fieldName, { rules, initialValue })(
            <Formitemcomponent ref={node => (this.formItem = node)} {...props} onBlur={this.save} style={{ width: '100%' }}>
              {
                props.options.map(item => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.label}
                  </Select.Option>
                ))
              }
            </Formitemcomponent>
          )
        }

        {
          type == 'cascader' && form.getFieldDecorator(fieldName, { rules, initialValue })(
            <Formitemcomponent ref={node => (this.formItem = node)} {...props} onPopupVisibleChange={this.handleCascaderPopupVisibleChange} style={{ width: '100%' }} />
          )
        }

        {
          type == 'date' && form.getFieldDecorator(fieldName, { rules, initialValue })(
            <Formitemcomponent ref={node => (this.formItem = node)} {...props} onOpenChange={this.handleDatePopupVisibleChange} style={{ width: '100%' }} />
          )
        }
      </Form.Item>
    )

    let placement = 'topLeft'

    if (children && children[2] && children[2].length <= 5) {
      placement = 'top'
    }

    const childNode = (
      <span
        className="editable-cell-value-wrap"
        onClick={this.toggleEdit}
      >
        {
          children && children[2] == '--' ? children : <Tooltip title={children || ''} placement={placement}>{children || ''}</Tooltip>
        }
      </span>
    )
    return this.state.editing ? formItem : childNode
  }

  render () {
    const { editable, record, index, onSave, children, formconfig, ...restProps } = this.props

    return (
      <td {...restProps} >
        {
          editable ? <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer> : children
        }
      </td>
    )
  }
}

export {
  EditableFormRow,
  EditableCell
}