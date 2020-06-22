/*
 * @description: 角色管理
 * @author: qiuyang
 * @lastEditors: qiuyang
 * @Date: 2020-05-08 18:33:03
 * @LastEditTime: 2020-06-08 16:42:48
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
export default {
  SystemQueryRoleList: { // 角色管理列表
    type: 'post',
    path: '/user/queryRoleList'
  },
  SystemInsertRole: { // 角色新增
    type: 'post',
    path: '/user/insertRole'
  },
  SystemEditRole: { // 角色修改
    type: 'post',
    path: '/user/editRole'
  },
  SystemEeleteRole: { // 角色删除
    type: 'get',
    path: '/user/deleteRole'
  },
  SystemGetAuthDetails: { // 角色权限配置详情
    type: 'get',
    path: '/user/getAuthDetails'
  },
  SystemGetAuthCode: { // 角色权限原子
    type: 'get',
    path: '/user/getAuthCode'
  },
  SystemGrantPerms: { // 为角色分配权限
    type: 'post',
    path: '/user/grantPerms'
  }
}
