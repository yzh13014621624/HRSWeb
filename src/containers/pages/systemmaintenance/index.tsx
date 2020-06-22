/*
 * @description: 系统维护 用于系统服务升级和版本更新
 * @author: yanzihao
 * @lastEditors: yanzihao
 * @Date: 2020-05-29 11:24:02
 * @LastEditTime: 2020-05-29 14:13:56
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent, Version } from '@components/index'
import systemMaintenance from '@assets/images/systemmaintenance/systemmaintenance.png'
import './index.styl'

export default class SystemMaintenance extends RootComponent {
  constructor (props:any) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div id="systemmaintenance">
        <img src={systemMaintenance} alt='' draggable={false}/>
        <Version color="cus-version-color-b"/>
      </div>
    )
  }
}
