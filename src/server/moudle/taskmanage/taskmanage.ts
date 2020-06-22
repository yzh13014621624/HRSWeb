/*
 * @description:任务管理
 * @author: yanzihao
 * @lastEditors: yanzihao
 * @Date: 2019-11-21 09:51:46
 * @LastEditTime: 2019-11-26 13:41:55
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  taskDownExcel: { // 下载文件--实现
    type: 'post',
    path: '/hrsExcelNotes/downExcel'
  },
  taskQueryList: { // 查询excel任务列表--实现
    type: 'post',
    path: '/hrsExcelNotes/queryList'
  },
  count: { // 统计excel任务列表数量
    type: 'post',
    path: '/hrsExcelNotes/count'
  }
}
