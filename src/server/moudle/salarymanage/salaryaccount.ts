/*
 * @description: 薪酬核算-后台接口
 * @author: maqian
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: maqian
 * @Date: 2019-09-24 16:53:35
 * @LastEditTime: 2019-10-17 18:59:33
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
export default {
  // 税前
  BeforeTaxList: { // 税前列表 （薪酬核算税前列表参数查询）
    type: 'post',
    path: '/SalaryAccounting/getList'
  },
  BeforeTaxDetail: { // 税前详情 （税前薪资->详情（根据序列号查看详情）
    type: 'get',
    path: '/SalaryAccounting/selectContentById'
  },
  BeforeTaxInsured: { // 税前核算 （税前薪资->税前核算）
    type: 'get',
    path: '/SalaryAccounting/salaryCalculation'
  },
  BeforeTaxInsuredLoad: { // 税前核算数据下载
    type: 'post',
    path: '/SalaryAccounting/downloadSalaryCalculation'
  },
  BeforeClose: { // 税前关账 （关账并归档）
    type: 'get',
    path: '/SalaryAccounting/closeAndFileAccounts'
  },
  BeforReturnClose: { // 税前撤回关账（撤回关账）
    type: 'get',
    path: '/SalaryAccounting/recallCloseAndFileAccounts'
  },
  /**
   ******************个税********************
   * **/
  PersonalTaxDetail: { // 个税详情
    type: 'get',
    path: '/PersTaxAccounting/getAccountingInfo'
  },
  PersonalTaxInsured: { // 个税核算
    type: 'get',
    path: '/PersTaxAccounting/persBusinessAccounting'
  },
  PersonalReturnClose: { // 个税撤回关账
    type: 'get',
    path: '/PersTaxAccounting/recallCloseCounts'
  },
  PersonalExport: { // 个税核算（导出）
    type: 'get',
    path: '/PersTaxAccounting/exportAccounting'
  },
  exportToBeMaintainedUser: { // 待维护居民所得税员工（导出）
    type: 'get',
    path: '/PersTaxAccounting/exportToBeMaintainedUser'
  },
  PersonalImport: { // 个税导入 （待维护居民所得税员工（导入））
    type: 'post',
    path: '/PersTaxAccounting/importToBeMaintainedUser'
  },
  /**
   ******************税后********************
   * **/
  AfterTaxDetail: { // 税后详情
    type: 'get',
    path: '/PostTaxAccounting/getAccountingDetail'
  },
  AfterTaxInsured: { // 税后核算/关账
    type: 'post',
    path: '/PostTaxAccounting/updateAccountingClose'
  },
  AfterRecallCloseStatus: { // 撤回关账
    type: 'get',
    path: '/PostTaxAccounting/recallCloseStatus'
  },
  AfterTaxLoadList: { // 薪酬核算（税后）导出（列表税后核算，关账下载）
    type: 'post',
    path: '/PostTaxAccounting/exportPostTaxAccountingList'
  },
  AfterTaxLoadDetail: { // 薪酬核算（税后）导出(详情最近一次核算/关账导出下载)
    type: 'post',
    path: '/PostTaxAccounting/exportPostTaxHistoryList'
  },
  getSalaryTemplate: { // 薪酬核算（税后）下载模板
    type: 'get',
    path: '/PostTaxAccounting/getSalaryTemplate'
  },
  /**
   ******************历史薪酬查询********************
   * **/
  HistroyList: { // 历史薪资
    type: 'post',
    path: '/SalaryHistory/getMessage'
  },
  HistoryListExport: { // 历史薪资导出
    type: 'post',
    path: '/SalaryHistory/getMessage/export'
  }
}
