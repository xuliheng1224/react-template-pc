import React, { Component } from 'react';
import { Layout } from 'antd'
import LayoutHeader from './@components/LayoutHeader/index.jsx'
import LayoutSider from './@components/LayoutSider/index.jsx'
import './index.less'

class BasicLayout extends Component {

  render () {
    return (
      <Layout style={{ height: '100%' }}>
        <LayoutSider></LayoutSider>

        <Layout>
          <LayoutHeader></LayoutHeader>

          <div id='layout-content' className='layout-content'>
            {this.props.children}
          </div>
        </Layout>
      </Layout>
    )
  }
}

export default BasicLayout;
