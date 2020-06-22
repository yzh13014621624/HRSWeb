import Loadable from '../../loadable'

export default [
  {
    path: '/home/attendanceparameters',
    title: '考勤设置',
    exact: true,
    key: 'HRS000400030000',
    level: 2, // 等级
    index: 3, // 左侧菜单显示的顺序
    parent: 'HRS000400000000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "attendancemanage" */ '@pages/main/attendancemanage/attendanceparameters'))
  },
  {
    path: '/home/attendanceparameters/atttendance',
    title: '新增参数',
    exact: true,
    key: 'HRS000400030001',
    level: 3, // 等级
    parent: 'HRS000400030000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "attendancemanage" */ '@pages/main/attendancemanage/attendanceparameters/atttendance/attendanceDetail'))
  },
  {
    path: '/home/attendanceparameters/atttendance/:id',
    title: '参数详情',
    exact: true,
    key: 'HRS000400030002',
    level: 3, // 等级
    parent: 'HRS000400030000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "attendancemanage" */ '@pages/main/attendancemanage/attendanceparameters/atttendance/attendanceDetail'))
  }
]
