/*
 * @description: husky 配置文件
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2020-03-16 14:08:33
 * @LastEditTime: 2020-03-17 13:11:57
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
// 若是想跳过当前次钩子函数拦截，使用 --no-verify 指令：git add . && git commit --no-verify -m 'your commit message'
module.exports = {
  hooks: {
    "pre-commit": "npm run lint-staged",
    "commit-msg": "commitLint -c=true -E HUSKY_GIT_PARAMS"
  }
}