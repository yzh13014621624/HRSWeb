/*
 * @description:
 * @author: qiuyang
 * @lastEditors: qiuyang
 * @Date: 2020-05-07 16:49:40
 * @LastEditTime: 2020-05-07 16:54:27
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import Loadable from '../../loadable'

export default [
  {
    path: '/home/accountManagement',
    title: '账号管理',
    exact: true,
    key: 'HRS000600010000',
    level: 2, // 等级
    index: 1, // 左侧菜单显示的顺序
    parent: 'HRS000600000000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "salarymanage" */ '@pages/main/system/accountManagement'))
  }
]
