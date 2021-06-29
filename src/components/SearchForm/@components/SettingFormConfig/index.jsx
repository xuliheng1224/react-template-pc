import React from 'react'
import { Checkbox, Row, Col, message } from 'antd'
import Dialog from '@/components/Dialog'
import { Container, Draggable } from 'react-smooth-dnd'
import SelectedItem from './@components/SelectedItem'
import './index.less'


export default class SettingFormConfig extends Dialog {
  modelConfig = {
    ...this.modelConfig,
    title: '配置查询条件',
    width: 800,
    bodyStyle: {
      padding: '0px'
    },
    footer: null
  }

  state = {
    ...this.state,
    visible: false,
    selectedList: [],
    indeterminate: false,
    checkAll: false
  }

  onOpen = () => {
    this.init()
  }

  init () {
    const { allFormConfig } = this.state.data

    this.setState({ selectedList: allFormConfig })
  }

  // onSubmit = () => {
  //   this.close()
  // }

  handleOnChange = (e, item) => {
    if (e.target.checked) {
      item.show = e.target.checked

      this.setState(prevState => {
        const selectedList = [...prevState.selectedList, item]

        return { selectedList }
      }, () => {
        if (typeof this.props.onChange === 'function') {
          this.props.onChange(this.state.selectedList)
        }

      })
    } else {
      if (this.state.selectedList.length < 2) return message.error('至少要显示1个条件！')

      const selectedList = this.state.selectedList.filter(one => item.fieldName !== one.fieldName)

      item.show = e.target.checked

      this.setState({ selectedList }, () => {
        if (typeof this.props.onChange === 'function') {
          this.props.onChange(this.state.selectedList)
        }

      })
    }
  }

  handleOnDelete = item => {
    if (this.state.selectedList.length < 2) return message.error('至少要显示1个条件！')

    const { defaultFormConfig, customFormConfig } = this.state.data
    const selectedList = this.state.selectedList.filter(one => item.fieldName !== one.fieldName);

    defaultFormConfig.forEach(one => {
      if (item.fieldName == one.fieldName) one.show = false
    })
    customFormConfig.forEach(one => {
      if (item.fieldName == one.fieldName) one.show = false
    })

    this.setState({ selectedList }, () => {
      if (typeof this.props.onChange === 'function') {
        this.props.onChange(this.state.selectedList)
      }

      // this.handleSaveSelectedList() // 保存用户的选择
    })
  }

  //////// 拖拽的操作 ////////
  drag = {
    // 拖拽放开时
    handleOnDragDrop: (e) => {

      this.setState((prevState) => {
        const selectedList = prevState.selectedList

        selectedList.splice(e.removedIndex, 1)
        selectedList.splice(e.addedIndex, 0, e.payload)

        return { selectedList }
      }, () => {
        if (typeof this.props.onChange === 'function') {
          this.props.onChange(this.state.selectedList)
        }

        // this.handleSaveSelectedList() // 保存用户的选择
      })
    }
  }

  render () {
    const { defaultFormConfig, customFormConfig } = this.state.data

    return super.render(
      <div className='setting-form-config-container'>
        <div className='setting-form-config-container-left'>
          <div className='setting-form-config-container-left-header'>
            可选条件
          </div>

          <Row>
            <div style={{ fontWeight: 'bold', marginTop: '20px', color: '#000' }}>默认条件</div>
            {
              Array.isArray(defaultFormConfig) && defaultFormConfig.map(item => {
                return (
                  <Col span={8} key={item.fieldName} style={{ padding: '6px 0px' }}>
                    <Checkbox checked={item.show !== false} onChange={(e) => { this.handleOnChange(e, item) }}>{item.label}</Checkbox>
                  </Col>
                )
              })
            }
          </Row>

          <Row>
            {
              Array.isArray(customFormConfig) && customFormConfig.length > 0 && (
                <div style={{ fontWeight: 'bold', marginTop: '25px', color: '#000' }}>自定义条件</div>
              )
            }

            {
              Array.isArray(customFormConfig) && customFormConfig.map(item => {
                return (
                  <Col span={8} key={item.fieldName} style={{ padding: '6px 0px' }}>
                    <Checkbox checked={item.show !== false} onChange={(e) => { this.handleOnChange(e, item) }}>{item.label}</Checkbox>
                  </Col>
                )
              })
            }
          </Row>
        </div>

        <div className='setting-form-config-container-right'>
          <div className='setting-form-config-container-right-header'>
            已显示条件
          </div>

          <div className='setting-form-config-container-right-body'>
            <Container
              dragClass="dragging_container_item"
              groupName="a"
              onDrop={this.drag.handleOnDragDrop}
              shouldAcceptDrop={() => true}
              getChildPayload={index => this.state.selectedList[index]}
            >
              {
                this.state.selectedList.map((item, i) => {
                  return (
                    <Draggable key={i}>
                      <SelectedItem key={i} data={item} onDelete={() => this.handleOnDelete(item)} />
                    </Draggable>
                  )
                })
              }
            </Container>
          </div>
        </div>
      </div>
    )
  }
}
