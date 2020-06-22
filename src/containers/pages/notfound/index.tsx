/*
 * @description: 404页面 用于匹配路由匹配不到时
 * @author: yanzihao
 * @lastEditors: yanzihao
 * @Date: 2020-05-29 11:22:41
 * @LastEditTime: 2020-05-29 11:59:49
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent, Version } from '@components/index'
import notFound from '@assets/images/notfound/notfound.png'
import './index.styl'

export default class NotFound extends RootComponent {
  constructor (props:any) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div id="notfound">
        <img src={notFound} alt='' draggable={false} />
        <Version color="cus-version-color-b"/>
      </div>
    )
  }
}
