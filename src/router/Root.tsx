/**
 * @author minjie
 * @createTime 2019/04/03
 * @description 路由管理
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { SysUtil, JudgeUtil, inArray } from '@utils/index'
import RootComponent from '@components/root/RootComponent'
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { Modal } from 'antd'
import CustomRouter from './CustomeRouter'
import Routes from './moudle/index'
import Loadable from './loadable'

const confirm = Modal.confirm

// 引导页
const Guide = Loadable(() => import(/* webpackChunkName: "login" */ '@pages/guide'))
const Login = Loadable(() => import(/* webpackChunkName: "login" */ '@pages/login/Login'))
// 另外的上传页
const Other = Loadable(() => import(/* webpackChunkName: "other" */ '@pages/other/index'))
// 404页面
const NotFound = Loadable(() => import(/* webpackChunkName: "other" */ '@pages/notfound/index'))
// 系统维护页面
const SystemMaintenance = Loadable(() => import(/* webpackChunkName: "other" */ '@pages/systemmaintenance/index'))

export default class Root extends RootComponent {
  /** 自定义离开的提示信息 */
  getUserConfirmation = (message: string, callback: Function) => {
    const [storageName, keyName] = message.split('-')
    let callbacks = callback
    // 判断是否存在 该缓存
    let obj = SysUtil.getLocalStorage(storageName) || SysUtil.getSessionStorage(storageName)
    let i = 0
    if (obj) {
      if (JudgeUtil.isPlainObj(obj)) {
        const keysList = Object.keys(obj)
        if (keyName) {
          const { include } = inArray(keyName, keysList)
          include && i++
        } else {
          keysList.forEach(key => {
            if (JudgeUtil.isArrayFn(obj[key])) {
              if (obj[key].length > 0) i++
            } else if (!JudgeUtil.isEmpty(obj[key])) {
              i++
            }
          })
        }
      } else {
        i++
      }
      i > 0 ? confirm({
        title: '您正在编辑信息，是否确认离开?',
        cancelText: '取消',
        okText: '确认',
        onOk: () => callbacks(true),
        onCancel: () => callbacks(false)
      }) : callbacks(true)
    } else {
      callbacks(true)
    }
  }

  render () {
    return (
      <div style={{ height: '100%' }}>
        <Router hashType="noslash" getUserConfirmation={this.getUserConfirmation}>
          <Switch>
            <Route path="/other/upload" exact component={Other} />
            <Route path="/guide" exact component={Guide} />
            <Route path="/notfound" exact component={NotFound} />
            <Route path="/systemmaintenance" exact component={SystemMaintenance} />
            <Routers path="/login" exact={true} component={Login}></Routers>
            <Redirect from="/" exact to='/login'/>
            {/**
             * 如果是系统维护阶段需要把下面的两行放开把上面的两行注释掉
             */}
            {/* <Routers path="/login" exact={true} component={SystemMaintenance}></Routers> */}
            {/* <Redirect from="/" exact to='/systemmaintenance'/> */}
            <CustomRouter {...this.props} config={Routes}/>
          </Switch>
        </Router>
      </div>
    )
  }
}

/** 是否是 Chrome 浏览器 */
function Routers ({ path, component, exact }:any) {
  if (SysUtil.getBrowserInfo('Chrome')) {
    return <Route path={path} exact={exact} component={component} />
  } else {
    return <Redirect to='/guide'/>
  }
}
