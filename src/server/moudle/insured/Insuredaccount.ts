/**
 * @author maqian
 * @createTime 2019/04/09
 * @description Server Api 审批核算后台接口
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  insureaccoutlist: { // POST 审批核算列表
    type: 'post',
    path: '/InsuredCheck/queryInsuredCheckList'
  },
  insuredetail: { // GET 查看详情
    type: 'get',
    path: '/InsuredCheck/getInsuredCheckDetail'
  },
  insureclose: { // POST 操作关账--实现
    type: 'post',
    path: '/InsuredCheck/updateInsuredCheckClose'
  },
  insureload: { // POST 参保核算与关账导出--实现
    type: 'post',
    path: '/InsuredCheck/exportInsuredCheck'
  },
  dynamicRequest: { // POST 参保核算最近与关账动态导出--实现
    type: 'post',
    path: '/InsuredCheck/exportInsuredCheckDynamic'
  },
  timeDetail: { // POST 参保核算最近与关账动态状态返回--实现
    type: 'post',
    path: '/InsuredCheck/exportInsuredCheckState'
  },
  showChange: { // POST 查询关账时公司员工的维护情况--实现
    type: 'get',
    path: '/InsuredCheck/getCloseDefend'
  }
}
