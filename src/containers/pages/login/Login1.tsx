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

import './login.styl'
import { BaseProps } from 'typings/global'
const { Item } = Form

const loginBgStyle = {
  background: `url(${loginBg}) center center no-repeat`
}

interface LoginProps extends BaseProps, FormComponentProps {
  mboxCommont?:any
}

interface LoginState {
  errorMsg: string // 错误的消息
  code:number // 验证码
  diableBtn: boolean // 按钮禁用
  cehckPwd: boolean // 记住密码
  phoneValidateStatus: 'validating' | 'error' | 'success' | 'warning' | undefined
  pwdValidateStatus: 'validating' | 'error' | 'success' | 'warning' | undefined
  codeValidateStatus: 'validating' | 'error' | 'success' | 'warning' | undefined
  data: any // 保存用户的信息
  rememberPwd: string // 保存密码
}

@inject('mboxCommont', 'mobxGlobal')
@observer
@hot(module)
class Login extends RootComponent<LoginProps, LoginState> {
  timeOutObj: number = -1
  constructor (props:any) {
    super(props)
    let codeTime = new Date().getTime()
    this.state = {
      errorMsg: '',
      code: codeTime,
      diableBtn: false,
      cehckPwd: false,
      phoneValidateStatus: 'validating',
      pwdValidateStatus: 'validating',
      codeValidateStatus: 'validating',
      rememberPwd: '', // 'adc456789', // 'adc456789',
      data: {
        phoneNumber: undefined, // '15216627932',
        loginPassword: undefined, // 'adc456789',
        remember: false
      }
    }
  }

  /** 初始加载验证码 */
  componentDidMount () {
    let data = SysUtil.getLocalStorage(globalEnum.cehckPwd)
    if (data) {
      const { loginPassword, phoneNumber } = data
      let objs:any = {}
      let obj:any = { phoneNumber: phoneNumber }
      if (loginPassword) { // 存在记住密码
        obj['remember'] = true
        obj['loginPassword'] = 'h'.padEnd(loginPassword.length - 1, '*')
        objs['rememberPwd'] = loginPassword
      }
      objs['data'] = obj
      this.setState(objs)
    }
    // 判断禁用
    this.diableBtnFun()
  }
  componentWillUnmount () {
    this.setState = (state, callback) => {}
  }

  /** 获取验证的 */
  getCaptcha = () => {
    let codes = this.state.code
    return `${this.axios.path}/${this.api.captcha.path}?time=${codes}`
  }

  /** 重新加载验证码 */
  clickCode = () => {
    let code = new Date().getTime()
    this.setState({ code })
  }

  /** 验证是否禁用 */
  diableBtnFun = () => {
    let nameAry = ['phoneNumber', 'loginPassword', 'captcha']
    let values = this.props.form.getFieldsValue()
    let num = 0
    for (const key in values) {
      if (nameAry.indexOf(key) >= 0) {
        if (values[key]) { // 存在值则接触禁用
          num++
        }
      }
    }
    this.setState({
      diableBtn: num === nameAry.length
    })
  }

  /* 提交 信息 */
  handleSubmit = (e:any) => {
    e.preventDefault() // 取消默认的事件
    // 类型进行检查
    const {
      props: {
        form: { getFieldsValue },
        mobxGlobal: { setAdminInfo, setAuthorityList },
        mboxCommont: { setCountry, setOrganize },
        history: { replace }
      },
      state: { data, rememberPwd, code },
      axios: { request },
      api: { login },
      $message
    } = this
    let values = getFieldsValue()
    let { phoneNumber, loginPassword, captcha, remember } = values
    let pwd = loginPassword === data.loginPassword ? rememberPwd : loginPassword
    phoneNumber = phoneNumber.replace(/(^\s*)|(\s*$)/g, '')
    pwd = pwd.replace(/(^\s*)|(\s*$)/g, '')
    captcha = captcha.replace(/(^\s*)|(\s*$)/g, '')
    // 提交的时候禁用按钮
    this.setState({ diableBtn: false })
    this.axios.request(this.api.login, {
      captcha: captcha,
      password: AesUtil.encryptCBC(pwd),
      phone: phoneNumber,
      time: code
    }, true).then(({ data }) => {
      // 权限， 用户的信息， token
      let { auth, admin, token } = data
      // 对权限进行判断之后 才能够进入
      this.setState({ diableBtn: true })
      if (auth.length > 0) { // 存在权限
        let obj:any = { phoneNumber: phoneNumber }
        // 是否记住密码
        if (remember) obj['loginPassword'] = pwd
        SysUtil.setLocalStorage(globalEnum.cehckPwd, obj)
        SysUtil.setSessionStorage(globalEnum.auth, auth)
        SysUtil.setSessionStorage(globalEnum.admin, admin)
        SysUtil.setSessionStorage(globalEnum.token, token)
        this.axios.cacheAxiosHeaderConfig()
        setAdminInfo(admin)
        setAuthorityList(auth)
        setCountry() // 初始化信息 - 国家
        setOrganize() // 初始化信息 - 组织
        replace('/home/homeInfo')
        $message.success('登录成功！')
      } else {
        this.clickCode()
        $message.warning('对不起您没有权限！')
      }
    }).catch((err:any) => {
      const { code, msg } = err
      if (code === 400 && msg && msg.length < 25) {
        this.setState({ errorMsg: msg })
      } else {
        this.$message.error(msg || err)
      }
      this.clickCode()
      this.setState({ diableBtn: true })
    })
  }

  render () {
    const {
      props: { form: { getFieldDecorator } },
      state: {
        errorMsg, diableBtn, codeValidateStatus,
        phoneValidateStatus, pwdValidateStatus, data
      }
    } = this
    const iconStyle = { color: 'rgba(0,0,0,.25)' }
    const { phoneNumber, loginPassword, remember } = data
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
              <p className={errorMsg !== '' ? 'card-header' : 'card-header line-height' }>{headerText}</p>
              {errorMsg !== '' ? <p className="login-error">{errorMsg}</p> : null}
              <Form onSubmit={this.handleSubmit} className="login-form">
                <Item validateStatus={phoneValidateStatus} className="form-item">
                  {getFieldDecorator('phoneNumber', {
                    initialValue: phoneNumber,
                    rules: [{ validator: this.diableBtnFun }]
                  })(
                    <Input allowClear type="text" id="phoneNumber" size="large" prefix={<Icon type="user" style={iconStyle} />} placeholder="请输入用户名" />
                  )}
                </Item>
                <Item validateStatus={pwdValidateStatus} className="form-item">
                  {getFieldDecorator('loginPassword', {
                    initialValue: loginPassword,
                    rules: [{ validator: this.diableBtnFun }]
                  })(
                    <Input allowClear size="large" prefix={<Icon type="lock" style={iconStyle} />} type="password" placeholder="请输入登录密码" />
                  )}
                </Item>
                <Item validateStatus={codeValidateStatus} className="form-item form-item-code">
                  {getFieldDecorator('captcha', {
                    rules: [{ validator: this.diableBtnFun }]
                  })(
                    <Input allowClear size="large" type="text" placeholder="请输入验证码"
                      prefix={<Icon type="safety-certificate" style={iconStyle}/>}
                      suffix={<img onClick={() => this.clickCode()} className="img-code" src={this.getCaptcha()}></img>}/>
                  )}
                </Item>
                <div className="form-item">
                  {getFieldDecorator('remember', {
                    valuePropName: 'checked',
                    initialValue: remember
                  })(<Checkbox>记住密码</Checkbox>)}
                </div>
                <Item className="form-item">
                  <Button disabled={!diableBtn} type="primary" shape="round" block={true} size="large" htmlType="submit">登录</Button>
                </Item>
              </Form>
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
