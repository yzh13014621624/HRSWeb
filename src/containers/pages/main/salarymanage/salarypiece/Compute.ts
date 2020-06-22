/*
 * @description: 计算项目-计件凭证详情页面的计件收入
 * @author: qiuyang
 * @lastEditors: qiuyang
 * @Date: 2019-09-24 20:04:33
 * @LastEditTime : 2020-01-10 16:33:19
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import NumberFormatUtils from '@utils/NumberFormat'

enum Piece {
  reqcollectGoods = 1, // 收货
  requpShelf = 2, // 上架
  reqrepairGoods = 3, // 补货
  reqrfLabel = 4, // 整箱拣货-标签拣选
  reqrfBox = 5, // 整箱拣货-RF拣选（每箱）
  reqrfRow = 6, // 整箱拣货-RF拣选（每行）
  reqzeroPick = 7, // 拆零拣货
  reqzeroUp = 8, // 拆零上架（每托盘/数量）
  reqzeroDown = 9, // 拆零下架（每托盘/数量）
  reqcrossDocking = 10, // 越库（每箱/数量）
  reqmoveLibrary = 11 // 移库（数量）
}

// enum UnitPrice {
//   collectGoodsPrice = 1, // 收货单价
//   upShelfPrice = 2, // 上架单价
//   repairGoodsPrice = 3, // 补货单价
//   rfLabelPrice = 4, // 整箱拣货-标签拣选单价
//   rfBoxPrice = 5, // 整箱拣货-RF拣选（每箱）单价
//   rfRowPrice = 6, // 整箱拣货-RF拣选（每行）单价
//   zeroPickPrice = 7, // 拆零拣货单价
//   zeroUpPrice = 8, // 拆零上架（每托盘/数量）单价
//   zeroDownPrice = 9, // 拆零下架（每托盘/数量）单价
//   crossDockingPrice = 10, // 越库（每箱/数量）单价
//   moveLibraryPrice = 11 // 移库（数量）单价
// }

export default class Compute {
  static intLen: number = 8
  static decimalsLen: number = 3
  /**
   * 计算计件收入，非计件收入，计件奖金
   * @method ComputePiece
   * @param {*} ppDataList   计件价格区间数组
   * @param {*} detailed  明细对象
   * @param {*} salary  额定出勤天数，本月薪资标准
   * @returns            返回计件收入，非计件收入，计件奖金
   */

  static ComputePiece (ppDataList: any, detailed: any, salary: any) {
    // const { baseSalarys, ratedAttend } = salary
    // const { reqpvCoe } = detailed
    // let totalPrice = 0 // 总价
    // for (let i = 1; i <= 11; i++) {
    //   totalPrice = data[UnitPrice[i]] * detailed[Piece[i]] + totalPrice
    // }
    let totalPrice = 0 // 总价
    const { reqpvCoe } = detailed
    const { salaryStandard, ratedAttend } = salary
    for (let i = 0; i < ppDataList.length; i++) {
      let sectionMax = 0 // 区间最大值
      // 通过枚举拿到对应属性名
      let attribute = Piece[ppDataList[i].type]
      let unitPrice = 0 // 单项最大总价格暂存,当超过最大区间时取用
      for (let j = 0; j < ppDataList[i].ppInfoList.length; j++) {
        // 通过属性名拿到值
        const paresNum = detailed[attribute]
        if (!paresNum) {
          break
        }
        // 判断值是否在区间内
        if (ppDataList[i].ppInfoList[j].ppMin <= paresNum && ppDataList[i].ppInfoList[j].ppMax > paresNum) {
          totalPrice = totalPrice + ppDataList[i].ppInfoList[j].ppPrice * paresNum
          break
        } else if (sectionMax < ppDataList[i].ppInfoList[j].ppMax) {
          sectionMax = ppDataList[i].ppInfoList[j].ppMax
        }
        if (sectionMax <= paresNum) {
          unitPrice = paresNum * ppDataList[i].ppInfoList[j].ppPrice
        }
        if (j === ppDataList[i].ppInfoList.length - 1 || ppDataList[i].ppInfoList.length === 1) {
          totalPrice = totalPrice + unitPrice
        }
      }
    }
    const totalPrices = totalPrice * parseFloat(reqpvCoe) || 0 // 计件收入
    const priceNum = NumberFormatUtils.doubleFormat(totalPrices, 3) // 格式化计件收入，保留两位小数
    let priceNumN = (Number((Number((salaryStandard / ratedAttend).toFixed(10)) / 8).toFixed(3))) * detailed.reqpvNoHourNum || 0 // 计算非计件收入
    const priceNumNot = NumberFormatUtils.doubleFormat(priceNumN, 3) // 格式化非计件收入
    const bonus = (parseFloat(reqpvCoe) - 1) * totalPrice > 0 ? (parseFloat(reqpvCoe) - 1) * totalPrice : 0 // 计算计件奖金
    const priceBonus = NumberFormatUtils.doubleFormat(bonus, 3)
    return { priceNum, priceNumNot, priceBonus }
  }

  /**
   * 计算价格区间中最大价格和最小价格
   * @method PriceProcessing
   * @param {*} ppDataList   计件价格区间数组
   * @returns            返回一个价格对象
   */
  static PriceProcessing (ppDataList: any) {
    let priceData: any = {}
    for (let i = 0; i < ppDataList.length; i++) {
      let maxPrice = 0
      let minPrice = 0
      let price = 0
      const typeName = Piece[ppDataList[i].type]
      for (let j = 0; j < ppDataList[i].ppInfoList.length; j++) {
        price = Number(ppDataList[i].ppInfoList[j].ppPrice)
        if (maxPrice < price) {
          maxPrice = price
        }
        if (minPrice > price) {
          minPrice = price
        }
        if (j === 0) {
          minPrice = price
        }
      }
      if (Number(maxPrice) === Number(minPrice)) {
        priceData[typeName] = NumberFormatUtils.doubleFormat(maxPrice, 3)
      } else {
        priceData[typeName] = NumberFormatUtils.doubleFormat(minPrice, 3) + '~' + NumberFormatUtils.doubleFormat(maxPrice, 3) // 格式化数据保留三位小数
      }
    }
    return priceData
  }

  /**
   * 保留小数点，默认保留三位
   * @param v 待处理字符串
   * @param decimalsLen 小数点位数
   * @param intLen 整数位数
  */
  static toFixed (v: string, decimalsLen = Compute.decimalsLen, intLen = Compute.intLen) {
    v = v
      .substr(0, intLen + decimalsLen + 1)
      .replace(/[^\d.]/g, '')
      .replace(/^\./, '')
      .replace(/\.{3,}/g, '.')
      .replace('.', '$#$')
      .replace(/\./g, '')
      .replace('$#$', '.')
      .replace(new RegExp(`^(\\d+)\\.(\\d{0,${decimalsLen}}).*$`), '$1.$2')
      .replace(/^\d+/, (match: string) => {
        return (parseFloat(match) + '').substr(0, intLen)
      })
    return v
  }
}
