/**
 * @description mock 的假数据编写
 * @author minjie
 * @date 2018/12/19
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import ServerApi from '@server/ServerApi'

const Mock = require('mockjs')
const Random = Mock.Random

// 返回邀请码
Mock.mock(ServerApi.login.path + '.mock', ServerApi.login.type, () => {
  let da = {
    code: '200'
  }
  return {
    data: da,
    msg: [ '成功' ],
    code: 200
  }
})

Mock.mock(ServerApi.tableData.path + '.mock', ServerApi.tableData.type, () => {
  let da:any = []
  for (let i = 0; i < 10; i++) {
    da.push({
      id: i,
      project: '项目1',
      projectId: '0000' + i,
      sjId: 'sj' + i,
      name: Mock.mock('@cname'),
      organize: '上嘉',
      incumbency: i % 2,
      // 员工类型
      staffType: '全职',
      // 法人主体
      legalEntity: '上海上嘉',
      // 层级
      hierarchy: 'L' + Random.integer(1, 9),
      // 等级
      grade: Random.integer(1, 9),
      // 档级
      degree: Random.cword('一二三四五六七八九'),
      dateOfEntry: Mock.mock('@datetime'),
      leaveDate: Mock.mock('@datetime'),
      // 基本工资
      baseSalary: Random.float(4000, 10000, 0, 2),
      // 绩效工资
      bonusSalary: Random.float(4000, 10000, 0, 2),
      // 试用期基本工资
      probationBaseSalary: Random.float(3000, 4000, 0, 2),
      // 试用期绩效工资
      probationBonusSalary: Random.float(3000, 4000, 0, 2),
      createTime: Mock.mock('@datetime'),
      // 生效时间
      takeEffectTime: Mock.mock('@datetime')
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
