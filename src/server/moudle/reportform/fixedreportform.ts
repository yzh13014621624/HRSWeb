/**
 * @author maqian
 * @createTime 2019/04/25
 * @description Server Api 固定报表后台接口
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  fixedreportlist: { // post 固定报表-获取所有固定报表生产记录--实现
    type: 'post',
    path: '/ReportFixed/getAllFixedLog'
  },
  fixreportdetail: { // POST 固定表报-详情查看--实现
    type: 'post',
    path: '/ReportFixed/getReportFromFixedList'
  },
  detailExport: { // POST 固定报表-详情下载--实现
    type: 'post',
    path: '/ReportFixed/exportFixedReportFrom'
  },
  generateReport: { // POST 固定报表-生成报表
    type: 'post',
    path: '/ReportFixed/generateReports'
  },
  reportsModal: { // GET 固定报表-判断本月是否生成数据（弹窗）
    type: 'get',
    path: '/ReportFixed/generateReports'
  },
  getSuccess: { // GET 固定报表-查询是否生成成功
    type: 'get',
    path: '/ReportFixed/getSuccessInfo'
  }
}
