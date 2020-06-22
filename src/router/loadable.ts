/*
 * @description: 基于 react-loadable 封装的动态导入组件方法
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-04-03 14:47:29
 * @LastEditTime: 2019-04-04 09:24:13
 * @copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import Loadable from 'react-loadable'
import Loading from '@components/loading/Loading'
import { BaseProps } from 'typings/global'

export default (loader: () => Promise<React.ComponentType<BaseProps> | { default: React.ComponentType<BaseProps> } | any>) => {
  return Loadable({
    loader,
    loading: Loading,
    delay: 5000
  })
}
