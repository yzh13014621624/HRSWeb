/**
 * @author minjie
 * @createTime 2019/04/03
 * @description 加载动画
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import RootComponent from '@components/root/RootComponent'
import { Spin, Button } from 'antd'
import './Loading.less'
import { LoadingComponentProps } from 'react-loadable'

interface LoadingState {
}

export default class Loading extends RootComponent<LoadingComponentProps, LoadingState> {
  constructor (props:LoadingComponentProps) {
    super(props)
  }

  /** 重新加载 */
  reload = () => {
    window.location.reload()
  }

  render () {
    const { error, timedOut, pastDelay, isLoading } = this.props
    if (error) {
      return (
        <div className="loading-content">
          <Button className="loading-btn" size="small" onClick={this.reload}>重新加载</Button>
        </div>
      )
    } else if (timedOut) {
      return (
        <div className="loading-content">
          <Button className="loading-btn" size="small" onClick={this.reload}>重新加载</Button>
        </div>
      )
    } else if (pastDelay || isLoading) {
      return (
        <div className="loading-content">
          <Spin size="large" className="loading-spin" tip="加载中......"/>
        </div>
      )
    } else {
      return null
    }
  }
}
