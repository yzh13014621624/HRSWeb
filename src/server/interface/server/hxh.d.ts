/*
 * @description: huxianghe 接口定义文件
 * @author: huxianghe
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: huxianghe
 * @Date: 2019-06-29 15:50:00
 * @LastEditTime: 2019-09-23 14:40:34
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
type Api = {
  type?: string
  readonly path: string
}

declare const ServerList: [
  /* <<<<<<<< 离职 >>>>>>>> */
  'quitDetalis', 'quitChoose', 'quitInsert', 'quitPageInsert', 'quitList', 'quitEditDetail', 'quitUpadte', 'quitExport', 'quitImport',
  'quitExportNewAdd', 'quitDownloadTemplate',
  /* <<<<<<<< 离职 >>>>>>>> */
  /* <<<<<<<< 薪资 >>>>>>>> */
  'salaryChoose', 'salaryList', 'salaryDelete', 'salaryDetail', 'salaryInsert', 'salaryPageInsert', 'salaryInfo', 'salaryExport',
  'salaryImport', 'salarySelectedExport', 'salaryDownloadTemplate',
  /* <<<<<<<< 薪资 >>>>>>>> */
  /* <<<<<<<< 异动 >>>>>>>> */
  'jobChangeList', 'jobChangeAddList', 'jobChangeAddInfo', 'jobChangeBeforeInfo', 'jobChangeAddSubmit', 'jobChangeEdit', 'exportList',
  'jobChageUpload', 'jobChangeImport', 'jobChangeTemplate',
  /* <<<<<<<< 异动 >>>>>>>> */
  /* <<<<<<<< 公司维护 >>>>>>>> */
  'companyMaintainAdd', 'companyMaintainDelete', 'companyImport', 'exportExcel', 'companyTemplateDownload', 'companyMaintainInfo',
  'queryCityList', 'queryCompanyList', 'queryInsuredList', 'companyInsuredProjectList', 'companyInsuredEntityList', 'companyMaintainUpdate',
  /* <<<<<<<< 公司维护 >>>>>>>> */
  /* <<<<<<<< 个人参保信息 >>>>>>>> */
  'personalInsuredInfoPage', 'personalInsuredInfoDetail', 'personalInsuredExport',
  /* <<<<<<<< 个人参保信息 >>>>>>>> */
  /* <<<<<<<< 个人参保补缴 >>>>>>>> */
  'supplementList', 'supplementNewList', 'supplementDelete', 'supplementDetail', 'supplementNewAdd', 'supplementEditQuery',
  'supplementEditSubmit', 'supplementImport', 'supplementExport', 'supplementTemplate',
  /* <<<<<<<< 个人参保补缴 >>>>>>>> */
  /* <<<<<<<< 个人参保维护 >>>>>>>> */
  'maintainList', 'maintainNewList', 'maintainDelete', 'maintainImport', 'maintainImportInsured', 'maintainExport', 'maintainTemplate',
  'maintainQuery', 'maintainNewAdd', 'maintainEditQuery', 'maintainEdit',
  /* <<<<<<<< 个人参保维护 >>>>>>>> */
  /* <<<<<<<< 组合报表 >>>>>>>> */
  'combinedProjectList', 'combinedEntityList', 'combinedOrganizeList', 'combinedQueryList', 'combinedExportExcel', 'combinedExportFile',
  'combinedQueryReportName', 'combinedQueryReportData'
  /* <<<<<<<< 组合报表 >>>>>>>> */
]

type ServerHXH = {
  [api in (typeof ServerList)[number]]: Api
}

// eslint-disable-next-line no-undef
export default ServerHXH
