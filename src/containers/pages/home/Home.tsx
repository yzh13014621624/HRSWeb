/**
 * @author minjie
 * @createTime 2019/04/03
 * @description 主界面
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, Version } from '@components/index'
import { Menu, Icon, Layout, Avatar, Breadcrumb, Dropdown } from 'antd'
import { observer } from 'mobx-react'
import CustomeRouter from '@router/CustomeRouter'
import {
  IconSilder1, IconSilder2, IconSilder3, IconSilder4, IconLock,
  IconSiderDate, IconSiderSalary
} from '@components/icon/BasicIcon'
import { SysUtil, globalEnum } from '@utils/index'

import UpdatePwd from './UpdatePwd'

import touxiang from '@assets/images/svg/home/touxiang.svg'
import taskmanageicon from '@assets/images/home/taskmanageicon.png'
import './style/home.styl'

import { BaseProps, KeyValue } from 'typings/global'

// 侧边栏颜色
const menuBg = {
  background: 'linear-gradient(180deg,rgba(43,143,249,1) 0%,rgba(36,200,234,1) 100%)'
}

// 侧边 icon
const iconMap: KeyValue = {
  IconSilder1,
  IconSilder2,
  IconSilder3,
  IconSilder4,
  IconSiderDate,
  IconSiderSalary
}

interface HomeState {
  collapsed: boolean
  silderData: []
}

@observer
export default class Home extends RootComponent<BaseProps, HomeState> {
  private UpdatePwd = React.createRef<UpdatePwd>()
  constructor (props:any) {
    super(props)
    this.axios.cacheAxiosHeaderConfig()
    this.state = {
      collapsed: false,
      silderData: []
    }
  }

  componentDidMount () {
    // 获取用户的信息
    let auth = SysUtil.getSessionStorage(globalEnum.auth)
    let homeData = SysUtil.getSessionStorage('home-silder')
    if (process.env.SERVICE_URL === 'pro' || process.env.SERVICE_URL === 'pre' || process.env.SERVICE_URL === 'tes') {
      if (auth) {
        // 筛选权限
        let ary = this.recursion(homeData, auth).filter((v:any) => v.children.length !== 0)
        ary.unshift(homeData.find((v:any) => v.key === '0'))
        this.setState({ silderData: ary })
      } else {
        this.props.history.push('/login')
      }
    } else {
      this.setState({ silderData: homeData })
    }
    this.getTaskNum()
  }

  /** 权限数据的筛选 */
  recursion = (data:any, auth:any) => {
    let list:any = []
    for (let val of data) {
      auth.forEach((em:any) => {
        if (val.key === em) {
          let obj:any = {
            title: val.title,
            parent: val.parent,
            icon: val.icon,
            path: val.path,
            key: val.key
          }
          if (val.children) {
            obj['children'] = this.recursion(val.children, auth)
          }
          list.push(obj)
        }
      })
    }
    return list
  }

  /* 切换侧边栏状态收缩： 可以去掉该方法，然后使用默认的 */
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  /* 跳转路劲 */
  routerLink = (path:string) => {
    this.props.history.push(path)
  }

  /** 退出 */
  loginOut = () => {
    // 退出的时候清除用户的信息
    this.props.mobxGlobal.loginOut()
    this.props.history.push('/')
  }

  /** 修改密码 */
  updatePwd = () => {
    let { handelModal } = this.UpdatePwd.current as UpdatePwd
    handelModal(1)
  }

  /** 初始化侧边栏 */
  initSilder = (data:any):any => {
    return data.map((el:any) => {
      if (el.children && el.children.length > 0) {
        return <Menu.SubMenu key={el.path} title={<span>{<Icon component={iconMap[el.icon]} />}
          <span>{el.title}</span></span>}>
          {this.initSilder(el.children)}
        </Menu.SubMenu>
      } else {
        return <Menu.Item key={el.path} onClick={this.routerLink.bind(this, el.path)}>
          {el.icon && <Icon component={iconMap[el.icon]} />}
          <span>{el.title}</span>
        </Menu.Item>
      }
    })
  }

  /** 面包屑的显示 */
  itemRender = (route:any, params:any, routes:any, paths:any):any => {
    const first = routes.indexOf(route) < 1
    return !first
      ? <span className="active-span" onClick={this.routerLink.bind(this, route.path)}>{route.title}</span>
      : <span>{route.title}</span>
  }

  // 任务管理
  goTaskManage = () => {
    this.props.history.push('/home/taskManagePage')
    this.getTaskNum()
  }

  // 获取任务管理的数量
  getTaskNum = () => {
    this.axios.request(this.api.count).then(({ code, data }) => {
      if (code === 200) {
        let { sun } = data
        sun = sun > 99 ? '99+' : sun
        this.props.mobxGlobal.setTaskNum(sun)
      }
    })
  }

  render () {
    const {
      props: {
        mobxRouter: { breadcrumbAry, selectedKeys },
        mobxGlobal: { admin, downloadTask }
      },
      state: { silderData }
    } = this
    let adminName = ''
    if (admin) {
      const { name, nickname } = admin
      adminName = name || nickname || '用户名'
    }
    const headerText = process.env.headerText
    const menu = (<Menu>
      <Menu.Item onClick={this.updatePwd}>
        <Icon component={IconLock} style={{ marginRight: '0.02rem' }}></Icon>修改密码
      </Menu.Item>
    </Menu>)
    return (
      <Layout className="home">
        <Layout.Sider style={menuBg}
          collapsedWidth={'0.31rem'} width={'1.35rem'}
          collapsed={this.state.collapsed} className="home-silder" >
          <div className={this.state.collapsed ? 'icon active' : 'icon' }>
            <span>{this.state.collapsed ? 'HR' : headerText }</span>
          </div>
          <Menu
            inlineIndent={30}
            defaultSelectedKeys={['HRS000100000000']}
            selectedKeys={selectedKeys}
            mode="inline" >
            {this.initSilder(silderData)}
          </Menu>
        </Layout.Sider>
        <Layout>
          <Layout.Header className="home-center-header">
            <div className="icon active" onClick={this.toggleCollapsed}>
              <Icon className="home-header-cion"
                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold' }></Icon>
            </div>
            <div className="user">
              <span onClick={this.goTaskManage} className='taskmanage'>
                <img src={taskmanageicon} className='taskmanageicon'/>
                任务管理
                {/* {(downloadTask && downloadTask !== '0') ? <span className='taskbackground'><span className={downloadTask === '99+' ? 'tasknum_l' : 'tasknum'}>{downloadTask}</span></span> : ''} */}
              </span>
              <Dropdown overlay={menu}>
                <div className="user-col active">
                  <Avatar size="small" icon="user" src={touxiang}></Avatar>
                  <span className="user-name">{adminName}</span>
                </div>
              </Dropdown>
              <div className="user-col active" onClick={this.loginOut}>
                <Icon type="poweroff" style={{ marginRight: '0.02rem' }}></Icon>
                <span>退出</span>
              </div>
            </div>
          </Layout.Header>
          <Layout.Content style={{ marginTop: '0.31rem' }}>
            <Breadcrumb
              separator=">"
              className="page-header"
              itemRender={this.itemRender}
              routes={breadcrumbAry}>
            </Breadcrumb>
            <div style={{ background: '#fff', minHeight: '3.9rem', margin: '0.1rem' }}>
              <CustomeRouter isFind={true} {...this.props} config={this.props.routes}/>
            </div>
          </Layout.Content>
        </Layout>
        <UpdatePwd ref={this.UpdatePwd}></UpdatePwd>
        <Version color="cus-version-color-b"/>
      </Layout>
    )
  }
}
