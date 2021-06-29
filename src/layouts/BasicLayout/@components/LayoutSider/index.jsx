import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd'
import { connect } from 'dva'
import { Link } from 'react-router-dom'
import menuConfig from '@src/layouts/BasicLayout/menuConfig'
import './index.less'

const { Sider } = Layout

@connect(({ global }) => ({ global }))
class LayoutSider extends Component {

    renderMenus () {
        const menuData = menuConfig.map((item, i) => {
            return (
                <Menu.Item key={item.path}>
                    <Link to={item.path}>
                        <Icon type={item.icon} />
                        <span>{item.name}</span>
                    </Link>
                </Menu.Item>
            )
        })

        return menuData
    }

    render () {
        const { collapsed } = this.props.global

        return (
            <Sider width={250} collapsed={collapsed}>
                <div className="aside-logo">
                    {collapsed ? 'Ant' : 'Ant Design Pro'}
                </div>

                <Menu theme="dark">
                    {this.renderMenus()}
                </Menu>
            </Sider>
        )
    }
}

export default LayoutSider;
