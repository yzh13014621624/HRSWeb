/*
 * @description: 异动接口
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-04-10 09:44:32
 * @LastEditTime: 2019-09-26 14:04:28
 * @copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  jobChangeList: { // 异动列表
    path: 'EmployeeChanges/queryChangesList'
  },
  jobChangeAddList: { // 选择异动员工列表
    path: 'EmployeeChanges/queryChooseList'
  },
  jobChangeAddInfo: { // 新增异动员工当前可编辑接口
    type: 'get',
    path: 'EmployeeChanges/insertChangesView'
  },
  jobChangeBeforeInfo: { // 异动前员工详情
    type: 'get',
    path: 'EmployeeChanges/getChangesInfo'
  },
  jobChangeAddSubmit: { // 新增异动员工提交
    path: 'EmployeeChanges/insertChangesInfo'
  },
  jobChangeEdit: { // 编辑异动员工提交
    path: 'EmployeeChanges/updateChangerInfo'
  },
  exportList: { // 导出列表
    path: 'EmployeeChanges/exportChangeList'
  },
  jobChangeImport: { // 导入
    path: 'EmployeeChanges/importChangeInfo'
  },
  jobChangeTemplate: { // 下载导入模板
    type: 'get',
    path: 'EmployeeChanges/importChangeTemplate'
  },
  jobChageUpload: { // 上传图片
    path: 'EmployeeChanges/insertChangesOssUpload'
  }
}
