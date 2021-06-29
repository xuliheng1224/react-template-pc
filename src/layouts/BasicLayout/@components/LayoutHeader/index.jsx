import React, { Component } from 'react';
import { Layout, Icon } from 'antd'
import { connect } from 'dva'
import './index.less'

const { Header } = Layout

@connect(({ global }) => ({ global }))
class LayoutHeader extends Component {
  state = {
    collapsed: false
  }

  handleOnClick = () => {
    this.props.dispatch({
      type: 'global/changeCollapsed',
      collapsed: !this.props.global.collapsed,
    })
  }

  render () {
    const { collapsed } = this.props.global
    const icon = collapsed ? 'menu-unfold' : 'menu-fold'

    return (
      <Header className='layout-header' style={{ background: '#fff' }}>
        <Icon type={icon} style={{ fontSize: '20px' }} onClick={this.handleOnClick} />
      </Header>
    )
  }
}

export default LayoutHeader;
