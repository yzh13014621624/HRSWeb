/**
 * @description mock 的假数据编写
 * @author maqian
 * @date 2019/04/12
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import ServerApi from '@server/ServerApi'

const Mock = require('mockjs')
const Random = Mock.Random
// 初签列表
Mock.mock(ServerApi.contractfirstlist.path + '.mock', ServerApi.contractfirstlist.type, () => {
  let da:any = []
  for (let i = 0; i < 20; i++) {
    da.push({
      id: i,
      projectName: '项目' + i,
      projectNumber: i,
      sjNumber: 'SJ' + i,
      userId: i,
      userName: Mock.mock('@cname'),
      organize: Mock.mock('@cname'),
      idCard: Mock.mock('12345676') + i + i,
      roleType: Mock.mock('员工类型') + i,
      typeName: Mock.mock('合同类型') + i,
      legalEntity: Mock.mock('法人主体') + i,
      hourType: Mock.mock('工时类型') + i,
      taxationType: Mock.mock('计税类型') + i,
      startTime: Mock.mock('@date("yyyy-MM-dd")'),
      endTime: Mock.mock('@date("yyyy-MM-dd")')

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

// 续签列表
Mock.mock(ServerApi.contractrenewlist.path + '.mock', ServerApi.contractrenewlist.type, () => {
  let da:any = []
  for (let i = 0; i < 10; i++) {
    da.push({
      id: i,
      projectName: '项目' + i,
      projectNumber: i,
      sjNumber: 'SJ' + i,
      userId: i,
      userName: Mock.mock('@cname'),
      organize: Mock.mock('@cname'),
      idCard: Mock.mock('12345676') + i + i,
      roleType: Mock.mock('员工类型') + i,
      typeName: Mock.mock('合同类型') + i,
      legalEntity: Mock.mock('法人主体') + i,
      hourType: Mock.mock('工时类型') + i,
      taxationType: Mock.mock('计税类型') + i,
      startTime: Mock.mock('@date("yyyy-MM-dd")'),
      endTime: Mock.mock('@date("yyyy-MM-dd")')

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

// 试用期
Mock.mock(ServerApi.contractrylist.path + '.mock', ServerApi.contractrylist.type, () => {
  let da:any = []
  for (let i = 0; i < 10; i++) {
    da.push({
      id: i,
      projectName: '项目' + i,
      projectNumber: i,
      sjNumber: 'SJ' + i,
      userId: i,
      userName: Mock.mock('@cname'),
      organize: Mock.mock('@cname'),
      idCard: Mock.mock('12345676') + i + i,
      roleType: Mock.mock('员工类型') + i,
      typeName: Mock.mock('合同类型') + i,
      legalEntity: Mock.mock('法人主体') + i,
      tryStartTime: Mock.mock('@date("yyyy-MM-dd")'),
      tryEndTime: Mock.mock('@date("yyyy-MM-dd")')

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

// 选择员工
Mock.mock(ServerApi.chooselist.path + '.mock', ServerApi.chooselist.type, () => {
  let da:any = []
  for (let i = 0; i < 10; i++) {
    da.push({
      id: i,
      projectName: '项目' + i,
      projectNumber: i,
      sjNumber: 'SJ' + i,
      userId: i,
      userName: Mock.mock('@cname'),
      organize: Mock.mock('@cname'),
      workCondition: i % 2 === 0 ? '待入职' : '在职',
      typeName: i % 2 === 0 ? '待入职' : '在职',
      idCard: Mock.mock('12345676') + i + i,
      roleType: Mock.mock('员工类型') + i,
      legalEntity: Mock.mock('法人主体') + i,
      hourType: Mock.mock('工时类型') + i,
      taxationType: Mock.mock('计税类型') + i,
      entryTime: Mock.mock('@date("yyyy-MM-dd")')
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

// 添加初签/续签合同
Mock.mock(ServerApi.contractAdd.path + '.mock', ServerApi.contractAdd.type, (res:any) => {
  return {
    data: {},
    msg: [ '新增成功' ],
    code: 200
  }
})
