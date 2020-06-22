/*
 * @description: 参数维护接口文件
 * @author: yanzihao
 * @lastEditors: yanzihao
 * @Date: 2019-09-25 16:25:05
 * @LastEditTime: 2019-10-17 16:18:56
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  getContractCostList: { // 项目合同费用设置-列表
    type: 'post',
    path: '/salaryParameter/getContractCostList'
  },
  updateContractCost: { // 项目合同费用设置-编辑
    type: 'post',
    path: '/salaryParameter/updateContractCost'
  },
  getHistoryWageStandardList: { // 工资标准-历史列表
    type: 'post',
    path: '/salaryParameter/getHistoryWageStandardList'
  },
  getWageStandardList: { // 工资标准-列表
    type: 'post',
    path: '/salaryParameter/getWageStandardList'
  },
  updateWageStandard: { // 工资标准-编辑
    type: 'post',
    path: '/salaryParameter/updateWageStandard'
  },
  getWageStandardInfo: { // 工资标准-详情
    type: 'get',
    path: '/salaryParameter/getWageStandardInfo'
  },
  getParameterInfo: { // 计件参数-详情
    type: 'get',
    path: '/pieceworkParameter/getParameterInfo'
  },
  getParameterList: { // 计件参数-列表
    type: 'post',
    path: '/pieceworkParameter/getParameterList'
  },
  insertInsuredInfo: { // 计件参数-新增/修改
    type: 'post',
    path: '/pieceworkParameter/insertInsuredInfo'
  },
  importParameter: { // 计件参数-导入
    type: 'post',
    path: '/pieceworkParameter/v1/importParameter'
  },
  exportParameter: { // 计件参数-导出
    type: 'post',
    path: '/pieceworkParameter/v1/exportParameter'
  },
  exportParameterTem: { // 计件参数-导入模板下载
    type: 'get',
    path: '/pieceworkParameter/v1/exportParameterTem'
  }
}
