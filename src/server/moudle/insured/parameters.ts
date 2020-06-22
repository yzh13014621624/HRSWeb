/**
 * @author minjie
 * @createTime 2019/04/09
 * @description Server Api 后台接口
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  paramsStandardQuery: {
    type: 'post',
    path: 'InsuredChanges/queryInsuredList' // 参保标准列表
  },
  paramsStandardAdd: {
    type: 'post',
    path: 'InsuredChanges/insertInsuredInfo' // 参保标准新增
  },
  paramsStandardDetail: {
    type: 'get',
    path: 'InsuredChanges/getInsuredInfo' // 参保标准详情
  },
  paramsStandardUpdate: {
    type: 'post',
    path: 'InsuredChanges/UpdateInsuredInfo' // 参保标准修改
  },
  paramsStandardRemove: {
    type: 'post',
    path: 'InsuredChanges/deleteInsured' // 参保标准删除
  },
  paramsStandardInsuredRule: {
    type: 'get',
    path: 'InsuredParameter/getInsuredRule' // 查询参保规则--实现
  },
  paramsStandardImport: { // 参保标准数据导入
    type: 'post',
    path: 'InsuredChanges/importInsuredList'
  },
  paramsStandardExport: { // 参保标准导出
    type: 'post',
    path: 'InsuredChanges/exportInsured'
  },
  paramsStandardExportTemplate: { // 参保标准维护模板下载
    type: 'get',
    path: 'InsuredChanges/exportTemplate'
  },
  paramsStandardCheckName: { // 验证名称是否重复
    type: 'post',
    path: 'InsuredCompanyMaintain/queryInsuredList'
  },
  paramsStandardInsuredLogList: { // 参保标准日志列表
    type: 'get',
    path: '/InsuredChanges/getInsuredLogList'
  },
  cityQuery: { // 查询城市参保标准--实现
    type: 'post',
    path: 'InsuredParameter/queryInsuredCityList'
  },
  cityAdd: { // 添加参保城市标准--实现
    type: 'post',
    path: 'InsuredParameter/insertInsuredCityInfo'
  },
  cityRemove: { // 删除城市参保标准(可批量删除)--实现
    type: 'post',
    path: 'InsuredParameter/deleteInsuredCityList'
  },
  cityUpadte: { // 修改城市参保标准--实现
    type: 'post',
    path: 'InsuredParameter/updateInsuredCity'
  },
  cityDetail: { // 查询城市参保详情--实现
    type: 'get',
    path: 'InsuredParameter/getInsuredCityDetail'
  },
  cityNames: { // 查询城市参保名--实现
    type: 'get',
    path: 'InsuredParameter/getInsuredCityName'
  },
  cityImport: { // 城市参保导入
    type: 'post',
    path: 'InsuredParameter/importInsuredCityInfo'
  },
  cityExport: { // 城市参保导出
    type: 'post',
    path: 'InsuredParameter/exportInsuredCity'
  },
  cityExportTemplate: { // 城市参保模板下载--实现
    type: 'get',
    path: 'InsuredParameter/exportInsuredCityTem'
  },
  cityInsuredCityDetailLog: { // 查询城市参保详情日志--实现
    type: 'get',
    path: '/InsuredParameter/getInsuredCityDetailLog'
  }
}
