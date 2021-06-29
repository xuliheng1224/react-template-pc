export function getCustomFormConfig (data) {
   return {
      data: [{
         fieldType: 'Input',
         fieldName: '动态查询',
         customizeField: 'active',
         props: {
            allowClear: true,
            placeholder: '请输入动态查询条件'
         },
      },
      ]
   }
}