import Loadable from '../../loadable'

export default [
  {
    path: '/home/taskManagePage',
    title: '任务管理',
    exact: true,
    key: 'HRS000000000000',
    level: 4, // 等级
    index: 3, // 左侧菜单显示的顺序
    parent: '1234567890', // 父级
    component: Loadable(() => import(/* webpackChunkName: "salarymanage" */ '@pages/main/taskmanage/taskmanage'))
  }
]
