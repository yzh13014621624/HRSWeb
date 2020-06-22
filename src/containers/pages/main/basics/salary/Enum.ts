/*
 * @description: 薪资枚举
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-09-24 11:02:39
 * @LastEditTime: 2019-10-10 11:40:01
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import { KeyValue } from 'typings/global'

// 每个项目不包含的字段
const salaryCategory: KeyValue = {
  '上嘉': ['rankId', 'hierarchySalary'],
  '盒马': [
    'salaryType', 'levelId', 'gradeId',
    'salaryProbation',
    'otherSalary',
    'postSalary', 'mealStandard', 'roomStandard', 'forkliftStandard', 'unionFee', 'overtimeBase'
  ],
  '物美': [
    'salaryType', 'levelId', 'gradeId', 'rankId',
    'probationBaseSalary', 'probationPerSalary', 'salaryProbation',
    'performanceSalary', 'hierarchySalary', 'performanceBonus', 'otherSalary',
    'postSalary', 'mealStandard', 'roomStandard', 'forkliftStandard', 'unionFee', 'overtimeBase'
  ]
}

enum Period {
  '无试用期' = 0,
  '1个月' = 1,
  '2个月' = 2,
  '3个月' = 3,
  '4个月' = 4,
  '5个月' = 5,
  '6个月' = 6
}

export { salaryCategory, Period }
