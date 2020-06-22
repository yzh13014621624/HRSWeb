/**
 * @author minjie
 * @createTime 2019/04/09
 * @description Server Api 后台接口
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  entryQuery: {
    type: 'post',
    path: 'EmployeeOnboard/queryUserList' // 查询员工信息-实现
  },
  entryDelete: {
    type: 'post',
    path: 'EmployeeOnboard/deleteUserInfo' // 删除员工信息-实现
  },
  entryAdd: {
    type: 'post',
    path: 'EmployeeOnboard/insertUserInfo' // 添加员工信息-实现
  },
  entryDetail: {
    type: 'get',
    path: 'EmployeeOnboard/getUserDetail' // 查询员工信息详情-实现
  },
  entryUpadte: {
    type: 'post',
    path: 'EmployeeOnboard/updateUserInfo' // 修改员工信息-实现
  },
  entryImport: {
    type: 'post',
    path: 'EmployeeOnboard/updateUserInfo' // 导入
  },
  entryExport: {
    type: 'post',
    path: 'EmployeeOnboard/updateUserInfo' // 导出
  },
  entryDowloadModel: {
    type: 'post',
    path: 'EmployeeOnboard/updateUserInfo' // 下载导入模板
  },
  entrySuccess: {
    type: 'get',
    path: 'EmployeeOnboard/updateEntrySuccess' // 入职生效-实现
  },
  entryOssUpload: {
    type: 'post',
    path: 'EmployeeOnboard/insertOssUpload' // 上传OSS-实现
  },
  entryLegalEntity: {
    type: 'post',
    path: 'EmployeeOnboard/getLegalEntity' // 查询法人主体-实现
  },
  entryOrganize: {
    type: 'post',
    path: 'EmployeeOnboard/getOrganizeTree' // 查询组织-实现
  },
  entryLevel: {
    type: 'get',
    path: 'EmployeeOnboard/getLevel' // 查询级别-实现
  },
  entryPosition: {
    type: 'get',
    path: 'EmployeeOnboard/getPosition' // 查询职位-实现
  },
  entryProject: {
    type: 'get',
    path: 'EmployeeOnboard/getProject' // 查询项目-实现
  },
  entryBankCardInfo: {
    type: 'post',
    path: 'EmployeeOnboard/getBankCardInfo' // 查询银行卡信息--实现
  },
  entryExportUserInfo: {
    type: 'post',
    path: 'EmployeeOnboard/exportUserInfo' // 人员信息导出--实现
  },
  entryExportUserInfoTem: {
    type: 'get',
    path: 'EmployeeOnboard/exportUserInfoTem' // 人员信息模板下载--实现
  },
  entryImportUserInfo: {
    type: 'post',
    path: 'EmployeeOnboard/importUserInfo' // 人员信息导入--实现
  },
  entryOCR: {
    type: 'post',
    path: 'EmployeeOnboard/getOcrIdCardInfo' // OCR信息识别--实现
  },
  entryCheckProject: {
    type: 'get',
    path: 'EmployeeOnboard/countProjectNumber' // 查询工号是否存在--实现
  },
  entryReject: {
    path: '/EmployeeOnboard/reject' // 好饭碗数据---驳回
  },
  entryGetJobType: {
    path: '/BasicData/getJobType' // 查询工作岗位--实现：根据项目查询工作岗位的信息
  },
  entrySendSms: { // 发送短信通知去好饭碗注册账号
    type: 'get',
    path: '/EmployeeOnboard/sendSmsMsg'
  },
  entryGetPositionList: { // 员工类型三级联动列表
    type: 'get',
    path: '/EmployeeOnboard/getPositionList'
  }
}
