import PropTypes from 'prop-types'

export const propTypes = {
  formConfig: PropTypes.array,
  colNum: PropTypes.number.isRequired,
  handleSearch: PropTypes.func,
  // handleReset: PropTypes.func,
  formItemLayout: PropTypes.object,
}

export function handleCustomFormConfig (data) {
  return data.map(item => {
    let type = 'Input'
    let action = '输入'
    const props = { allowClear: true }

    if (item.fieldType == 'date') {
      type = 'DatePicker'
      action = '选择'
    }

    if (item.fieldType.includes('select')) {
      type = 'Select'
      action = '选择'
      props.options = item.fieldsContentList

      if (item.fieldType == 'select-multiple') props.mode = 'multiple'
    }

    props.placeholder = `请${action}${item.fieldName}`

    return {
      type,
      label: item.fieldName,
      fieldName: item.customizeField,
      props,
    }
  })
}
