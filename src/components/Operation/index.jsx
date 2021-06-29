import React, { Component, Fragment } from 'react'
import { Dropdown, Menu, Divider, Icon } from 'antd'
import { Link } from 'dva/router'

export const A = props => {
  const { children, dispatch, ...restProps } = props
  return <a {...restProps}>{children}</a>
}

export default class XOperation extends Component {
  getItem = (item, key) => {

    const { text, component: Components, to, href, ...restProps } = item

    let mergeProps = { ...restProps }
    let Component = A

    if (href) {
      mergeProps = { ...mergeProps, href: toHashPath(href) }
    }

    if (to) {
      mergeProps = { ...mergeProps, to }
      Component = Link
    }

    let action = Components ? <Components {...mergeProps} /> : <Component key={key} {...mergeProps}>{text || ''}</Component>

    return <Fragment key={key}>{action}</Fragment>
  }

  render () {
    const { buttons = [] } = this.props;

    if (buttons.length > 2) {
      const menus = (
        <Menu>
          {
            buttons.map((item, i) => {
              if (i == 0) return null

              return <Menu.Item key={i}>{this.getItem(item, i)}</Menu.Item>
            })
          }
        </Menu>
      )

      return (
        <Fragment>

          {this.getItem(buttons[0], 0)}

          <Divider type="vertical" />

          <Dropdown overlay={menus} placement="bottomCenter" trigger={['click']}>
            <a>
              更多 <Icon type="down" />
            </a>
          </Dropdown>
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          {
            buttons[0] && this.getItem(buttons[0], 0)
          }
          {
            buttons[1] && <Fragment> <Divider type="vertical" /> {this.getItem(buttons[1], 1)} </Fragment>
          }
        </Fragment>
      )
    }
  }
}