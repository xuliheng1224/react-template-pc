import React, { Component } from 'react'
import { Icon, Tooltip } from 'antd'

export default class SelectedItem extends Component {
    render() {
        const { data } = this.props

        return (
            <div className='setting-form-config-container-right-body-item move'>
              <span>
                <span className='setting-form-config-container-right-body-item-drag-icon'>
                  <Icon type="menu" style={{color: '#ccc', marginRight: '5px'}} />
                </span>

                { data.label } 
              </span>
                      
              <span>
                <Tooltip title='删除'>
                  <Icon type="delete" className='icon-button' onClick={() => this.props.onDelete()} />
                </Tooltip>
              </span>
            </div>
        )
    }
}