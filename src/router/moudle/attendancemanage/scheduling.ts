import Loadable from '../../loadable'

export default [
  {
    path: '/home/scheduling',
    title: '考勤',
    exact: true,
    key: 'HRS000400020000',
    level: 2, // 等级
    index: 2, // 左侧菜单显示的顺序
    parent: 'HRS000400000000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "attendancemanage" */ '@pages/main/attendancemanage/scheduling'))
  },
  {
    path: '/home/scheduling/schedulingAdd',
    title: '新增考勤',
    exact: true,
    key: 'HRS000400020001',
    level: 3, // 等级
    index: 1, // 左侧菜单显示的顺序
    parent: 'HRS000400020000', // 子级
    component: Loadable(() => import(/* webpackChunkName: "attendancemanage" */ '@pages/main/attendancemanage/scheduling/schedulingAdd'))
  },
  {
    path: '/home/scheduling/schedulingAdd/:aId',
    title: '考勤详情',
    exact: true,
    key: 'HRS000400020002',
    level: 3, // 等级
    index: 1, // 左侧菜单显示的顺序
    parent: 'HRS000400020000', // 子级
    component: Loadable(() => import(/* webpackChunkName: "attendancemanage" */ '@pages/main/attendancemanage/scheduling/schedulingAdd'))
  },
  {
    path: '/home/scheduling/faceDetail/:aId',
    title: '考勤详情',
    exact: true,
    key: 'HRS000400020002',
    level: 3, // 等级
    index: 1, // 左侧菜单显示的顺序
    parent: 'HRS000400020000', // 子级
    component: Loadable(() => import(/* webpackChunkName: "attendancemanage" */ '@pages/main/attendancemanage/scheduling/faceDetail'))
  },
  {
    path: '/home/dayStatistics',
    title: '日统计',
    exact: true,
    key: 'HRS000400020003',
    level: 3, // 等级
    index: 1, // 左侧菜单显示的顺序
    parent: 'HRS000400020000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "attendancemanage" */ '@pages/main/attendancemanage/dayStatistics'))
  }
]
