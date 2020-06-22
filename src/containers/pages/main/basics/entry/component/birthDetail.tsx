/**
 * @author minjie
 * @createTime 2019/04/25
 * @description 出身日期显示的详情
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import React from 'react'
import { RootComponent } from '@components/index'

interface BirthDetailProps {
}

interface BirthDetailState {
  birth: string
}
/**
 * 显示生日的组件
 */
export default class BirthDetail extends RootComponent<BirthDetailProps, BirthDetailState> {
  constructor (props:any) {
    super(props)
    const value = props.value || '根据身份证号获取'
    this.state = {
      birth: value
    }
  }

  static getDerivedStateFromProps (props:any, state:any) {
    if ('value' in props) {
      const value = props.value || '根据身份证号获取'
      return {
        birth: value
      }
    }
    return null
  }

  render () {
    const { birth } = this.state
    let flg = birth === '根据身份证号获取'
    return (
      <span className="detail" style={ flg ? { color: '#c0c0c0' } : {} }>{birth}</span>
    )
  }
}
