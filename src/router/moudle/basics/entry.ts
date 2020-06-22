/**
 * @author minjie
 * @createTime 2019/03/26
 * @description 入职模块
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import Loadable from '../../loadable'

export default [
  {
    path: '/home/entryPage',
    title: '入职',
    exact: true,
    key: 'HRS000100010000',
    level: 2, // 等级
    index: 1, // 左侧菜单显示的顺序
    parent: 'HRS000100000000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "entry" */ '@pages/main/basics/entry/EntryPage'))
  },
  {
    path: '/home/entryPage/entryAdd',
    title: '新增入职',
    exact: true,
    key: 'HRS000100010001',
    level: 3, // 等级
    parent: 'HRS000100010000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "entry" */ '@pages/main/basics/entry/add/EntryAdd'))
  },
  {
    path: '/home/entryPage/entryAdd/:id',
    title: '入职详情',
    exact: true,
    key: 'HRS000100010002',
    level: 3, // 等级
    parent: 'HRS000100010000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "entry" */ '@pages/main/basics/entry/add/EntryAdd'))
  }
]
