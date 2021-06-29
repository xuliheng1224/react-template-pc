import React from 'react'
import { Checkbox, Row, Col, message } from 'antd'
import { Container, Draggable } from 'react-smooth-dnd'
import SelectedItem from './@components/SelectedItem'
import Dialog from '@/components/Dialog'
import './index.less'

export default class SettingTableCol extends Dialog {
  modelConfig = {
    ...this.modelConfig,
    title: '自定义显示字段',
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
    const { columns } = this.state.data

    this.setState({ selectedList: columns })
  }

  // onSubmit = () => {
  //   this.close()
  // }

  handleOnChange = (e, item) => {
    if (e.target.checked) {
      item.show = e.target.checked

      this.setState(prevState => {
        const selected = [...prevState.selectedList, item]
        const columns1 = selected.filter(item => !item.fixed)
        const fixedLeftColumns = selected.filter(item => item.fixed == 'left')
        const fixedRightColumns = selected.filter(item => item.fixed == 'right')
        const selectedList = [...fixedLeftColumns, ...columns1, ...fixedRightColumns]

        return { selectedList }
      }, () => {
        if (typeof this.props.onChange === 'function') {
          this.props.onChange(this.state.selectedList)
        }

        this.handleSaveSelectedList() // 保存用户的选择
      })
    } else {
      if (this.state.selectedList.length < 4) return message.error('至少要显示3个字段！')

      const selectedList = this.state.selectedList.filter(one => item.dataIndex !== one.dataIndex)

      item.show = e.target.checked

      this.setState({ selectedList }, () => {
        if (typeof this.props.onChange === 'function') {
          this.props.onChange(this.state.selectedList)
        }

        this.handleSaveSelectedList() // 保存用户的选择
      })
    }
  }

  handleOnDelete = item => {
    if (this.state.selectedList.length < 4) return message.error('至少要显示3个字段！')

    const { defaultColumns, customColumns } = this.state.data
    const selectedList = this.state.selectedList.filter(one => item.dataIndex !== one.dataIndex);

    defaultColumns.forEach(one => {
      if (item.dataIndex == one.dataIndex) one.show = false
    })
    customColumns.forEach(one => {
      if (item.dataIndex == one.dataIndex) one.show = false
    })

    this.setState({ selectedList }, () => {
      if (typeof this.props.onChange === 'function') {
        this.props.onChange(this.state.selectedList)
      }

      this.handleSaveSelectedList() // 保存用户的选择
    })
  }

  getStorageKey () {
    const tableId = this.props.id
    const str = localStorage.getItem('currentUser')

    if (str && str != 'null' && str != 'undefined') {
      const user = JSON.parse(str)

      return `${user.username}:${tableId}`
    }

    return tableId
  }

  handleSaveSelectedList () {
    const key = this.getStorageKey()
    const selectedKeys = this.state.selectedList.map(item => (item.dataIndex || item.key))

    localStorage.setItem(key, JSON.stringify(selectedKeys))
  }

  // handleResetSelectedList () {
  //   const key = this.getStorageKey()
  //   const str = localStorage[key]

  //   if (str && str != 'null' && str != 'undefined') {
  //     const selectedList = str
  //   }
  // }

  //////// 拖拽的操作 ////////
  drag = {
    // 拖拽放开时
    handleOnDragDrop: (e) => {
      const targetItem = this.state.selectedList[e.addedIndex]

      if (targetItem.fixed == 'left' || targetItem.fixed == 'right') {
        const position = targetItem.fixed == 'left' ? '左' : '右'

        return message.warning(`【${targetItem.label || targetItem.title}】列已固定在${position}侧，不能改变其位置`)
      }

      this.setState((prevState) => {
        const selectedList = prevState.selectedList

        selectedList.splice(e.removedIndex, 1)
        selectedList.splice(e.addedIndex, 0, e.payload)

        return { selectedList }
      }, () => {
        if (typeof this.props.onChange === 'function') {
          this.props.onChange(this.state.selectedList)
        }

        this.handleSaveSelectedList() // 保存用户的选择
      })
    }
  }

  render () {
    const { defaultColumns, customColumns } = this.state.data

    return super.render(
      <div className='setting-table-col-container'>
        <div className='setting-table-col-container-left'>
          <div className='setting-table-col-container-left-header'>
            可选字段
          </div>

          <Row>
            <div style={{ fontWeight: 'bold', marginTop: '20px', color: '#000' }}>基础字段</div>
            {
              Array.isArray(defaultColumns) && defaultColumns.map(item => {
                return (
                  <Col span={8} key={item.dataIndex} style={{ padding: '6px 0px' }}>
                    <Checkbox checked={item.show} disabled={item.disabled} onChange={(e) => { this.handleOnChange(e, item) }}>{item.label || item.title}</Checkbox>
                  </Col>
                )
              })
            }
          </Row>

          <Row>
            {
              Array.isArray(customColumns) && customColumns.length > 0 && (
                <div style={{ fontWeight: 'bold', marginTop: '25px', color: '#000' }}>自定义字段</div>
              )
            }

            {
              Array.isArray(customColumns) && customColumns.map(item => {
                return (
                  <Col span={8} key={item.dataIndex} style={{ padding: '6px 0px' }}>
                    <Checkbox checked={item.show} disabled={item.disabled} onChange={(e) => { this.handleOnChange(e, item) }}>{item.label || item.title}</Checkbox>
                  </Col>
                )
              })
            }
          </Row>
        </div>

        <div className='setting-table-col-container-right'>
          <div className='setting-table-col-container-right-header'>
            已显示字段
          </div>

          <div className='setting-table-col-container-right-body'>
            <Container
              dragClass="dragging_container_item"
              groupName="a"
              onDrop={this.drag.handleOnDragDrop}
              shouldAcceptDrop={() => true}
              getChildPayload={index => this.state.selectedList[index]}
            >
              {
                this.state.selectedList.map((item, i) => {
                  if (item.fixed == 'left' || item.fixed == 'right') {
                    return <SelectedItem key={i} data={item} onDelete={() => this.handleOnDelete(item)} />
                  }

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
