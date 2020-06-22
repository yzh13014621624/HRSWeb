/**
 * @author lixinying
 * @createTime 2019/04/10
 * @description Server Api 后台接口
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  salaryChoose: {
    type: 'post',
    path: 'employeeSalary/getChooseList' // 选择员工列表-实现.
  },
  salaryList: {
    type: 'post',
    path: 'employeeSalary/querySalaryList' // 员工薪资列表-实现
  },
  salaryDelete: {
    type: 'post',
    path: 'employeeSalary/deleteSalaryInfo' // 薪资信息删除-实现.
  },
  salaryDetail: {
    type: 'get',
    path: 'employeeSalary/getSalaryInfo' // 获取薪资详情-实现.
  },
  salaryInsert: {
    type: 'post',
    path: 'employeeSalary/insertSalaryInfo' // 薪资信息新增-实现.
  },
  salaryPageInsert: {
    type: 'get',
    path: 'employeeSalary/insertSalaryView' // 薪资新增页面-实现.
  },
  salaryInfo: {
    type: 'post',
    path: 'employeeSalary/updateSalaryInfo' // 薪资信息编辑-实现.
  },
  salaryExport: { // 薪资导出
    path: '/employeeSalary/exportSalaryInfo'
  },
  salaryImport: { // 薪资导入
    path: 'employeeSalary/importSalaryInfo'
  },
  salaryImportAndModify: { // 薪资导入修改
    path: 'employeeSalary/importUpdateSalary'
  },
  salarySelectedExport: { // 薪资选择员工导出
    path: 'employeeSalary/exportSalaryChooseInfo'
  },
  salaryDownloadTemplate: { // 薪资导入模板下载
    type: 'get',
    path: 'employeeSalary/exportSalaryInfoTem'
  }
}
