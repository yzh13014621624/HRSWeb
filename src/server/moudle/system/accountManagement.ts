/*
 * @description: 账号管理
 * @author: qiuyang
 * @lastEditors: qiuyang
 * @Date: 2020-05-07 17:44:48
 * @LastEditTime: 2020-05-12 14:43:52
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
export default {
  SystemQueryUserList: { // 账号管理列表
    type: 'post',
    path: '/user/queryUserList'
  },
  SystemDeleteAdminUser: { // 账号管理-删除用户
    type: 'get',
    path: '/user/deleteAdminUser'
  },
  SystemEnable: { // 账号管理-启用/停用
    type: 'get',
    path: '/user/enable'
  },
  SystemGetAdminDetails: { // 账号管理-用户详情
    type: 'get',
    path: '/user/getAdminDetails'
  },
  SystemInsertUser: { // 账号管理-新增用户
    type: 'post',
    path: '/user/insertUser'
  },
  SystemResetPassword: { // 账号管理-修改密码
    type: 'post',
    path: '/user/resetPassword'
  },
  SystemUpdUser: { // 账号管理-修改用户
    type: 'post',
    path: '/user/updUser'
  },
  SystemGrantRoles: { // 给用户分配角色(账号管理角色选择与编辑)
    type: 'post',
    path: '/user/grantRoles'
  }
}
