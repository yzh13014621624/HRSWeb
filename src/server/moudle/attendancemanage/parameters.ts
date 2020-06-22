/*
 * @description: 参数维护-接口
 * @author: zhousong
 * @lastEditors: zhousong
 * @Date: 2019-09-27 11:12:57
 * @LastEditTime: 2020-04-29 17:41:59
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  // 其他参数部分接口
  querySchedulingList: {
    type: 'get',
    path: '/OtherParam/querySchedulingList'
  },
  updateScheduling: {
    type: 'post',
    path: '/OtherParam/updateScheduling'
  },
  insertScheduling: {
    type: 'post',
    path: '/OtherParam/insertScheduling'
  },
  deleteScheduling: {
    type: 'get',
    path: '/OtherParam/deleteScheduling'
  },
  sortSchedulingList: {
    type: 'post',
    path: '/OtherParam/sortSchedulingList'
  },
  // 出勤参数部分接口
  queryAttendParamList: {
    type: 'post',
    path: '/AttendParam/queryAttendParamList'
  },
  getAttendParamInit: {
    type: 'get',
    path: '/AttendParam/getAttendParamInit'
  },
  insertAttendParam: {
    type: 'post',
    path: '/AttendParam/insertAttendParam'
  },
  updateAttendParam: {
    type: 'post',
    path: '/AttendParam/updateAttendParam'
  },
  getAttendParamInfo: {
    type: 'get',
    path: '/AttendParam/getAttendParamInfo'
  },
  getGraceTimeInfo: { // 考勤参数宽限时间详情
    type: 'get',
    path: '/OtherParam/getGraceTimeInfo'
  },
  updateGraceTime: { // 考勤参数宽限时间编辑
    type: 'post',
    path: '/OtherParam/updateGraceTime'
  },
  queryNoAttendFace: { // 不参与考勤人员-列表
    type: 'post',
    path: '/noAttendance/queryNoAttendFace'
  },
  addNoAttendFace: { // 不参与考勤人员(noAttend=2:新增，1：删除)
    type: 'get',
    path: '/noAttendance/addNoAttendFace'
  }
}
