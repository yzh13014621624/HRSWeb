import Loadable from '../../loadable'

export default [
  {
    path: '/home/compose',
    title: '排班',
    exact: true,
    key: 'HRS000400010000',
    level: 2, // 等级
    index: 1, // 左侧菜单显示的顺序
    parent: 'HRS000400000000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "attendancemanage" */ '@pages/main/attendancemanage/compose'))
  },
  {
    path: '/home/compose/composeAdd',
    title: '新增排班',
    exact: true,
    key: 'HRS000400010001',
    level: 3, // 等级
    index: 1, // 左侧菜单显示的顺序
    parent: 'HRS000400010000', // 子级
    component: Loadable(() => import(/* webpackChunkName: "attendancemanage" */ '@pages/main/attendancemanage/compose/composeAdd'))
  },
  {
    path: '/home/compose/composeAdd/:sId',
    title: '排班详情',
    exact: true,
    key: 'HRS000400010002',
    level: 3, // 等级
    index: 1, // 左侧菜单显示的顺序
    parent: 'HRS000400010000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "attendancemanage" */ '@pages/main/attendancemanage/compose/composeAdd'))
  }
]
