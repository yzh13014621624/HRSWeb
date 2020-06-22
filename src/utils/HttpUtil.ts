/*
 * @description: 处理 url
 * @author: huxianghe
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: huxianghe
 * @Date: 2019-08-08 15:30:29
 * @LastEditTime: 2019-09-27 18:03:01
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
export default class HttpUtil {
  /* 将 url 查询参数解析成为对象 */
  static parseUrl (url: string) {
    if (url.indexOf('?') !== -1) {
      const query = url.split('?')[1]
      const queryList = query.split('&')
      const obj: any = {}
      queryList.forEach(item => {
        const [key, value] = item.split('=')
        obj[key] = decodeURIComponent(value)
      })
      return obj
    }
    return {}
  }
}
