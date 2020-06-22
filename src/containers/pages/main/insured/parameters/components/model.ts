/**
 * @author minjie
 * @createTime 2019/04/20
 * @description 规则等一些的信息
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

/** 查询规则 */
export const standardRules = [
  { value: 1, label: '四舍五入到分' },
  { value: 2, label: '四舍五入到角' },
  { value: 3, label: '四舍五入到元' },
  { value: 4, label: '见分进角' },
  { value: 5, label: '见分进元' },
  { value: 6, label: '见角进元' },
  { value: 7, label: '取整舍尾' },
  { value: 8, label: '见厘进分' },
  { value: 9, label: '四舍五入到厘' }
]

export class Standard {
  id:number = 0 // 主键
  oldInsurance = '' // 养老险
  medicalCareIns = '' // 医疗险
  unemploymentIns = '' // 失业险
  injuryIns = '' // 工伤险
  birthIns = '' // 生育险
  bigCareIns = '' // 大病医疗险
  supMedicalIns = '' // 补充医疗险
  residualPremium = '' // 残保金
  accFund = '' // 公积金
  supAccFund = '' // 补充公积金
  ruleId:number = 0 // 参保规则id
  insuranceStandardsId:number = 0 // 参保标准主表id
  standardName = '' // 参保标准名称
  createTime = '' // 创建时间
}

// 养老险 医疗险 失业险 工伤险 生育险 大病医疗险 补充医疗险 残保金 公积金 补充公积金
export const StandardAry = [
  { name: 'oldInsurance', guarantee: false, required: true }, // 养老险
  { name: 'medicalCareIns', guarantee: false, required: true }, // 医疗险
  { name: 'unemploymentIns', guarantee: false, required: true }, // 失业险
  { name: 'injuryIns', guarantee: false, required: true }, // 工伤险
  { name: 'birthIns', guarantee: false, required: true }, // 生育险
  { name: 'bigCareIns', guarantee: false, required: false }, // 大病医疗险
  { name: 'supMedicalIns', guarantee: false, required: false }, // 补充医疗险
  { name: 'residualPremium', guarantee: true, required: true }, // 残保金
  { name: 'accFund', guarantee: false, required: true }, // 公积金
  { name: 'supAccFund', guarantee: false, required: false } // 补充公积金
]

/** stand 配合验证的 */
let disableStandName:any = ['standardName']
StandardAry.forEach((el:any) => {
  if (el.required === true) {
    if (el.name === 'residualPremium') {
      disableStandName.push(el.name + '-' + 4)
    } else {
      for (let index = 1; index <= 7; index++) {
        disableStandName.push(el.name + '-' + index)
      }
    }
  }
})
export const disableStandNameAry = disableStandName

/** 城市的 */
export const cityAry = [
  { name: 'oldInsurance', guarantee: false, required: true }, // 养老险
  { name: 'medicalCareIns', guarantee: false, required: true }, // 医疗险
  { name: 'unemploymentIns', guarantee: false, required: true }, // 失业险
  { name: 'injuryIns', guarantee: false, required: true }, // 工伤险
  { name: 'birthIns', guarantee: false, required: true }, // 生育险
  { name: 'bigCareIns', guarantee: false, required: false }, // 大病医疗险
  { name: 'supMedicalIns', guarantee: false, required: false }, // 补充医疗险
  { name: 'residualPremium', guarantee: true, required: false }, // 残保金
  { name: 'accFund', guarantee: false, required: true }, // 公积金
  { name: 'supAccFund', guarantee: false, required: false } // 补充公积金
]

/** city 配合验证的 */
let disableName:any = ['icName']
cityAry.forEach((el:any) => {
  if (el.required === true) {
    for (let index = 8; index <= 15; index++) {
      disableName.push(el.name + '-' + index)
    }
  }
})
export const disableCityNameAry = disableName

let arys = []
let aryTops = []
let AryBottoms = []
for (let index = 1; index <= 31; index++) {
  arys.push({ lable: `当月${index}日`, value: `当月${index}日` })
  aryTops.push({ lable: `上月${index}日`, value: `上月${index}日` })
  AryBottoms.push({ lable: `下月${index}日`, value: `下月${index}日` })
}
export const ary = arys
export const aryTop = aryTops
export const aryBottom = AryBottoms
