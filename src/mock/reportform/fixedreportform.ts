/**
 * @description mock 的假数据编写
 * @author maqian
 * @date 2019/04/25
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import ServerApi from '@server/ServerApi'

const Mock = require('mockjs')
const Random = Mock.Random
// 固定报表
Mock.mock(ServerApi.fixedreportlist.path + '.mock', ServerApi.fixedreportlist.type, () => {
  let da:any = []
  for (let i = 0; i < 10; i++) {
    da.push({
      id: i,
      projectName: '报表名称' + i,
      projectNumber: '年份' + i + 1,
      sjNumber: '月份' + i
    })
  }
  return {
    data: {
      data: da,
      total: 500,
      currentPage: 1,
      pageSize: 10,
      totalNum: 1,
      isMore: null,
      totalPage: 1
    },
    msg: [ '获取数据成功' ],
    code: 200
  }
})
