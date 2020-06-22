/**
 * @author minjie
 * @class  DateUtil
 * @createTime 2018/12/3
 * @description 时间的转换
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default class DateUtil {
  /**
   * 将日期格式化为指定格式
   * @param date  对应需要装换的时间
   * @param fmt   格式化的形式
   */
  static format (date:Date, fmt = 'yyyy-MM-dd HH:mm:ss') {
    date = date === undefined ? new Date() : date
    date = typeof date === 'number' ? new Date(date) : date
    fmt = fmt || 'yyyy-MM-dd HH:mm:ss'
    let obj:any = {
      'y': date.getFullYear(), // 年份，注意必须用getFullYear
      'M': date.getMonth() + 1, // 月份，注意是从0-11
      'd': date.getDate(), // 日期
      'q': Math.floor((date.getMonth() + 3) / 3), // 季度
      'w': date.getDay(), // 星期，注意是0-6
      'H': date.getHours(), // 24小时制
      'h': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 12小时制
      'm': date.getMinutes(), // 分钟
      's': date.getSeconds(), // 秒
      'S': date.getMilliseconds() // 毫秒
    }
    let week = ['天', '一', '二', '三', '四', '五', '六']
    for (let i in obj) {
      fmt = fmt.replace(new RegExp(i + '+', 'g'), function (m) {
        let val:string = obj[i] + ''
        if (i === 'w') return (m.length > 2 ? '星期' : '周') + week[Number(val)]
        for (let j = 0, len = val.length; j < m.length - len; j++) val = '0' + val
        return m.length === 1 ? val : val.substring(val.length - m.length)
      })
    }
    return fmt
  }

  static parseDate (text:string) {
    return new Date(Date.parse(text.replace(/-/g, '/')))
  }

  static getFirstDayOfMonth (date:Date) {
    const temp = new Date(date.getTime())
    temp.setDate(1)
    return temp.getDay()
  }

  static getDayCountOfMonth (year:number, month:number) {
    if (month === 3 || month === 5 || month === 8 || month === 10) {
      return 30
    }

    if (month === 1) {
      if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        return 29
      } else {
        return 28
      }
    }

    return 31
  }

  static getWeekNumber (src:Date) {
    const date = new Date(src.getTime())
    date.setHours(0, 0, 0, 0)
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7)
    // January 4 is always in week 1.
    const week1 = new Date(date.getFullYear(), 0, 4)
    // Adjust to Thursday in week 1 and count number of weeks from date to week 1.
    // Rounding should be fine for Daylight Saving Time. Its shift should never be more than 12 hours.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7)
  }

  /**
   * 获取的是当前月份的天数
   */
  static mGetDate (str:string) {
    let date = new Date()
    if (str !== null) {
      date = new Date(str)
    }
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let d = new Date(year, month, 0)
    return d.getDate()
  }
}
