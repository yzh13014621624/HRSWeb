/*
 * @description: 参保管理模块 - 个人参保 接口
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-04-19 11:58:45
 * @LastEditTime: 2019-07-09 14:53:04
 * @copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  /* 个人参保信息 */
  personalInsuredInfoPage: { // 个人参保信息列表
    path: 'InsuredInformation/queryInfofmationList'
  },
  personalInsuredInfoDetail: { // 个人参保信息详情
    type: 'get',
    path: '/InsuredInformation/getInformationView'
  },
  personalInsuredExport: { // 个人参保信息列表导出
    path: 'InsuredInformation/exportInfoMation'
  },
  /* 个人参保补缴 */
  supplementList: { // 补缴信息列表
    path: 'InsuredPaysInformation/queryInsuredList'
  },
  supplementNewList: { // 选择补缴员工列表
    path: 'InsuredPaysInformation/getChooseList'
  },
  supplementDelete: { // 补缴列表删除
    path: 'InsuredPaysInformation/delMaintainInfo'
  },
  supplementDetail: { // 新增个人补缴详情查询
    type: 'get',
    path: 'InsuredPaysInformation/getPersonalInfo'
  },
  supplementNewAdd: { // 新增个人补缴提交接口
    path: 'InsuredPaysInformation/insertMaintainInfo'
  },
  supplementEditQuery: { // 编辑个人补缴详情查询
    type: 'get',
    path: 'InsuredPaysInformation/getPaysInfo'
  },
  supplementEditSubmit: { // 编辑个人补缴提交
    path: 'InsuredPaysInformation/updatePaysInfo'
  },
  supplementImport: { // 个人补缴导入
    path: 'InsuredPaysInformation/importContractInfo'
  },
  supplementExport: { // 个人补缴列表导出
    path: 'InsuredPaysInformation/exportPaysInfo'
  },
  supplementTemplate: { // 个人补缴导入模板下载
    type: 'get',
    path: 'InsuredPaysInformation/exportPaysInformation'
  },
  /* 个人参保维护 */
  maintainList: { // 参保维护列表
    path: 'InsuredPersonalMaintain/queryInsuredList'
  },
  maintainNewList: { // 选择维护员工列表
    path: 'InsuredPersonalMaintain/chooseList'
  },
  maintainDelete: { // 参保维护删除
    path: 'InsuredPersonalMaintain/delMaintainInfo'
  },
  maintainImport: { // 参保维护列表导入(新增)
    path: 'InsuredPersonalMaintain/importContractInfo'
  },
  maintainImportInsured: { // 个人参保维护修改导入（修改）
    type: 'post',
    path: 'InsuredPersonalMaintain/importUpdInsuredInfo'
  },
  maintainExport: { // 参保维护列表导出
    path: 'InsuredPersonalMaintain/exportMaintainInfo'
  },
  maintainTemplate: { // 参保维护导入模板下载
    type: 'get',
    path: 'InsuredPersonalMaintain/exportMaintainInfoTem'
  },
  maintainQuery: { // 新增参保维护查询
    type: 'get',
    path: 'InsuredPersonalMaintain/getPersonalInfo'
  },
  maintainNewAdd: { // 新增参保维护提交接口
    path: 'InsuredPersonalMaintain/insertMaintainInfo'
  },
  maintainEditQuery: { // 编辑参保维护查询
    type: 'get',
    path: 'InsuredPersonalMaintain/getMaintainInfo'
  },
  maintainEdit: { // 编辑参保维护提交接口
    path: 'InsuredPersonalMaintain/updateMaintainInfo'
  }
}
