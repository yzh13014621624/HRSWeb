/**
 * @author minjie
 * @createTime 2019/04/03
 * @description 登录界面
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import RootComponent, { hot } from '@components/root/RootComponent'
import { Version, Linkvideo } from '@components/index'
import { Form, Icon, Input, Button, Checkbox, Tabs, Row, Spin } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import loginBg from '@assets/images/login/login-bg.png'
import Bitmap from '@assets/images/login/Bitmap.png'
import rightTopLogo from '@assets/images/login/login-right-top-logo.png'
import { SysUtil, AesUtil, globalEnum, ConfigUtil, ComConfig } from '@utils/index'
import { inject, observer } from 'mobx-react'
import ScanIcon from '@assets/images/login/logo.png'

import './login.styl'
import { BaseProps } from 'typings/global'
import { flow } from 'mobx'
const { Item } = Form

const loginBgStyle = {
  background: `url(${loginBg}) center center no-repeat`
}

interface LoginProps extends BaseProps, FormComponentProps {
  mboxCommont?:any
}

interface LoginState {
  /** 加载中的状态 */
  spinning: boolean
  ScanIconBase64: string
}

@inject('mboxCommont', 'mobxGlobal')
@observer
@hot(module)
class Login extends RootComponent<LoginProps, LoginState> {
  constructor (props:any) {
    super(props)
    this.state = {
      spinning: true,
      ScanIconBase64: ''
    }
  }

  /** 登录成功！ */
  // onLoginSuccss = (res:any) => {
  //   // 功能权限code集合 数据权限 数据权限 用户信息
  //   const { authoritis, authDatas, user: { userID, userRoles } } = res.data
  //   if (authoritis.length === 0) {
  //     this.warning('请联系管理员分配权限！')
  //   } else {
  //     SysUtil.setLocalStorage(globalEnum.userID, userID, 5)
  //     SysUtil.setLocalStorage(globalEnum.auth, authoritis, 5)
  //     SysUtil.setLocalStorage(globalEnum.authdata, authDatas, 5)
  //     SysUtil.setLocalStorage(globalEnum.roles, userRoles, 5)
  //     const {
  //       mobxCommon: { getUserInfo, setOrganize },
  //       mobxHome: { queryBackstageStatus }
  //     } = this.props
  //     setOrganize() // 初始化组织信息
  //     getUserInfo() // 获取用户的信息
  //     queryBackstageStatus() // 后台系统是否在禁用中
  //     LoggerUtil.log('登录页', '登录好饭碗后台')
  //     window.clearTimeout()
  //     this.$message.success({ content: '欢迎登录好饭碗后台！', key: 'login_key', duration: 2 })
  //     this.props.history.replace('home/homeInfo')
  //   }
  // }

  /* 提交 信息 */
  onLoginSuccss = (res: any) => {
    const {
      props: {
        mobxGlobal: { setAdminInfo, setAuthorityList },
        mboxCommont: { setCountry, setOrganize },
        history: { replace }
      },
      $message,
      api: { LoginStrategy }
    } = this
    // 功能权限code集合 数据权限 数据权限 用户信息
    const { authoritis, authDatas, user: { userID, userRoles } } = res.data
    if (authoritis.length === 0) {
      this.warning('该账号未选择角色，不可登陆！')
    } else {
      this.axios.cacheAxiosHeaderConfig()
      const token = SysUtil.getSessionStorage(globalEnum.token) || ''
      const { code, data, msg } = res
      const success = msg[0].indexOf('Success') > -1
      const params = {
        adminPermissionResponse: {
          data,
          code,
          token,
          success,
          header: { Authorization: [ token ] },
          message: msg
        },
        loginType: 'qrcode'
      }
      this.axios.request(LoginStrategy, params).then(({ code, data }) => {
        const { admin, auth } = data
        if (code === 200) {
          SysUtil.setSessionStorage(globalEnum.auth, auth)
          SysUtil.setSessionStorage(globalEnum.admin, admin)
          setAdminInfo(admin)
          setAuthorityList(auth)
          setCountry() // 初始化信息 - 国家
          setOrganize(admin) // 初始化信息 - 组织
          replace('home/homeInfo')
          $message.success('登录成功！')
        }
      })
    }
  }
  componentDidMount = () => {
    // var image = new Image()
    // image.src = ScanIcon
    // let base64 = ''
    // image.onload = async () => {
    //   base64 = await this.getBase64Image(image)
    //   this.setState({ ScanIconBase64: base64 })
    // }
  }

  getBase64Image = (img: any) => {
    let canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    let ctx = canvas.getContext('2d')
    ctx && ctx.drawImage(img, 0, 0, img.width, img.height)
    var ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase()
    var dataURL = canvas.toDataURL('image/' + ext)
    return dataURL
  }

  onLoad = () => {
    this.setState({ spinning: false }, () => {
      // 加载完成之后发送配置的信息
      const childFrameObj:any = document.getElementById('loginframe')
      // theme（主题颜色） icon（二维码图标） tips （二维码提示）  project（登录的项目）size (宽度大小：small middle large)
      childFrameObj.contentWindow.postMessage({
        qrCodeLink: 'https://hfw.sj56.com.cn/hfw/share/index.html#pd',
        project: 'HRS',
        theme: 'rgba(64,169,255,1)', // '#007AFF',
        icon: 'http://m.qpic.cn/psc?/V10yWiIW1cb57G/lwLYosea*1Tx8aEGf3rTEIG1BTY*B0iEye6HpKUQYoMuafn0zYOSGcAA8K7LYvpG74atP0Bfo8zfS7CM8bmc6ougpmvvFOBu9v5b0M2RKvo!/b&bo=MAIwAgAAAAADFzI!&rf=viewer_4',
        tips: '好饭碗APP',
        size: 'middle'
      }, '*')
    })
    window.onmessage = ({ data: { logindata, token, msg }, origin }:any) => {
      // 判断是否存在值
      if (logindata && logindata.code === 200 && logindata.data) {
        // 设置项目的token, 具体看项目
        SysUtil.setSessionStorage(globalEnum.token, token) // 将登录成功的值进行处理
        this.onLoginSuccss(logindata) // 是否存在返回的消息
      } else if (msg) {
        // 对消息进行处理
        this.error(msg)
      }
    }
  }

  render () {
    const {
      state: { spinning }
    } = this
    let headerText = '上嘉HR系统登录' + ConfigUtil.waterMark
    return (
      <div className="content-div">
        <img src='https://hfw.sj56.com.cn/hfw/assets/common/sj_logo_white.svg' alt="" className='rightTopLogo' />
        <div className="login-content" style={loginBgStyle}>
          <div className="login-card">
            <div className="login-welcome">
              <img src={Bitmap}></img>
            </div>
            <div className="login">
              <p className='card-header'>{headerText}</p>
              <Spin spinning={spinning}>
                <iframe
                  id='loginframe'
                  width='420Px'
                  height='360Px'
                  onLoad={this.onLoad}
                  scrolling='no'
                  frameBorder='0'
                  src={ComConfig.loginItem}
                />
              </Spin>
            </div>
          </div>
        </div>
        <Linkvideo/>
        <Version color="cus-version-color"/>
      </div>
    )
  }
}

export default Form.create({ name: 'normal_login' })(Login)
