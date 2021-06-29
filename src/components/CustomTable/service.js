// import http from '@utils/request'

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

export async function getDtaList (parmas) {
   console.log('接口参数', parmas);
   const data = []
   for (let i = 1; i <= 100; i++) {
      data.push({
         id: i,
         importTime: '2021-6-27 18:00:00',
         importTotal: i * 10,
         successNum: i * 8,
         failedNum: i * 2,
         createUserName: '许立恒',
         importStatusName: '成功或失败',
         type: i % 2,
         active: i * 2
      })
   }
   return {
      data,
      pagination: {
         page: 1,
         pageCount: 1,
         pageSize: 10,
         totalCount: 100
      }
   }
}