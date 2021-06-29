import React, { Component } from 'react'
import { Icon, Tooltip } from 'antd'

export default class SelectedItem extends Component {
    render() {
        const { data } = this.props

        return (
            <div className={`setting-table-col-container-right-body-item ${!data.fixed && 'move'}`}>
              <span>
                <span className='setting-table-col-container-right-body-item-drag-icon'>
                  {
                    data.fixed !== 'left' && data.fixed !== 'right' ? <Icon type="menu" style={{color: '#ccc', marginRight: '5px'}} /> : null
                  }
                </span>

                {data.label || data.title} 
  
                {
                  data.fixed == 'left' && (
                    <Tooltip title='该列已固定在左侧，不能改变位置'>
                      <Icon type="vertical-align-top" style={{color: '#ccc'}} />
                    </Tooltip>
                  )
                }
  
                {
                  data.fixed == 'right' && (
                    <Tooltip title='该列已固定在右侧，不能改变位置'>
                      <Icon type="vertical-align-bottom" style={{color: '#ccc'}} />
                    </Tooltip>
                  )
                }
              </span>
                      
              <span>
                {
                  data.disabled ? null : (
                    <Tooltip title='删除'>
                      <Icon type="delete" className='icon-button' onClick={() => this.props.onDelete()} />
                    </Tooltip>
                  )
                }
              </span>
            </div>
        )
    }
}