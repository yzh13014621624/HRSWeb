/*
 * @description: 日统计主页面中的人数统计信息组件
 * @author: yanzihao
 * @lastEditors: yanzihao
 * @Date: 2020-05-06 09:18:04
 * @LastEditTime: 2020-05-06 12:42:17
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { hot } from 'react-hot-loader'
import { RootComponent } from '@components/index'
import './index.styl'
interface DayStatisticsNumProps {
  count: Number
  title: String
}
interface DayStatisticsState {
}

export default class DayStatisticsNum extends RootComponent<DayStatisticsNumProps, DayStatisticsState> {
  constructor (props: DayStatisticsNumProps) {
    super(props)
  }

  render () {
    const { props: { count, title } } = this
    return (
      <div id='daystatisticsnum'>
        <div className='box'>
          <div className='num'>{count}</div>
          <div className='title'>{title}</div>
        </div>
      </div>
    )
  }
}
