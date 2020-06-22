import Loadable from '../../loadable'

export default [
  {
    path: '/home/salaryprePage',
    title: '薪酬准备',
    exact: true,
    key: 'HRS000500010000',
    level: 2, // 等级
    index: 1, // 左侧菜单显示的顺序
    parent: 'HRS000500000000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "salarymanage" */ '@pages/main/salarymanage/salarypreparation'))
  },
  {
    path: '/home/salaryprePage/salaryAdd',
    title: '新增薪资凭证',
    exact: true,
    key: 'HRS000500010003',
    level: 3, // 等级
    parent: 'HRS000500010000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "salarymanage" */ '@pages/main/salarymanage/salarypreparation/salaryAdd'))
  },
  {
    path: '/home/salaryprePage/salaryDetail',
    title: '薪资凭证详情',
    exact: true,
    key: 'HRS000500010004',
    level: 3, // 等级
    parent: 'HRS000500010000', // 父级
    component: Loadable(() => import(/* webpackChunkName: "salarymanage" */ '@pages/main/salarymanage/salarypreparation/salaryDetail'))
  }
]
