/*
 * @description: 接口定义文件
 * @author: zhousong
 * @lastEditors: zhousong
 * @Date: 2019-08-29 14:15:23
 * @LastEditTime: 2020-04-29 17:43:44
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
type Api = {
  type?: string
  readonly path: string
}

declare const ServerList: [
  /* <<<<<<<< 出勤参数管理 >>>>>>>> */
  'querySchedulingList', 'updateScheduling', 'insertScheduling', 'deleteScheduling', 'sortSchedulingList', 'queryAttendParamList', 'getAttendParamInit',
  'insertAttendParam', 'getAttendParamInfo', 'ApiExportUserList', 'ApiExportScheduleChooseList', 'getGraceTimeInfo', 'updateGraceTime', 'getHemaAttendanceList',
  'updateAttendFace', 'attendStatus', 'setAttendStatus', 'exportHemaAttendList',
  /* <<<<<<<< 参数维护 >>>>>>>> */
  /* <<<<<<<< 不参与考勤人员设置 >>>>>>>> */
  'queryNoAttendFace', 'addNoAttendFace',
]

type ServerZS = {
  [api in (typeof ServerList)[number]]: Api
}

// eslint-disable-next-line no-undef
export default ServerZS
