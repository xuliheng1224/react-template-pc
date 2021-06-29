import http from '@utils/request'

export function getCustomColumns (data) {
   return {
      data: [{
         fieldType: 'input',
         fieldName: '动态查询',
         customizeField: 'active',
         props: {
            allowClear: true
         },
      },
      {
         fieldType: 'select',
         fieldName: '结果',
         customizeField: 'type',
         fieldsContentList: [
            { value: 1, label: '成功' },
            { value: 0, label: '失败' }
         ]
      }
      ]
   }
}