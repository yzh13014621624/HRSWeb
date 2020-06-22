/*
 * @description: 组织管理
 * @author: qiuyang
 * @lastEditors: qiuyang
 * @Date: 2020-05-13 16:55:40
 * @LastEditTime: 2020-06-08 16:56:30
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import Loadable from '../../loadable'

export default [
  {
    path: '/home/organizationalManagement',
    title: '组织管理',
    exact: true,
    key: 'HRS000600040000',
    level: 2, // 等级
    index: 4, // 左侧菜单显示的顺序
    parent: 'HRS000600000000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "salarymanage" */ '@pages/main/system/organizationalManagement'))
  }
]
