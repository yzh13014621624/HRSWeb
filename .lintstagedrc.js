/*
 * @description: lint-staged 配置文件
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2020-03-16 14:08:46
 * @LastEditTime: 2020-03-16 14:09:40
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
module.exports = {
  'src/**/*.{js,ts,jsx,tsx}': ['npm run lint:js', 'git add .']
}