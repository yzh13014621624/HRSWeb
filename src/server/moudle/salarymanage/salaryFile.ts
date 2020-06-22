/*
 * @description: 薪资归档后台接口
 * @author: qiuyang
 * @lastEditors: qiuyang
 * @Date: 2019-09-27 13:35:55
 * @LastEditTime: 2019-12-06 10:47:30
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
export default {
  QueryArchiveList: { // 薪资归档-列表
    type: 'post',
    path: '/SalaryArchive/queryArchiveList'
  },
  GetArchiveInfo: { // 薪资归档-详情
    type: 'post',
    path: '/SalaryArchive/getArchiveInfo'
  },
  SalaryFileExportArchiveList: { // 薪资归档-详情
    type: 'get',
    path: '/SalaryArchive/exportArchiveList'
  }
}
