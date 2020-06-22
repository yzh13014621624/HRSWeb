/**
 * @author minjie
 * @createTime 2019/04/03
 * @description 时间月份的组件
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import RootComponent from '@components/root/RootComponent'
import { DatePicker } from 'antd'
import moment from 'moment'
import date from '@assets/images/date.png'

const { RangePicker } = DatePicker

interface BasicDatePickerProps {
  onChange?: any
}

interface BasicDatePickerState {
  selDate: Array<any>
  mode: Array<string>
}

export default class BasicDatePicker extends RootComponent<BasicDatePickerProps, BasicDatePickerState> {
  static getDerivedStateFromProps (nextProps:any) {
    if ('value' in nextProps) {
      return [...(nextProps.value || [])]
    }
    return []
  }

  constructor (props:any) {
    super(props)
    const value = props.value || []
    let dateFormat = 'YYYY-MM'
    this.state = {
      selDate: value.length > 0 ? [moment(value[0], dateFormat), moment(value[1], dateFormat)] : [],
      mode: ['month', 'month']
    }
  }

  /**
   * 组件销毁之前 对 state 的状态做出处理
   */
  componentWillUnmount () {
    this.setState = (state, callback) => {}
  }

  onChange = (selDate:any, datastring:any) => {
    this.setState({
      selDate
    })
    this.triggerChange(selDate)
  }

  /* 选择的事件 */
  handlePanelChange = (selDate:any, mode:any) => {
    this.setState({
      selDate,
      mode: [
        mode[0] === 'date' ? 'month' : mode[0],
        mode[1] === 'date' ? 'month' : mode[1]
      ]
    })
    this.triggerChange(selDate)
  }

  triggerChange = (changedValue:any) => {
    const onChange = this.props.onChange
    if (onChange) {
      if (changedValue.length === 0) {
        onChange([])
      } else {
        onChange([changedValue[0].format('YYYY-MM'), changedValue[1].format('YYYY-MM')])
      }
    }
  }

  render () {
    const { selDate, mode } = this.state
    const tdProps = {
      suffixIcon: <img src={date}/>,
      format: 'YYYY-MM',
      value: selDate,
      allowClear: true,
      mode: mode,
      onChange: this.onChange,
      onPanelChange: this.handlePanelChange,
      style: {
        width: '1.56rem'
      }
    }
    return (
      <RangePicker {...tdProps} placeholder={['请选择日期', '请选择日期']}/>
    )
  }
}
