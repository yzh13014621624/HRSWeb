/*
 * @description: 薪资归档
 * @author: songliubiao
 * @lastEditors: songliubiao
 * @Date: 2019-09-24 10:07:35
 * @LastEditTime: 2019-09-24 11:03:17
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import Loadable from '../../loadable'
export default [
  {
    path: '/home/salaryprefile',
    title: '薪资归档',
    exact: true,
    key: 'HRS000500050000',
    level: 2, // 等级
    index: 4, // 左侧菜单显示的顺序
    parent: 'HRS000500000000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "salarymanage" */ '@pages/main/salarymanage/salaryprefile'))
  },
  {
    path: '/home/salaryprefile/salaryprefiledetail',
    title: '薪资归档详情',
    exact: true,
    key: 'HRS000500050001',
    level: 3, // 等级
    index: 4, // 左侧菜单显示的顺序
    parent: 'HRS000500050000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "salarymanage" */ '@pages/main/salarymanage/salaryprefile/salaryprefiledetail'))
  }
]
