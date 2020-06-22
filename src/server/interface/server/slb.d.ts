/*
 * @description: songliubiao 接口定义文件
 * @author: songliubiao
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: zhousong
 * @Date: 2019-07-01 11:26:10
 * @LastEditTime: 2019-10-22 11:03:25
 * @Copyright: Copyright  ?  2019  Shanghai  Shangjia  Logistics  Co.,  Ltd.  All  rights  reserved.
 */
type Api = {
  type?: string
  readonly path: string
}

declare const ServerList: [
  /* <<<<<<<< 考勤管理模块 >>>>>>>> */
  'ApiQueryScheduleList', 'ApiDeleteScheduleInfo', 'ApiScheduleChooseList', 'ApiScheduleInsertInfo', 'ApiInsertSchedule', 'ApiUpdateSchedule',
  /* <<<<<<<< 考勤管理模块 >>>>>>>> */
  'ApiGetAttendList', 'addAttend', 'getAttendParamDetail', 'updateAttend', 'getAttendSystemDetail', 'deleteAttend', 'exportAddendTem', 'ApiExportAttendList'
]

type ServerSLB = {
  [api in (typeof ServerList)[number]]: Api
}

// eslint-disable-next-line no-undef
export default ServerSLB
