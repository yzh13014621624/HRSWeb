/*
 * @description: 系统管理-组织管理
 * @author: qiuyang
 * @lastEditors: qiuyang
 * @Date: 2020-05-15 15:00:22
 * @LastEditTime: 2020-05-18 10:16:53
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  SystemDelOrganize: { // 删除组织
    type: 'post',
    path: '/EmployeeOrganize/delOrganize'
  },
  SystemExportTemplate: { // 组织管理导入模板
    type: 'get',
    path: '/EmployeeOrganize/exportTemplate'
  },
  SystemImportOrganize: { // 组织导入
    type: 'post',
    path: '/EmployeeOrganize/importOrganize'
  },
  SystemAddOrganize: { // 组织新增
    type: 'post',
    path: '/EmployeeOrganize/addOrganize'
  },
  SystemUpdateOrganize: { // 修改组织
    type: 'post',
    path: '/EmployeeOrganize/updateOrganize'
  }
}
