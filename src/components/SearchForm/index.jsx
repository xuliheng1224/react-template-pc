import React, { Component } from 'react'
import { Button, Form, Row, Col, Radio, Tooltip, Icon, Dropdown, Menu, Select, Input, DatePicker, Switch } from 'antd'
import Router from 'umi/router'
import moment from 'moment'
import { propTypes, handleCustomFormConfig } from './config'
import FormItemGroup from './@components/FormItemGroup'
import SettingFormConfig from './@components/SettingFormConfig'
import './index.less'
import { getCustomFormConfig } from './service'

const { RangePicker } = DatePicker

/** FormConfig中的type
 *
 * Group: 表单组
 * Custom: 自定义表单组件
 * Input: antd的 Input 组件
 * Select: antd的 Select 组件
 * DatePicker: antd的 DatePicker 组件
 * RangePicker: antd的 RangePicker 组件
 *
 */

class SearchForm extends Component {
  static propTypes = propTypes
  setFormConfigRef = React.createRef()

  state = {
    showAllConditions: false,
    accurateSearch: false,
    colNum: this.props.colNum || 3,
    selectedKeys: ['auto'],
    autoLayout: true,
    defaultFormConfig: this.props.formConfig || [],
    customFormConfig: [],
    allFormConfig: this.props.formConfig || []
  }

  formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 17 },
    },
  }

  // 展开 / 收起
  handleOnShowMoreCondition = () => {
    this.setState({ showAllConditions: !this.state.showAllConditions }, () => {
      const { pathname, query } = this.props.location

      query.collapse = this.state.showAllConditions
      Router.replace({ pathname, query })
    })
  }

  // 设置列
  handleOnChangeCol = (item) => {
    if (item.key !== 'auto') {
      this.setState({ colNum: Number(item.key), selectedKeys: item.keyPath, autoLayout: false })
      return
    }

    this.setState({ selectedKeys: item.keyPath, autoLayout: true }, () => {
      const container = document.querySelector('#search-form-container')

      this.autoLayout(container.clientWidth)
    })
  }

  // 开启/关闭精准搜索
  handleOnSearchTypeChange = checked => {
    this.setState({ accurateSearch: checked }, () => {
      if (checked) {
        sessionStorage.removeItem(this.getStorageKey())
        this.props.form.resetFields()
      } else {
        this.handleReset()
      }

      if (typeof this.props.onAccurateSearch == 'function') this.props.onAccurateSearch(checked)
    })
  }

  // 获取表单值
  getFieldsValue = (cb) => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        cb(values)
      }
    })
  }
  // 设置表单值
  setFieldsValue = (kv) => {
    this.props.form.setFieldsValue(kv)
  }

  // 动态布局
  autoLayout = (width) => {
    if (this.state.autoLayout) {
      if (width >= 1500) {
        this.setState({ colNum: 6 })
      } else if (width >= 1200 && width < 1500) {
        this.setState({ colNum: 4 })
      } else if (width >= 900 && width < 1200) {
        this.setState({ colNum: 3 })
      } else if (width >= 700 && width < 900) {
        this.setState({ colNum: 2 })
      } else if (width < 700) {
        this.setState({ colNum: 1 })
      }
    }
  }

  // watch窗口的宽度变化
  watchWindowResize = () => {
    const container = document.querySelector('#search-form-container')

    window.onresize = (e) => {
      this.autoLayout(container.clientWidth)
    }
  }

  // 搜索
  handleSearch = (e, search, isRest) => {
    if (e) e.preventDefault()

    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { defaultFormConfig, customFormConfig } = this.state
        const allConfig = [...defaultFormConfig, ...customFormConfig]
        const copyValues = JSON.parse(JSON.stringify(values))
        const { externalParams } = this.props
        const formData = Object.assign({}, externalParams, copyValues)

        // 在提交时统一对表单数据做处理
        allConfig.forEach(config => {
          const val = formData[config.fieldName]

          // 处理多选框的值
          if (config.type == 'Select' && Array.isArray(val)) {
            formData[config.fieldName] = val.join(',')
          }

          // 处理日期的值
          if (config.type == 'DatePicker' && val) {
            formData[config.fieldName] = moment(val).format('YYYY-MM-DD')
          }

          // 处理日期范围的值
          if (config.type == 'RangePicker' && Array.isArray(val)) {
            const fieldNames = Array.isArray(config.fieldNames) && config.fieldNames || []

            if (fieldNames[0] && val[0]) formData[fieldNames[0]] = moment(val[0]).format('YYYY-MM-DD')
            if (fieldNames[1] && val[1]) formData[fieldNames[1]] = moment(val[1]).format('YYYY-MM-DD')

            if (fieldNames[0] && fieldNames[1]) {
              delete formData[config.fieldName]
            } else {
              formData[config.fieldName] = val.map(item => moment(item).format('YYYY-MM-DD')).join(',')
            }
          }

          if (this.props.notKeepInitialValue && isRest && (config.initialValue || config.initialValue === 0)) {
            this.props.form.setFieldsValue({
              [config.fieldName]: undefined
            })
          }
        })

        if (this.props.handleSearch) {
          if (search) {
            // 重置时是否清空默认值
            this.props.handleSearch(this.props.notKeepInitialValue && isRest ? {} : formData)
            // 是否保留表单筛选
            if (this.props.keepalive) {
              this.saveFormValues()
            }
          } else {
            this.props.handleSearch(formData)
          }
        }
      }
    })
  }
  // 重置
  handleReset = (e, reset) => {
    const storageKey = this.getStorageKey()

    sessionStorage.removeItem(storageKey)
    this.props.form.resetFields()

    if (reset) return this.handleSearch(e, true, true)

    this.handleSearch(e)
  }

  // 创建表单项
  createFieldDecorator = (config) => {
    const { form } = this.props
    const { getFieldDecorator } = form
    const width = config.props?.style?.width || '100%'

    let component = config.component && <config.component {...config.props} form={form} style={{ width: width }} />
    let FormItem = config.instance || component

    if (config.type) {
      if (config.type == 'Input') {
        FormItem = <Input {...config.props} style={{ width: width }} placeholder={`请输入${config.label}`} />

      } else if (config.type == 'Radio') {
        const { component: Component = Radio } = config
        const { options = [], immediateSearch = false, ...props } = config.props
        FormItem = <Radio.Group {...props} onChange={(e) => {
          // 是否开启即时查询
          if (immediateSearch) {
            let timeout = null
            timeout = setTimeout(() => {
              this.handleSearch()
              clearTimeout(timeout)
            }, 10)
          }
        }}>
          {options.map(item => <Component value={item.value}>{item.label}</Component>)}
        </Radio.Group>

      } else if (config.type == 'Select') {
        FormItem = (
          <Select {...config.props} style={{ width: width }} placeholder={`请选择${config.label}`}>
            {
              config.props.options.map(item => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              ))
            }
          </Select>
        )

      } else if (config.type == 'DatePicker') {
        FormItem = <DatePicker {...config.props} style={{ width: width }} />

      } else if (config.type == 'RangePicker') {
        FormItem = <RangePicker {...config.props} style={{ width: width }} />
      }
    }

    if (config.fieldName) {
      return getFieldDecorator(config.fieldName, {
        rules: config.rules,
        initialValue: config.initialValue || undefined,
        normalize: config.normalize || undefined
      })(FormItem)
    } else {
      return FormItem
    }
  }

  // 创建表单组
  createGroupItem = (config) => {
    return <FormItemGroup config={config} createFieldDecorator={this.createFieldDecorator} />
  }

  // 表单的布局
  createFormItem = (config, i, span) => {
    const spanSize = Math.floor(24 / (this.state.colNum || 1))
    const formItemLayout = config.formItemLayout || this.props.formItemLayout || this.formItemLayout

    formItemLayout.labelCol.sm.span = this.state.colNum > 1 ? 8 : 5
    formItemLayout.wrapperCol.sm.span = this.state.colNum > 1 ? 16 : 19

    if (config.hidden) return null

    return (
      <Col span={span || config.span || spanSize} key={i}>
        {
          config.type === 'Group' ? (
            <Form.Item>
              {
                this.createGroupItem(config)
              }
            </Form.Item>
          ) : (
            <Form.Item {...formItemLayout} label={config.label}>
              {
                this.createFieldDecorator(config)
              }

              {
                config.belowTips ? <div style={{ lineHeight: '150%', padding: '5px 0px', color: '#999' }}>{config.belowTips}</div> : null
              }
            </Form.Item>
          )
        }
      </Col>
    )
  }

  // 获取保存表单的值的key，用户名+form表单实例id
  getStorageKey () {
    const formId = this.props.id
    const str = localStorage.getItem('currentUser')

    if (str && str != 'null' && str != 'undefined') {
      const user = JSON.parse(str)

      return `${user.username}:${formId}`
    }

    return formId
  }

  // 保存表单的值
  saveFormValues = () => {
    this.getFieldsValue((values) => {
      const { noSaveFields, externalParams } = this.props
      const data = Object.assign({}, externalParams, values)
      const storageKey = this.getStorageKey()
      if (Array.isArray(noSaveFields)) {
        noSaveFields.forEach(key => {
          delete data[key]
        })
      }

      sessionStorage.setItem(storageKey, JSON.stringify(data))
    })
  }
  // 恢复表单的值
  resumeFormValues = callback => {
    const { noSaveFields } = this.props
    const { defaultFormConfig, customFormConfig } = this.state
    const storageKey = this.getStorageKey()
    const str = sessionStorage.getItem(storageKey)
    const values = str && str !== 'undefined' && str !== 'null' ? JSON.parse(str) : {}

    if (Array.isArray(noSaveFields)) {
      noSaveFields.forEach(key => {
        delete values[key]
      })
    }

    [...defaultFormConfig, ...customFormConfig].forEach(config => {
      if (config.type === 'RangePicker' && values[config.fieldName] && values[config.fieldName].length) {
        values[config.fieldName] = [moment(values[config.fieldName][0]), moment(values[config.fieldName][1])]
      } else if (config.type === 'DatePicker' && values[config.fieldName]) {
        values[config.fieldName] = moment(values[config.fieldName])
      }
    })

    this.props.form.setFieldsValue(values, callback)
  }

  // 恢复 展开/收起 的状态
  resumeCollapseState = () => {
    const { query } = this.props.location

    if (query.collapse) {
      const showAllConditions = JSON.parse(query.collapse)

      this.setState({ showAllConditions })
    }
  }

  // 获取动态查询条件
  async getCustomFormConfig () {
    const { formConfig, customFormConfig } = this.props
    const res = await getCustomFormConfig(customFormConfig)
    const data = (Array.isArray(res.data) && handleCustomFormConfig(res.data, this)) || [] // 把获取到的配置数据转成表单的配置数据
    const allFormConfig = [...formConfig, ...data]

    this.setState({ customFormConfig: data, allFormConfig }, () => {
      // 获取动态条件后，如果开启了记录查询条件的值，就恢复查询条件的值，恢复后再查询列表数据
      if (this.props.keepalive) {
        let timeout = null

        this.resumeFormValues(() => {
          timeout = setTimeout(() => {
            this.handleSearch()
            clearTimeout(timeout)
          }, 10)
        })
      }
    })
  }

  // 配置查询条件
  handleOnSetFormConfig = () => {
    const { allFormConfig, defaultFormConfig, customFormConfig } = this.state

    this.setFormConfigRef.current.show({ allFormConfig, defaultFormConfig, customFormConfig })
  }
  // form的配置改变时
  handleOnFormConfigChange = allFormConfig => {
    this.setState({ allFormConfig })
  }

  componentDidMount () {
    const container = document.querySelector('#search-form-container')
    const { customFormConfig } = this.props
    let timeout = null

    this.autoLayout(container.clientWidth)
    this.watchWindowResize()
    this.resumeCollapseState()

    // 如果传了动态查询条件的模块type，就调接口获取动态查询条件
    if (customFormConfig && customFormConfig.moduleType) this.getCustomFormConfig()

    // 1. 如果开启了记录查询条件的值，并且不需要调接口获取动态查询条件时，就恢复查询条件的值，恢复后查询列表数据，
    //    如果需要调接口获取动态查询条件，就先获取动态查询条件，然后再判断是否需要恢复查询条件的值，如果需要恢复，就恢复后再查询列表数据
    // 2. 如果没有开启记录查询条件的值，就直接查询列表数据
    if (this.props.keepalive) {
      if (!customFormConfig || !customFormConfig.moduleType) {
        this.resumeFormValues(() => {
          timeout = setTimeout(() => {
            this.handleSearch()
            clearTimeout(timeout)
          }, 10)
        })
      }
    } else {
      // 搜索的动作放在timeout中是为了在使用SearchForm的父组件didMount之后再执行，否则可能拿不到CustomTable组件的实例
      timeout = setTimeout(() => {
        this.handleSearch()
        clearTimeout(timeout)
      }, 10)
    }
  }

  render () {
    const { id, location, loading, accurateFormConfig, showFormConfig, showSetCol } = this.props
    const { colNum, showAllConditions, accurateSearch, allFormConfig } = this.state
    const oneSize = Math.floor(24 / (colNum || 1))
    let spanSize = 24
    const formConfig = accurateSearch ? accurateFormConfig.filter(v => v) : allFormConfig.filter(v => v)
    if (showAllConditions) {
      const remainder = formConfig.length % (colNum || 1)

      if (remainder === 0) {
        spanSize = 24
      } else {
        spanSize = (colNum - remainder) * oneSize
      }
    } else {
      if (formConfig.length >= (colNum - 1)) {
        spanSize = Math.floor(24 / (colNum || 1))
      } else {
        spanSize = (colNum - formConfig.length) * oneSize
      }
    }

    const menus = (
      <Menu onClick={this.handleOnChangeCol} selectedKeys={this.state.selectedKeys}>
        <Menu.Item key='1' style={{ padding: '5px 25px' }}>1 列</Menu.Item>
        <Menu.Item key='2' style={{ padding: '5px 25px' }}>2 列</Menu.Item>
        <Menu.Item key='3' style={{ padding: '5px 25px' }}>3 列</Menu.Item>
        <Menu.Item key='4' style={{ padding: '5px 25px' }}>4 列</Menu.Item>
        <Menu.Item key='auto' style={{ padding: '5px 25px' }}>自适应</Menu.Item>
      </Menu>
    )

    return (
      <div id='search-form-container' className='search-form-container'>
        <div className='search-form-operate-bar'>
          <Tooltip title='配置查询条件'>
            {
              !accurateSearch && showFormConfig && <Icon type="setting" className='icon-button' onClick={this.handleOnSetFormConfig} />
            }
          </Tooltip>

          <Dropdown overlay={menus} trigger={['click']} placement="bottomCenter">
            <Tooltip title='设置布局'>
              {
                showSetCol !== false && <Icon type="ellipsis" className='icon-button' style={{ fontSize: '22px' }} />
              }
            </Tooltip>
          </Dropdown>
        </div>

        <Form>
          <Row gutter={24}>
            {
              formConfig.map((config, i) => {
                if (colNum > 1) {
                  if (!showAllConditions && i >= (colNum - 1)) {
                    return this.createFormItem(config, i, '0')
                  }
                } else {
                  if (!showAllConditions && i >= (colNum)) {
                    return this.createFormItem(config, i, '0')
                  }
                }

                return this.createFormItem(config, i)
              })
            }

            <Col span={spanSize}>
              <Form.Item style={{ textAlign: 'right' }}>
                <Button loading={loading} type="primary" onClick={(e) => { this.handleSearch(e, true) }} style={{ marginRight: 10 }}>查询</Button>
                <Button loading={loading} onClick={(e) => { this.handleReset(e, true) }} style={{ marginRight: 10 }}>重置</Button>

                {
                  Array.isArray(accurateFormConfig) && (
                    <Tooltip title={`${accurateSearch && '关闭' || '开启'}精准搜索`}>
                      <Switch size='small' checked={accurateSearch} onChange={this.handleOnSearchTypeChange} style={{ marginRight: 10 }} />
                    </Tooltip>
                  )
                }

                <a onClick={this.handleOnShowMoreCondition} >
                  {
                    showAllConditions ? '收起' : '展开'
                  }
                  <Icon type={showAllConditions ? 'up' : 'down'} style={{ marginLeft: 2 }} />
                </a>

              </Form.Item>
            </Col>
          </Row>
        </Form>

        <SettingFormConfig ref={this.setFormConfigRef} onChange={this.handleOnFormConfigChange} id={id} location={location} />
      </div>
    )
  }
}

export default Form.create()(SearchForm)
