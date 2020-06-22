/**
 * @author minjie
 * @createTime 2019/04/08
 * @description Server Api 后台接口: 公共的接口  组织等查询的
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  login: { // 登录
    type: 'post',
    path: 'login'
  },
  captcha: { // 获取图片验证码
    type: 'get',
    path: 'login/captcha'
  },
  loginVeriCode: { // 验证码登录
    type: '',
    path: '/login/veriCode'
  },
  loginGetCaptcha: { // 获取手机验证码
    type: 'get',
    path: '/login/veriCode/getCaptcha'
  },
  commontCountry: { // 查询国家--实现
    type: 'get',
    path: 'EmployeeOnboard/getCountry'
  },
  commonUploadPwd: { // 修改密码
    path: 'user/changeUserPassword'
  },
  ossGetkey: { // 获取osskey(需要修改)
    type: 'get',
    path: 'BasicData/getAliBaBaCopyright'
  },
  LoginStrategy: { // 登录策略
    type: 'post',
    path: '/login/strategy'
  },
  GetProject: { // 查询项目
    type: 'post',
    path: '/BasicData/getProject'
  }
}
