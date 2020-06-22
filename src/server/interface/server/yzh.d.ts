/*
 * @description: 接口定义文件
 * @author: yanzihao
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: yanzihao
 * @Date: 2019-07-01 13:52:14
 * @LastEditTime: 2020-05-08 17:55:39
 * @Copyright: Copyright  ?  2019  Shanghai  Shangjia  Logistics  Co.,  Ltd.  All  rights  reserved.
 */
type Api = {
  type?: string
  readonly path: string
}

declare const ServerList: [
  /* <<<<<<<< 参数维护 >>>>>>>> */
  'getParameterInfo', 'getParameterList', 'insertInsuredInfo', 'getContractCostList',
  'updateContractCost', 'getHistoryWageStandardList', 'getWageStandardList', 'updateWageStandard',
  'getWageStandardInfo', 'importParameter', 'exportParameter', 'exportParameterTem',
  /* <<<<<<<< 任务列表 >>>>>>>> */
  'taskDownExcel', 'taskQueryList', 'count',
  /* <<<<<<<< 法人主体管理 >>>>>>>> */
  'LegalEntityAddEntity', 'LegalEntityDelete', 'LegalEntityEditEntity', 'LegalEntityExportList', 'LegalEntityExportTem',
  'LegalEntityGetDetail', 'LegalEntityGetList', 'LegalEntityImportList', 'LegalEntityGetCityList'
]

type ServerYZH = {
  [api in (typeof ServerList)[number]]: Api
}

// eslint-disable-next-line no-undef
export default ServerYZH
