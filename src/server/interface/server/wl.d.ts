/*
 * @description:
 * @author: wanglu
 * @lastEditors: wanglu
 * @Date: 2019-08-29 10:33:37
 * @LastEditTime: 2019-09-25 17:56:29
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

type Api = {
  type?: string
  readonly path: string
}

declare const ServerList: [
  /* <<<<<<<< 薪酬管理列表、新增、查看、编辑 >>>>>>>> */
  'SalaryList', 'SalaryVoucherInfo', 'SalaryinsertInfo', 'SalaryUpdateInfo', 'SalaryGetUserInfo', 'SalaryDeleteInfo', 'SalaryExportList', 'SalaryExportMaintainInfoTem', 'importSalaryVoucherInfo',
  /* <<<<<<<< 新增、编辑、查看员工 >>>>>>>> */
  'SalaryExportChooseList', 'SalaryQueryUserList', 'getCloseInfo'
]

type ServerWL = {
  [api in (typeof ServerList)[number]]: Api
}

// eslint-disable-next-line no-undef
export default ServerWL
