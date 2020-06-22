/**
 * @author
 * @createTime 2019/09/18
 * @description 薪酬准备-后台接口
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  SalaryList: { // 薪酬凭证维护列表
    type: 'post',
    path: '/SalaryVoucher/querySalaryList'
  },
  SalaryVoucherInfo: { // 薪酬凭证维护详情信息
    type: 'get',
    path: '/SalaryVoucher/getSalaryVoucherInfo'
  },
  SalaryinsertInfo: { // 新增薪酬凭证维护信息
    type: 'post',
    path: '/SalaryVoucher/insertSalaryInfo'
  },
  SalaryUpdateInfo: { // 修改薪酬凭证维护信息
    type: 'post',
    path: '/SalaryVoucher/updateSalaryInfo'
  },
  SalaryGetUserInfo: { // 新增页面员工信息
    type: 'get',
    path: '/SalaryVoucher/getUserInfo'
  },
  SalaryDeleteInfo: { // 删除/批量删除薪酬凭证维护信息
    type: 'post',
    path: '/SalaryVoucher/deleteSalaryInfo'
  },
  SalaryExportList: { // 薪酬准备列表导出
    type: 'post',
    path: '/SalaryVoucher/exportSalaryVoucherList'
  },
  SalaryExportMaintainInfoTem: { // 薪酬准备模板下载
    type: 'get',
    path: '/SalaryVoucher/exportMaintainInfoTem'
  },
  SalaryExportChooseList: { // 入职/离职列表导出
    type: 'post',
    path: '/SalaryVoucher/exportChooseList'
  },
  SalaryQueryUserList: { // 选择员工列表(在职/离职)
    type: 'post',
    path: '/SalaryVoucher/queryUserList'
  },
  importSalaryVoucherInfo: { // 薪资凭证维护信息导入
    type: 'post',
    path: '/SalaryVoucher/importSalaryVoucherInfo'
  },
  getCloseInfo: { // 获取本月是否关账
    type: 'get',
    path: '/SalaryVoucher/getCloseInfo'
  }
}
