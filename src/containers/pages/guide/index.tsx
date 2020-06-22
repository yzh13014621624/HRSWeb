/*
 * @description: 引导页
 * @author: minjie
 * @createTime: 2019/5/7
 * @copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from '@components/index'
import { Button } from 'antd'
import bg from '@assets/images/guide/bg.png'
import chromeLogo from '@assets/images/svg/guide/chrome-logo.svg'
import text from '@assets/images/guide/text.png'
import bootomRight from '@assets/images/guide/bootom-right.png'

import { SysUtil } from '@utils/index'

import './guide.styl'

const guidStyle = {
  backgroundImage: `url(${bg})`
}

export default class GuidePage extends RootComponent {
  constructor (props:any) {
    super(props)
  }

  /** 下载 */
  clickFun = () => {
    var agent = navigator.userAgent.toLowerCase()
    var isMac = /macintosh|mac os x/i.test(navigator.userAgent)
    if (agent.indexOf('win32') >= 0 || agent.indexOf('wow32') >= 0 || agent.indexOf('win64') >= 0 || agent.indexOf('wow64') >= 0) { // 这是windows32位系统
      window.location.href = 'https://www.baidu.com/link?url=qAVl7cwoIiTquuciR606qm7ofYE968IKyFRhECumY9I7C0c__0d2IDEIN0dt8NacMMmZDQkiQuU89qSw8DhKYlWdCY8gK9jJ14VyxfxaI5oqHHJt0ND9_vF9-XUbYCIioWX7iFTmPbol46Qivg1nUuuc4JVk0fX4hTJPuF83Q7a&wd=&eqid=c67faba6000456c1000000045cd171a9'
    }
    if (isMac) { // 这是mac系统
      window.location.href = 'https://dl.google.com/chrome/mac/stable/GGRO/googlechrome.dmg'
    }
  }

  render () {
    if (SysUtil.getBrowserInfo('Chrome')) {
      window.location.href = '/'
    } else {
      return (
        <div className='guide-content'>
          <div style={guidStyle}>
            <p className="p1"><img src={chromeLogo}></img></p>
            <p className="p2"><img src={text}></img></p>
            <p><Button type="primary" onClick={this.clickFun} shape="round">下 载</Button></p>
          </div>
          <img className="bootom-right" src={bootomRight}></img>
        </div>
      )
    }
  }
}
