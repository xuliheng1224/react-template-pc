import moment from 'moment'

export default {
  formConfig: [
    {
      type: 'Group',
      children: [
        {
          type: 'Input',
          label: '运营单ID',
          fieldName: 'operationId',
          props: {
            allowClear: true
          }
        },
        {
          type: 'Input',
          label: '合同客户名称',
          fieldName: 'contractCustomerName',
          props: {
            allowClear: true,
          }
        },
        {
          type: 'Input',
          label: '投放客户名称',
          fieldName: 'putCustomerName',
          props: {
            allowClear: true,
          }
        },
        {
          type: 'Input',
          label: '产品账户ID',
          fieldName: 'productAccountId',
          props: {
            allowClear: true,
          }
        },
        {
          type: 'Select',
          label: '行业',
          fieldName: 'industry',
          props: {
            allowClear: true,
            options: [{
              value: 1,
              label: '教育'
            },
            {
              value: 2,
              label: '工厂'
            }
            ]
          }
        }
      ]
    },
    {
      type: 'Input',
      label: '导入批次',
      fieldName: 'id',
      initialValue: 1,
      props: {
        allowClear: true,
      }
    },
    {
      type: 'Select',
      label: '导入状态',
      fieldName: 'status',
      props: {
        allowClear: true,
        options: [{
          value: 1,
          label: '成功'
        },
        {
          value: 2,
          label: '失败'
        }
        ]
      }
    },
    {
      type: 'Select',
      label: '订单类型',
      fieldName: 'orderType',
      props: {
        allowClear: true,
        options: [{
          value: 1,
          label: '1'
        },
        {
          value: 2,
          label: '2'
        }
        ]
      }
    },
    {
      type: 'Select',
      label: '支付类型',
      fieldName: 'payType',
      props: {
        allowClear: true,
        options: [{
          value: 1,
          label: '微信'
        },
        {
          value: 2,
          label: '支付宝'
        }
        ]
      }
    },
    {
      type: 'RangePicker',
      label: '数据日期',
      fieldName: 'createTime',
      fieldNames: ['startTime', 'endTime'],
      props: {
        allowClear: true,
        disabledDate: cur => cur && cur > moment().startOf('d')
      }
    }
  ],

  keepalive: true,
  id: 'SEARCH_FORM:aftersale_operationImport',
  colNum: 3,
  notKeepInitialValue: true,
  showFormConfig: true,
  externalParams: {
    type: 1
  },
  // 精准搜索配置
  accurateFormConfig: [
    {
      type: 'Input',
      label: '导入批次',
      fieldName: 'id',
      props: {
        allowClear: true,
        placeholder: '请输入导入批次'
      },
    }
  ],
  customFormConfig: {
    moduleType: 1
  }
}