/*
 * @description: 剔除每个项目不需要的薪资字段
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-10-10 14:47:20
 * @LastEditTime: 2019-10-10 14:47:31
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

export { salaryCategory }
