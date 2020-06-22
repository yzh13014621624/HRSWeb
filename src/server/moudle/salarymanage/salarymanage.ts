/*
 * @description: 计件计算后台接口
 * @author: qiuyang
 * @lastEditors: qiuyang
 * @Date: 2019-09-27 13:35:55
 * @LastEditTime: 2019-11-29 17:02:08
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
export default {
  PieceoverviewList: { // 计件凭证-列表
    type: 'post',
    path: '/salaryPieceworkVoucher/getPieceworkVoucherList'
  },
  PieceoverviewEdit: { // 计件凭证-新增/修改
    type: 'post',
    path: '/salaryPieceworkVoucher/insertPieceworkVoucher'
  },
  Pieceoverview: { // 计件项目总览-列表
    type: 'post',
    path: '/salaryPieceworkVoucher/getOverviewList'
  },
  getParameterHis: { // 计件项目总览-列表
    type: 'get',
    path: '/pieceworkParameter/v1/getParameterHis'
  },
  PieceoverviewInfo: { // 计件凭证-详情
    type: 'get',
    path: '/salaryPieceworkVoucher/getPieceworkVoucherInfo'
  },
  DelPieceworkVoucher: { // 计件参数-详情
    type: 'post',
    path: '/salaryPieceworkVoucher/delPieceworkVoucher'
  },
  GetPieceworkVoucherUserList: { // 计件凭证-员工选择列表
    type: 'post',
    path: '/salaryPieceworkVoucher/getPieceworkVoucherUserList'
  },
  GetPieceworkUserInfo: { // 计件凭证新增页面-员工信息
    type: 'get',
    path: '/salaryPieceworkVoucher/getPieceworkUserInfo'
  },
  PieceoverviewPage: { // 员工计件收入-列表
    type: 'post',
    path: '/salaryPieceworkVoucher/getUserPieceworkList'
  },
  PieceworkIncomeInfo: { // 员工计件收入-详情
    type: 'get',
    path: '/salaryPieceworkVoucher/getUserPieceworkInfo'
  },
  ExportParameterTem: { // 计件凭证-导入模板下载
    type: 'get',
    path: '/salaryPieceworkVoucher/v1/exportParameterTem'
  },
  importPiecework: { // 计件凭证-导入
    type: 'post',
    path: '/salaryPieceworkVoucher/v1/importPiecework'
  },
  exportParameterSalary: { // 计件凭证-导出
    type: 'post',
    path: '/salaryPieceworkVoucher/v1/exportParameter'
  },
  exportUserPiecework: { // 员工计件收入-导出
    type: 'post',
    path: '/salaryPieceworkVoucher/v1/exportUserPiecework'
  },
  exportPieceworkVoucherUser: { // 计件凭证-员工选择列表导出
    type: 'post',
    path: '/salaryPieceworkVoucher/v1/exportPieceworkVoucherUser'
  }
}
