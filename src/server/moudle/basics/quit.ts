/**
 * @author lixinying
 * @createTime 2019/04/10
 * @description Server Api 后台接口
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  quitDetalis: {
    type: 'post',
    path: 'EmployeeJump/JumpInfo' // 员工离职详情
  },
  quitChoose: {
    type: 'post',
    path: 'EmployeeJump/queryChooseList' // 选择离职员工列表
  },
  quitInsert: {
    type: 'post',
    path: 'EmployeeJump/insertJumpInfo' // 新增员工离职
  },
  quitPageInsert: {
    type: 'get',
    path: 'EmployeeJump/insertJumpView' // 新增员工离职页面
  },
  quitList: {
    type: 'post',
    path: 'EmployeeJump/queryJumpList' // 员工离职列表
  },
  quitEditDetail: {
    type: 'get',
    path: 'EmployeeJump/getJumpInfo'
  },
  quitUpadte: {
    type: 'post',
    path: 'EmployeeJump/updateJumpInfo' // 编辑员工离职
  },
  quitExport: { // 离职导出模板
    path: 'EmployeeJump/exportJumpInfo'
  },
  quitImport: { // 离职导入
    path: 'EmployeeJump/importJumpInfo'
  },
  quitExportNewAdd: { // 选择离职员工导出
    path: 'EmployeeJump/exportJumpChooseInfo'
  },
  quitDownloadTemplate: { // 离职导入模板下载
    type: 'get',
    path: 'EmployeeJump/exportJumpInfoTem'
  }
}
