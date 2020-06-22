/**
 * @description mock 的假数据编写
 * @author maqian
 * @date 2019/04/17
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import ServerApi from '@server/ServerApi'

const Mock = require('mockjs')
const Random = Mock.Random
// 参保核算
// Mock.mock(ServerApi.insuredaccoutlist.path + '.mock', ServerApi.insuredaccoutlist.type, () => {
//   let da:any = []
//   for (let i = 0; i < 10; i++) {
//     da.push({
//       id: i,
//       projectName: '项目' + i,
//       projectNumber: i,
//       sjNumber: 'SJ' + i,
//       userId: i,
//       userName: Mock.mock('@cname'),
//       organize: Mock.mock('@cname'),
//       idCard: Mock.mock('12345676') + i + i,
//       roleType: Mock.mock('员工类型') + i,
//       typeName: Mock.mock('合同类型') + i,
//       legalEntity: Mock.mock('法人主体') + i,
//       tryStartTime: Mock.mock('@date("yyyy-MM-dd")'),
//       tryEndTime: Mock.mock('@date("yyyy-MM-dd")')

//     })
//   }
//   return {
//     data: {
//       data: da,
//       total: 500,
//       currentPage: 1,
//       pageSize: 10,
//       totalNum: 1,
//       isMore: null,
//       totalPage: 1
//     },
//     msg: [ '获取数据成功' ],
//     code: 200
//   }
// })
