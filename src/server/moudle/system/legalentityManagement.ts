/*
 * @description: 法人主体接口文件
 * @author: yanzihao
 * @lastEditors: yanzihao
 * @Date: 2020-05-08 15:09:41
 * @LastEditTime: 2020-05-09 10:34:56
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
export default {
  LegalEntityAddEntity: { // 新增
    type: 'post',
    path: '/LegalEntity/addEntity'
  },
  LegalEntityDelete: { // 删除
    type: 'post',
    path: '/LegalEntity/delete'
  },
  LegalEntityEditEntity: { // 编辑
    type: 'post',
    path: '/LegalEntity/editEntity'
  },
  LegalEntityExportList: { // 导出
    type: 'post',
    path: '/LegalEntity/exportList'
  },
  LegalEntityExportTem: { // 导入模板下载
    type: 'get',
    path: '/LegalEntity/exportTem'
  },
  LegalEntityGetDetail: { // 详情
    type: 'post',
    path: '/LegalEntity/getDetail'
  },
  LegalEntityGetList: { // 列表
    type: 'post',
    path: '/LegalEntity/getList'
  },
  LegalEntityImportList: { // 导入
    type: 'post',
    path: '/LegalEntity/importList'
  },
  LegalEntityGetCityList: { // 城市列表
    type: 'get',
    path: '/LegalEntity/getCityList'
  }
}
