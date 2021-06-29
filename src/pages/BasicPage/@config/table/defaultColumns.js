import React from 'react'
import { Operation } from '@/components'

export default [ // 列的配置
  {
    title: '导入批次',
    dataIndex: 'id',
    width: 140,
    show: true,
    disabled: false
  },

  {
    title: '导入时间',
    dataIndex: 'importTime',
    width: 200,
    show: true,
    disabled: false
  },

  {
    title: '导入总数',
    dataIndex: 'importTotal',
    width: 180,
    show: true,
    disabled: false
  },

  {
    title: '成功数量',
    dataIndex: 'successNum',
    width: 160,
    show: true,
    disabled: false
  },

  {
    title: '失败数量',
    dataIndex: 'failedNum',
    width: 160,
    show: true,
    disabled: false
  },

  {
    title: '操作人',
    dataIndex: 'createUserName',
    width: 200,
    show: true,
    disabled: false
  },

  {
    title: '导入状态',
    dataIndex: 'importStatusName',
    width: 200,
    show: true,
    disabled: false
  },

  {
    title: '操作',
    dataIndex: 'area',
    width: 140,
    show: true,
    fixed: 'right',
    disabled: false,
    render: (t, record) => {
      const buttons = []

      buttons.push({ text: '详情' })

      buttons.push({ text: '编辑' });

      buttons.push({ text: '分配协作人' })

      buttons.push({ text: '驳回合作' })

      buttons.push({ text: '放弃合作' })

      return <Operation buttons={buttons} />
    }
  }
]
