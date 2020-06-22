/**
 * @author minjie
 * @createTime 2019/04/03
 * @description 自定义的路由 空值
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import RootComponent from '@components/root/RootComponent'
import { Route, withRouter, Redirect } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { SysUtil } from '@utils/index'

import Routes from './moudle/index'

import { KeyValue } from 'typings/global'

const routesList = Routes[0].routes

/**
 * 递归查询父级路由，生成面包屑所需数据
 * @param routesList 路由记录列表
 * @param routeArr 面包屑收集器
 * @param sourceItem 父级路由记录
 */
const recursion = (routesList: KeyValue[], routeArr: any[], sourceItem: KeyValue) => {
  const { parent, level } = sourceItem
  const routeParentItem = routesList.find(el => el.key === parent)
  if (routeParentItem) {
    const { level } = routeParentItem
    routeArr[level] = routeParentItem
    if (level > 1) {
      routeArr = recursion(routesList, routeArr, routeParentItem)
      return routeArr
    }
    return routeArr
  }
  routeArr[level] = undefined
  return routeArr
}

/**
 * @param path 目标路径
 * @param routesList 路由记录列表
 * @param deep 最大子路由级别
 */
const initRecursion = (path: string, routesList: KeyValue[], deep: number = 4) => {
  const routeItem = routesList.find(el => el.path === path)
  const tempArr: any[] = new Array(deep + 1).fill(undefined)
  if (routeItem) {
    tempArr[routeItem.level] = routeItem
    return recursion(routesList, tempArr, routeItem).filter(item => item)
  } else {
    return []
  }
}

interface CustomeRoutersState {
  route: any // 路由
}

interface CustomeRoutersProps {
  config:any
  match: any
  location: any
  history: any
  mobxRouter?:any
  mobxGlobal?:any
  isFind?: boolean
}

@inject('mobxRouter', 'mobxGlobal')
@observer
class CustomeRouters extends RootComponent<CustomeRoutersProps, CustomeRoutersState> {
  constructor (props:any) {
    super(props)
    this.state = {
      route: {}
    }
  }

  initRouter = () => {
    let aryMenu:any = []
    let levelOne = routesList.filter((el:any) => el.level === 1)
    let levelTwo = routesList.filter((el:any) => el.level === 2)
    // 侧边栏的显示
    levelOne.forEach((el:any) => {
      let two = levelTwo.filter((sub:any) => sub.parent === el.key)
      aryMenu.push({ title: el.title, key: el.key, parent: el.parent, path: el.path, icon: el.icon, children: this.reFun(two) })
    })
    SysUtil.setSessionStorage('home-silder', aryMenu)
    SysUtil.setSessionStorage('home-silder-breadcrumb', routesList)
  }

  reFun = (data:any) => {
    return data.map((eld:any) => {
      return { title: eld.title, parent: eld.parent, path: eld.path, key: eld.key, index: eld.index }
    }).sort((a:any, b:any) => {
      if (a.index > b.index) {
        return 1
      } else if (a.index <= b.index) {
        return -1
      } else {
        return 0
      }
    })
  }

  render () {
    this.initRouter()
    const { config, isFind, mobxRouter, mobxGlobal } = this.props
    return (
      config.map((route:any, i:number) => (
        <Routers key={i} route={route} isFind={isFind} mobxRouter={mobxRouter} mobxGlobal={mobxGlobal}></Routers>
      ))
    )
  }
}

/** 是否是 Chrome 浏览器 */
function Routers ({ route, isFind, mobxRouter, mobxGlobal }:any) {
  if (SysUtil.getBrowserInfo('Chrome')) {
    return <Route exact={route.exact} path={route.path}
      render={props => (<RouteRender mobxRouter={mobxRouter} mobxGlobal={mobxGlobal} isFind={isFind} props={props} route={route}/>)}></Route>
  } else {
    sessionStorage.clear()
    return <Redirect to='/guide'/>
  }
}

/** 跳转前的拦截 */
const RouteRender = ({ props, route, isFind, mobxRouter, mobxGlobal }:any) => {
  if (isFind) {
    const { setBreadcrumbAry, setSelectedKeys } = mobxRouter
    const { match } = props
    const breadcrumbList = initRecursion(match.path, routesList)
    setBreadcrumbAry(breadcrumbList)
    const [first, second] = breadcrumbList
    if (second) setSelectedKeys(second.path)
    else if (first) setSelectedKeys(first.path)
  }
  return (<route.component {...props} routes={route.routes} mobxRouter={mobxRouter} mobxGlobal={mobxGlobal} />)
}

export default withRouter(CustomeRouters)
