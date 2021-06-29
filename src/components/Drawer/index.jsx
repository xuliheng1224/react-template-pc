import React, { Component } from 'react'
import { Drawer } from 'antd'
import './index.less'

export default class HWTDrawer extends Component {
  state = {
    visible: false,
    title: '',
    data: {},
    drawerConfig: {
      width: 600
    }
  }

  show = (data) => {
    this.setState({ visible: true, data }, () => {
      if (typeof this.onOpen === 'function') this.onOpen(data)
    })
  }

  close = () => {
    this.setState({ visible: false }, () => {
      if (typeof this.onClose === 'function') this.onClose()
    })
  }

  render (content) {
    const { visible, drawerConfig } = this.state
    const title = this.props.title || this.state.title

    return (
      <Drawer
        className="my-drawer"
        title={title}
        placement="right"
        onClose={this.close}
        visible={visible}
        {...drawerConfig}
      >
        <div className="container">
          {content}
        </div>
      </Drawer>
    )
  }
}
