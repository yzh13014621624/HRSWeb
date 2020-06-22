/**
 * @author minjie
 * @createTime 2019/05/15
 * @description 版本的显示
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from '@components/index'
import { ConfigUtil } from '@utils/index'
import './index.styl'

interface VersionProps {
  color: 'cus-version-color' | 'cus-version-color-b'
}

export default class Version extends RootComponent<VersionProps, any> {
  constructor (props:VersionProps) {
    super(props)
  }
  render () {
    let color = this.props.color
    let build = `${ConfigUtil.waterMark}  version: ${process.env.version}  build:${process.env.build}`
    return (
      <div className={`cus-version-content ${color}`}>{build}</div>
    )
  }
}
