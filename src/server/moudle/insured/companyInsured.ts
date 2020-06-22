/**
 * @author lixinying
 * @createTime 2019/04/23
 * @description Server Api 公司参保维护后台接口
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  companyMaintainAdd: {
    type: 'post',
    path: 'InsuredCompanyMaintain/InsertCompanyMaintain' // 新增公司参保维护
  },
  companyMaintainDelete: {
    type: 'post',
    path: 'InsuredCompanyMaintain/deleteCompanyMaintain' // 公司参保维护删除
  },
  companyImport: { // 公司维护导入
    path: 'InsuredCompanyMaintain/importCompanyMain'
  },
  exportExcel: {
    type: 'post',
    path: 'InsuredCompanyMaintain/exportExcel' // 公司参保维护导出
  },
  companyTemplateDownload: {
    type: 'get',
    path: 'InsuredCompanyMaintain/exportCompanyMain' // 公司参保维护模板下载
  },
  companyMaintainInfo: {
    type: 'get',
    path: 'InsuredCompanyMaintain/getCompanyMaintainInfo' // 公司参保维护详情
  },
  queryCityList: {
    type: 'post',
    path: 'InsuredCompanyMaintain/queryCityList' // 参保城市列表
  },
  queryCompanyList: {
    type: 'post',
    path: 'InsuredCompanyMaintain/queryCompanyMaintainList' // 公司参保维护列表
  },
  queryInsuredList: {
    type: 'post',
    path: 'InsuredCompanyMaintain/queryInsuredList' // 参保标准列表
  },
  companyInsuredProjectList: { // 项目列表
    type: 'get',
    path: 'EmployeeOnboard/getProject'
  },
  companyInsuredEntityList: { // 法人主体列表
    path: 'EmployeeOnboard/getLegalEntity'
  },
  companyMaintainUpdate: {
    type: 'post',
    path: 'InsuredCompanyMaintain/updateCompanyMaintain' // 公司参保维护修改
  }
}
