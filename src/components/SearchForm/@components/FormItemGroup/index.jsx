import React, { Component } from 'react'
import { Select, Input } from 'antd'

const InputGroup = Input.Group

export default class FormItemGroup extends Component {
  state = {
    value: this.props.config.children[0].fieldName,
    index: 0
  }

  handleOnChagne = (value, option) => {
    this.setState({ value, index: Number(option.key) })
  }

  render () {
    const { config, createFieldDecorator } = this.props
    const { value, index } = this.state

    config.label = config.children[index].label
    config.fieldName = value

    return (
      <InputGroup compact>
        <Select style={{ width: '36%' }} value={value} onChange={this.handleOnChagne}>
          {
            config.children.map((item, i) => {
              if (!item.props) item.props = {}

              item.props.style = { width: '64%' }

              return (
                <Select.Option key={i} value={item.fieldName}>{item.label}</Select.Option>
              )
            })
          }
        </Select>

        {
          createFieldDecorator(config.children[index])
        }
      </InputGroup>
    )
  }
}