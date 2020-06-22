/*
 * @description: 将行内样式 px 转为 rem，1px 和 字体大小不需要转的，需要将单位设置为 Px
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-09-23 11:43:31
 * @LastEditTime: 2019-09-23 14:18:22
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
const reg = /(\d)+(px)/gi

module.exports = function (source) {
  const unitList = source.match(reg)
  if (unitList && unitList.length) {
    for (let i = 0, len = unitList.length; i < len; i++) {
      const unit = unitList[i]
      if (unit.includes('Px')) source = source.replace(unit, unit.toLowerCase())
      else source = source.replace(unit, parseFloat((parseInt(unit) / 192).toFixed(2)) + 'rem')
    }
  }
  return source
}
