/**
 * @author lixinying
 * @createTime 2019/04/03
 * @description 离职模块
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import Loadable from '../../loadable'

export default [
  {
    path: '/home/quitPage',
    title: '离职',
    exact: true,
    key: 'HRS000100050000',
    level: 2, // 等级
    index: 5, // 左侧菜单显示的顺序
    parent: 'HRS000100000000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "quit" */ '@pages/main/basics/quit/QuitPage'))
  },
  {
    path: '/home/quitPage/quitAdd',
    title: '新增',
    exact: true,
    key: 'HRS000100050001',
    level: 3, // 等级
    parent: 'HRS000100050000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "quit" */ '@pages/main/basics/quit/add/QuitAdd'))
  },
  {
    path: '/home/quitPage/quitDetails',
    title: '离职详情',
    exact: true,
    key: 'HRS000100050002',
    level: 3, // 等级
    parent: 'HRS000100050000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "quit" */ '@pages/main/basics/quit/details/QuitDetails'))
  }
]
