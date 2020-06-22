/**
 * 对应的统一组件的地址
 */

enum CommonPageEnum {
  /** 登录的地址 */
  login = 'login'
}

class ComponentConfig {
  constructor () {
    this.loginItem = this.envJudge(CommonPageEnum.login)
  }

  /** 登录的地址 */
  loginItem:string

  /**
   * @param {string} 对应的url
   * @return {string}
   */
  envJudge = (url:string):string => {
    if (process.env.SERVICE_URL === 'pro') {
      return `https://core.sj56.com.cn/core/common/index.html#login`
    } else {
      return `https://core.sj56.com.cn/tes/common/index.html#login`
    }
  }
}
export default new ComponentConfig()
