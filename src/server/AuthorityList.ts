/*
 * @description: 权限汇总
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-05-07 10:47:03
 * @LastEditTime: 2020-05-22 15:50:36
 * @copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import moudle from './authorization/index'

type RA = ReadonlyArray<string>

interface AuthorityList {
  contract: RA
  entry: RA
  quit: RA
  salary: RA
  transaction: RA
  companyInsured: RA
  Insuredaccount: RA
  parameters: RA
  personalInsured: RA
  combinedreportform: RA
  filereportform: RA
  fixedreportform: RA
  scheduling: RA
  compose: RA
  composeParam: RA
  salarypreparation: RA
  salaryaccount: RA
  salarypiece: RA
  salaryprefile: RA
  salaryparametersetting: RA
  accountManagement: RA
  legalentityManagement: RA
  organizationalManagement: RA
  roleManagement: RA
}

const authorityList: AuthorityList = moudle

export default authorityList
