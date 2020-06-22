/*
 * @description: 接口定义文件
 * @author: qiuyang
 * @lastEditors: qiuyang
 * @Date: 2019-08-28 16:05:07
 * @LastEditTime: 2020-06-08 16:43:35
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

type Api = {
    type?: string
    readonly path: string
  }

declare const ServerList: [
  /* <<<<<<<< 计件计算 >>>>>>>> */
  /* <<<<<<<< 计件项目总览 >>>>>>>> */
  'Pieceoverview', 'Pieceoverviewlist', 'Pieceoverviewedit', 'PieceoverviewInfo', 'DelPieceworkVoucher', 'GetPieceworkVoucherUserList', 'GetPieceworkUserInfo',
  'ExportParameterTem', 'importPiecework', 'exportParameterSalary', 'exportUserPiecework', 'exportPieceworkVoucherUser', 'getParameterHis',
  /* <<<<<<<< 员工计件收入 >>>>>>>> */
  'PieceoverviewPage',
  /* <<<<<<<< 薪资归档 >>>>>>>> */
  'QueryArchiveList', 'GetArchiveInfo', 'SalaryFileExportArchiveList',
  /* <<<<<<<< 系统管理-账户管理 >>>>>>>> */
  'SystemQueryUserList', 'SystemDeleteAdminUser', 'SystemEditRole', 'SystemEnable', 'SystemGetAdminDetails', 'SystemInsertRole', 'SystemInsertUser',
  'SystemResetPassword', 'SystemUpdUser', 'SystemGrantRoles',
  /* <<<<<<<< 系统管理-角色管理 >>>>>>>> */
  'SystemQueryRoleList', 'SystemEeleteRole', 'SystemGetAuthDetails', 'SystemDelOrganize', 'SystemExportTemplate', 'SystemImportOrganize', 'SystemAddOrganize',
  'SystemUpdateOrganize', 'SystemGetAuthCode', 'SystemGrantPerms', 'GetProject',
]

type ServerQY = {
  [api in (typeof ServerList)[number]]: Api
}

// eslint-disable-next-line no-undef
export default ServerQY
