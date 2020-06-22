/*
 * @description: 排班-后台接口
 * @author: songliubiao
 * @lastEditors: zhousong
 * @Date: 2019-09-26 15:02:52
 * @LastEditTime: 2019-11-06 17:00:24
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  ApiQueryScheduleList: { // POST 排班列表
    type: 'post',
    path: '/AttendSchedule/queryScheduleList'
  },
  ApiDeleteScheduleInfo: { // POST 排班删除
    type: 'post',
    path: '/AttendSchedule/deleteScheduleInfo'
  },
  ApiScheduleChooseList: { // POST 新增排班-选择列表
    type: 'post',
    path: '/AttendSchedule/scheduleChooseList'
  },
  ApiScheduleInsertInfo: { // GET 新增排班-初始化值
    type: 'get',
    path: '/AttendSchedule/scheduleInsertView'
  },
  ApiInsertSchedule: { // POST 新增排班
    type: 'post',
    path: '/AttendSchedule/insertSchedule'
  },
  ApiGetScheduleInfo: { // POST 排班详情
    type: 'get',
    path: '/AttendSchedule/getScheduleInfo'
  },
  ApiUpdateSchedule: { // POST 排班编辑
    type: 'post',
    path: '/AttendSchedule/updateSchedule'
  },
  ApiImportScheduleTem: { // POST 排班模板导出
    type: 'get',
    path: '/AttendSchedule/importScheduleTem'
  },
  ApiExportSchedule: { // POST 员工排班导出
    type: 'post',
    path: '/AttendSchedule/exportSchedule'
  },
  ApiExportScheduleChooseList: { // POST 员工列表导出
    type: 'post',
    path: '/AttendSchedule/exportChooseList'
  },
  ApiImportSchedule: { // POST 员工排班导入
    type: 'post',
    path: '/AttendSchedule/importSchedule'
  }
}
