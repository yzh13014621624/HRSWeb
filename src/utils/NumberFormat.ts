/**
 * @class NumberFormatUtils
 * @author minjie
 * @createTime 2018/9/15
 * @description 格式化数字
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
export default class NumberFormatUtils {
  /**
   * 对金额进行格式化
   * @method doubleFormat
   * @param {*} number   要格式化的数字
   * @param {*} decimals 保留几位小数
   * @returns            返回格式化之后的金额
   */
  static doubleFormat (number:any, decimals:any) {
    decimals = decimals >= 0 && decimals <= 20 ? decimals : 2
    number = parseFloat((number + '').replace(/[^\d.-]/g, '')).toFixed(decimals) + ''
    let l = number.split('.')[0].split('').reverse()
    let r = number.split('.')[1]
    r = r == null ? '' : '.' + r
    var t = ''
    if (l[l.length - 1] === '-') { // 负数不需要分隔号,
      for (var i = 0; i < l.length; i++) {
        if (l[i] === '-') {
          t += l[i] + ''
          continue
        }
        // 不是数组的倒数第二个元素才加"," ["0", "4", "5", "-"]
        t += l[i] + ((i + 1) % 4 === 0 && i + 1 !== l.length - 1 ? ',' : '')
        // i + 1 != l.length会变成-,540.00,因为在5时元素位置2+1为3非数组长度
        // t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? "," : "");
      }
    } else {
      for (let i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 4 === 0 && i + 1 !== l.length ? ',' : '')
      }
    }
    return (t.split('').reverse().join('') + r)
  }
}
