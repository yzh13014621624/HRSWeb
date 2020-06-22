/*
 * @description: 获取26个大小写字母
 * @author: zhousong
 * @lastEditors: zhousong
 * @Date: 2019-09-26 11:08:23
 * @LastEditTime: 2019-09-26 11:35:43
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default class CodeList {
  static lowerCase () {
    let count = 0
    let arr = []
    for (let i = 97; i < 123; i++) {
      arr[count] = String.fromCharCode(i)
      count++
    }
    return arr
  }

  static uperCase () {
    let count = 0
    let arr = []
    for (let i = 65; i < 91; i++) {
      arr[count] = String.fromCharCode(i)
      count++
    }
    return arr
  }
}
