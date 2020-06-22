/**
 * @author minjie
 * @createTime 2019/04/03
 * @description 主界面
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import RootComponent from '@components/root/RootComponent'
import { hot } from 'react-hot-loader'
import '../style/homeinfo.styl'
import homeinfo1 from '@assets/images/home/home-info-1.png'
import homeinfo2 from '@assets/images/svg/home/home-info-2.svg'
import homeinfo3 from '@assets/images/home/home-info-3.png'

@hot(module) // 热更新（局部刷新界面）
export default class HomeInfo extends RootComponent {
  render () {
    return (
      <div className="home-info">
        <img className="home-img-right-top" src={homeinfo2}></img>
        <img className="home-img-center" src={homeinfo1}></img>
        <img className="home-img-bottom" src={homeinfo3}></img>
      </div>
    )
  }
}
