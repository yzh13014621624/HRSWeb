/*
 * @description: 所有权限列表
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-05-07 10:42:45
 * @LastEditTime: 2019-09-23 10:03:53
 * @copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
const files = require.context('.', true, /\.ts$/)
const authorityList: any = {}
const regFileName = /^\.\/(\w+\/)?|\.ts$/g

files.keys().forEach((key: string) => {
  authorityList[key.replace(regFileName, '')] = files(key).default
})

export default authorityList
