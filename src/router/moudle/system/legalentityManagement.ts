/*
 * @description: 法人主体路由文件
 * @author: yanzihao
 * @lastEditors: yanzihao
 * @Date: 2020-05-08 13:54:55
 * @LastEditTime: 2020-06-08 16:56:50
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import Loadable from '../../loadable'

export default [
  {
    path: '/home/legalentityManagement',
    title: '法人主体管理',
    exact: true,
    key: 'HRS000600030000',
    level: 2, // 等级
    index: 3, // 左侧菜单显示的顺序
    parent: 'HRS000600000000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "salarymanage" */ '@pages/main/system/legalentityManagement'))
  }
]
