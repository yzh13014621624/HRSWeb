/*
 * @description: 组合报表接口
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-04-28 14:55:39
 * @LastEditTime: 2019-05-14 10:32:20
 * @copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  combinedProjectList: { // 项目列表
    type: 'get',
    path: 'EmployeeOnboard/getProject'
  },
  combinedEntityList: { // 法人主体列表
    path: 'EmployeeOnboard/getLegalEntity'
  },
  combinedOrganizeList: { // 组织列表接口
    path: 'EmployeeOnboard/getOrganize'
  },
  combinedQueryList: { // 查询接口
    path: 'ReportFromCompose/getReportFromComposeList'
  },
  combinedExportExcel: { // 导出接口
    path: 'ReportFromCompose/exportComposeReportFrom'
  },
  combinedExportFile: { // 归档
    type: 'get',
    path: 'ReportFromCompose/updateComposeReportFrom'
  },
  combinedQueryReportName: { // 查询报表名称
    type: 'get',
    path: 'ReportArchive/getArchiveRegexName'
  },
  combinedQueryReportData: { // 查询当前月度报表是否有数据
    path: 'ReportFromCompose/queryReportFromData'
  }
}
