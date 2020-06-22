/*
 * @description: 考勤-后台接口
 * @author: songliubiao
 * @lastEditors: songliubiao
 * @Date: 2019-09-19 14:52:39
 * @LastEditTime: 2020-03-27 17:43:09
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
export default {
  ApiGetChooseList: { // POST 新增考勤-选择列表
    type: 'post',
    path: '/Attendance/getChooseList'
  },
  ApiGetAttendParamInit: { // POST 新增考勤-初始化值
    type: 'post',
    path: '/Attendance/getAttendParamInit'
  },
  ApiGetAttendList: { // POST 考勤列表
    type: 'post',
    path: '/Attendance/attendList'
  },
  exportAddendTem: { // 下载导入模板
    type: 'get',
    path: '/Attendance/exportAddendTem'
  },
  ApiImportAttendList: { // 员工考勤导入
    type: 'post',
    path: '/Attendance/importAttendList'
  },
  ApiExportAttendList: { // 员工考勤导出
    type: 'post',
    path: '/Attendance/exportAttendList'
  },
  ApiExportUserList: { // 员工列表导出
    type: 'post',
    path: '/Attendance/exportUserList'
  },
  addAttend: { // 新增考勤
    type: 'post',
    path: '/Attendance/addAttend'
  },
  updateAttend: { // 编辑考勤
    type: 'post',
    path: '/Attendance/updateAttend'
  },
  deleteAttend: { // 删除考勤
    type: 'post',
    path: '/Attendance/deleteAttend'
  },
  getAttendParamDetail: { // 员工考勤详情
    type: 'get',
    path: '/Attendance/getAttendParamDetail'
  },
  getAttendSystemDetail: { // 考勤制度对应数据
    type: 'get',
    path: '/Attendance/getAttendSystemDetail'
  },
  getHemaAttendanceList: { // 盒马考勤列表
    type: 'post',
    path: '/HemaAttendance/getHemaAttendanceList'
  },
  updateAttendFace: { // 人脸打卡-员工考勤编辑
    type: 'post',
    path: '/Attendance/updateAttendFace'
  },
  attendStatus: { // 考勤审核-审核状态
    type: 'get',
    path: '/Attendance/attendStatus'
  },
  setAttendStatus: { // 考勤数据审核
    type: 'get',
    path: '/Attendance/setAttendStatus'
  },
  exportHemaAttendList: { // 盒马导出
    type: 'post',
    path: '/HemaAttendance/exportHemaAttendList'
  }
}
