/*
 * @description: 角色管理
 * @author: qiuyang
 * @lastEditors: qiuyang
 * @Date: 2020-05-08 17:50:13
 * @LastEditTime: 2020-06-12 11:17:13
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import Loadable from '../../loadable'

export default [
  {
    path: '/home/roleManagement',
    title: '角色管理',
    exact: true,
    key: 'HRS000600020000',
    level: 2, // 等级
    index: 2, // 左侧菜单显示的顺序
    parent: 'HRS000600000000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "salarymanage" */ '@pages/main/system/roleManagement'))
  },
  {
    path: '/home/authConfig',
    title: '权限配置',
    exact: true,
    key: 'HRS000600020004',
    level: 3, // 等级
    parent: 'HRS000600020000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "salarymanage" */ '@pages/main/system/roleManagement/authConfig/index'))
  },
  {
    path: '/home/authConfig/:arid',
    title: '角色详情',
    exact: true,
    key: 'HRS000600020004',
    level: 3, // 等级
    parent: 'HRS000600020000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "salarymanage" */ '@pages/main/system/roleManagement/authConfig/index'))
  }
]
