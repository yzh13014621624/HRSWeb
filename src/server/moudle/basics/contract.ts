/**
 * @author maqian
 * @createTime 2019/04/09
 * @description Server Api 后台接口
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  // 初签
  contractfirstlist: { // POST 员工初签合同列表
    type: 'post',
    path: '/EmployeeContracts/queryContractFirstList'
  },
  contractExport: { // POST 初签合同信息导出
    type: 'post',
    path: '/EmployeeContracts/exportContractFirstInfo'
  },
  contractMoudleLoad: { // GET 合同导入模板下载
    type: 'get',
    path: '/EmployeeContracts/exportContractInfoTem'
  },
  linkageTryMonth: { // 试用期联动，返回试用期列表
    type: 'post',
    path: '/EmployeeContracts/linkageTryMonth'
  },
  // 续签
  contRemewList: { // POST 员工续签合同列表
    type: 'post',
    path: '/EmployeeContracts/queryContractRenewList'
  },
  contRenewExport: { // POST 续签合同信息导出
    type: 'post',
    path: '/EmployeeContracts/exportContractRenewInfo'
  },
  // 试用期
  contractrylist: { // POST 员工试用期合同列表
    type: 'post',
    path: '/EmployeeContracts/queryContractTryList'
  },
  tryInfo: { // GET 试用期员工合同查看-实现
    type: 'get',
    path: '/EmployeeContracts/getTryContractInfo'
  },
  tryUpdate: { // POST 修改合同到期时间-实现
    type: 'post',
    path: '/EmployeeContracts/updateTryContract'
  },
  tryExport: { // POST 试用期合同信息导出
    type: 'post',
    path: '/EmployeeContracts/exportContractTryInfo'
  },
  // 公共
  contraImport: { // 合同信息导入
    type: 'post',
    path: '/EmployeeContracts/importContractInfo'
  },
  chooselist: { // POST 选择员工列表
    type: 'post',
    path: '/EmployeeContracts/queryChooseList'
  },
  contractInfo: { // POST 员工合同详情
    type: 'get',
    path: '/EmployeeContracts/getContractInfo'
  },
  contractAdd: { // POST 新增员工合同
    type: 'post',
    path: '/EmployeeContracts/insertContractInfo'
  },
  contractDetial: { // POST 编辑员工合同
    type: 'post',
    path: '/EmployeeContracts/updateContractInfo'
  },
  contractDel: { // POST 删除员工合同
    type: 'post',
    path: '/EmployeeContracts/deleteContractInfo'
  },
  contractTypeList: { // GET 合同类型列表-实现
    type: 'get',
    path: '/EmployeeContracts/queryContractTypeList'
  },
  contractAddInfo: { // GET 新增员工合同页面(新增页面i详情)-实现
    type: 'get',
    path: '/EmployeeContracts/insertContractView'
  },
  insertOssUpload: { // POST 上传OSS多张合同图片接口
    type: 'post',
    path: '/EmployeeContracts/insertOssUpload'
  },
  updateContractPdf: { // POST 上传 pdf 文件到 OSS
    type: 'post',
    path: '/EmployeeContracts/updateContractPdf'
  },
  chooseExport: { // POST 选择员工数据导出
    type: 'post',
    path: '/EmployeeContracts/exportContractChooseInfo'
  },
  // 电子合同
  downElcContract: { // 下载电子合同（返回 OSS 路径）
    type: 'get',
    path: '/EmployeeContracts/downElcContract'
  },
  getContractDetail: { // 电子合同详情接口
    type: 'get',
    path: '/EmployeeContracts/getContractDetail'
  },
  platSign: { // 审核通过，运营商（公司）签署合同--实现
    type: 'get',
    path: '/EmployeeContracts/platSign'
  },
  rejectAndReSign: { // 驳回并发起重签
    type: 'get',
    path: '/EmployeeContracts/rejectAndReSign'
  },
  handleRequrst: { // 手动发送电子签
    type: 'get',
    path: '/EmployeeContracts/handSend'
  },
  insertOssPdfUpload: { // 合同上传 pdf 文件
    type: 'get',
    path: '/EmployeeContracts/getUrlByUrl'
  }
}
