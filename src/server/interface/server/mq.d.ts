/*
 * @description: 薪酬核算-后台接口
 * @author: maqian
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: maqian
 * @Date: 2019-09-28 10:20:56
 * @LastEditTime: 2019-10-10 11:00:13
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
type Api = {
  type?: string
  readonly path: string
}

declare const ServerList: [
  // 税前
  'BeforeTaxList', 'BeforeTaxDetail', 'BeforeTaxInsured',
  'BeforeTaxInsuredLoad', 'BeforeClose', 'BeforReturnClose',
  // 个税
  'PersonalTaxDetail', 'PersonalTaxInsured', 'PersonalReturnClose',
  'PersonalExport', 'exportToBeMaintainedUser', 'PersonalImport',
  // 税后
  'AfterTaxDetail', 'AfterTaxInsured', 'AfterRecallCloseStatus',
  'getSalaryTemplate', 'AfterTaxLoadList', 'AfterTaxLoadDetail',
  // 历史薪酬查询
  'HistroyList', 'HistoryListExport'
]

type ServerMQ = {
  [api in (typeof ServerList)[number]]: Api
}

// eslint-disable-next-line no-undef
export default ServerMQ
