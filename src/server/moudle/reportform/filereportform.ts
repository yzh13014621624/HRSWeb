/**
 * @author maqian
 * @createTime 2019/04/25
 * @description Server Api 归档报表后台接口
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  filereportlist: { // POST 归档报表列表
    type: 'post',
    path: '/ReportArchive/queryArchiveList'
  },
  filexport: { // GET 归档报表-详情下载--实现
    type: 'post',
    path: '/ReportArchive/getArchiveDetailExcel'
  },
  filereportDetail: {
    type: 'post', // POST 归档中心-详情查看--实现
    path: '/ReportArchive/getReportFrom'
  }
}
