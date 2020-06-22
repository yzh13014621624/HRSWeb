/*
 * @description: 加载 svg 文件
 * @author: huxianghe
 * @Date: 2019-05-13 16:30:34
 * @lastEditors: huxianghe
 * @LastEditTime: 2019-05-20 14:28:15
 * @copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
const requireAll: (requireContext: __WebpackModuleApi.RequireContext) => any[] = requireContext => requireContext.keys().map(requireContext)
const context = require.context('./svg', true, /\.svg$/)
requireAll(context)
