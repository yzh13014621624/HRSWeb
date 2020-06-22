/**
 * @author minjie
 * @createTime 2019/04/03
 * @description 时间的组件
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import RootComponent from '@components/root/RootComponent'
import { DatePicker } from 'antd'
import moment from 'moment'
import date from '@assets/images/date.png'

const { MonthPicker, RangePicker } = DatePicker

interface BasicDatePickerProps {
  onChange?: any
  month?: boolean
  dateFormat?: string // 格式化
}

interface BasicDatePickerState {
  one:any
  two:any
}

export default class BasicDatePicker extends RootComponent<BasicDatePickerProps, BasicDatePickerState> {
  static getDerivedStateFromProps (nextProps:any) {
    if ('value' in nextProps) {
      return {
        ...(nextProps.value || {})
      }
    }
    return null
  }

  constructor (props:any) {
    super(props)
    const value = props.value || {}
    this.state = {
      one: value.one || undefined,
      two: value.two || undefined
    }
  }

  /**
   * 组件销毁之前 对 state 的状态做出处理
   */
  componentWillUnmount () {
    this.setState = (state, callback) => {}
  }

  isDateFormat = () => {
    let dateFormat = 'YYYY-MM-DD'
    // 获取到那个值然后 赋值
    if (this.props.month) {
      dateFormat = 'YYYY-MM'
    } else {
      // 判断是否存在 自定义的格式化的新信息 存在的话则 进行赋值
      dateFormat = this.props.dateFormat ? this.props.dateFormat : dateFormat
    }
    return dateFormat
  }

  /* 选择的事件 */
  dateOnePickerChange = (date: any, one: string) => {
    if (!('value' in this.props)) {
      this.setState({ one })
    }
    this.triggerChange({ one })
  }

  dateTwoPickerChange = (date: any, two: string) => {
    if (!('value' in this.props)) {
      this.setState({ two })
    }
    this.triggerChange({ two })
  }

  triggerChange = (changedValue:any) => {
    const onChange = this.props.onChange
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue))
    }
  }

  render () {
    const tdProps = {
      allowClear: true,
      autoFocus: false,
      suffixIcon: <img src={date}/>
    }
    if (this.props.month) {
      return (
        <div>
          <MonthPicker style={{ width: 180 }} {...tdProps} onChange={this.dateOnePickerChange}
            value={this.state.one ? moment(this.state.one, this.isDateFormat()) : undefined}/>
          <MonthPicker style={{ width: 180, marginLeft: 10 }} {...tdProps} onChange={this.dateTwoPickerChange}
            value={this.state.two ? moment(this.state.two, this.isDateFormat()) : undefined}/>
        </div>
      )
    } else {
      return (
        <div>
          <DatePicker showToday={false} style={{ width: 180 }} {...tdProps} onChange={this.dateOnePickerChange}
            value={this.state.one ? moment(this.state.one, this.isDateFormat()) : undefined}/>
          <DatePicker showToday={false} style={{ width: 180, marginLeft: 10 }} {...tdProps} onChange={this.dateTwoPickerChange}
            value={this.state.two ? moment(this.state.two, this.isDateFormat()) : undefined}/>
        </div>
      )
    }
  }
}
