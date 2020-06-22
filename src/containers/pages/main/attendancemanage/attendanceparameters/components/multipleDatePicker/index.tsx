/*
 * @description: 可多选日期组件
 * @author: zhousong
 * @lastEditors: zhousong
 * @Date: 2019-09-23 11:24:01
 * @LastEditTime: 2019-11-04 15:43:21
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import 'antd/dist/antd.css'
import './index.styl'
import { DatePicker, Button, Checkbox, Input } from 'antd'
import _ from 'lodash'
import moment from 'moment'
import $ from 'jquery'
import 'moment/locale/zh-cn'
import date from '@assets/images/date.png'
import { compareDeep } from '@utils/index'
moment.locale('zh-cn')

interface MultipleDatePickerProps {
  value?: any[],
  onChange: (dateArray: any) => void,
  privateClassName: string,
  defaultPickerValue: string,
  disabled?: boolean
}

interface MultipleDatePickerState {
  open: boolean,
  dateArray: any[]
}

export default class MultipleDatePicker extends PureComponent<MultipleDatePickerProps, MultipleDatePickerState> {
  constructor (props: MultipleDatePickerProps) {
    super(props)
    this.state = {
      open: false,
      dateArray: [] // 用于保存选择的时间
    }
  }

  timer: any = {
    didMountTimer: undefined,
    openChangeTimer: undefined,
    resetTimer: undefined,
    setViewTimer: undefined,
    dateInputValueChange: undefined
  }

  UNSAFE_componentWillReceiveProps (props: any) {
    if (!compareDeep(this.props.value, props.value)) {
      this.setState({ dateArray: props.value })
    }
  }

  // 处理默认值
  handleDefaultValue = (currentDate: any = '') => {
    const { value = [] } = this.props
    this.setState({
      dateArray: value
    })
  }

  // 点击日期的时候触发的方法
  handleDateArray = ({ date, ischecked }: any) => {
    let newDateArray = [...this.state.dateArray]
    if (ischecked === true) {
      newDateArray.push(date)
    } else {
      _.remove(newDateArray, item => {
        return item === date
      })
    }

    this.setState(
      {
        dateArray: newDateArray
      }
    )
  }

  handleViewInputValue = (dateArray: any[]) => {
    let actualInputValue = ''
    if (!dateArray || dateArray.length === 0) return actualInputValue
    dateArray.forEach((item: any, index: number) => {
      if (index !== 0) {
        actualInputValue += '/'
      }
      let eachDayArray = item.split('-')
      actualInputValue += eachDayArray[2] + '号'
    })
    return actualInputValue
  }

  componentDidMount () {
    const { privateClassName } = this.props
    this.handleDefaultValue()
    let _this = this
    $(function () {
      $(document).on('click', `.multdate.${privateClassName}`, function () {
        $(this).each(function () {
          let { dataset } = $(this)[0]
          let { date } = dataset
          if (dataset['disabled'] === 'false') {
            let ischecked = false
            $(this)
              .toggleClass('selectedDate')
              .parent()
              .attr('class', 'ant-calendar-cell') // 处理样式
            if ($(this).hasClass('selectedDate')) {
              ischecked = true
            }
            _this.handleDateArray({ date, ischecked })
            _this.timer.didMountTimer = setTimeout(() => {
              let actualInputValue = _this.handleViewInputValue(_this.state.dateArray)
              $(`.${privateClassName} .ant-calendar-input`).val(function () {
                return actualInputValue
              })
            }, 0)
          }
        })
      })
    })
  }

  componentWillUnmount () {
    for (let key in this.timer) {
      clearTimeout(this.timer[key])
    }
    $(document).off('click')
  }

  onOpenDateCalender = () => {
    const { privateClassName } = this.props
    this.setState({
      open: true
    }, () => {
      let actualInputValue = this.handleViewInputValue(this.state.dateArray)
      this.timer.openChangeTimer = setTimeout(() => {
        $(`.${privateClassName} .ant-calendar-input`).val(function () {
          return actualInputValue
        })
      }, 0)
    })
  }

  dateRender = (currentDate: any, today: any) => {
    const { dateArray } = this.state
    const { privateClassName } = this.props
    let disabled = 'false'
    let addSelectedDateClass = ''
    const style = {}
    const stringDate = currentDate.format('YYYY-MM-DD')
    const { defaultPickerValue } = this.props
    if ((currentDate.year() !== moment(defaultPickerValue).year()) || (currentDate.month() !== (moment(defaultPickerValue).month()))) {
      disabled = 'true'
    }

    // 输出日期的时候判断是否在选择的日期列表中 , 存在则添加一个样式
    if (dateArray.indexOf(stringDate) > -1) {
      addSelectedDateClass = 'selectedDate'
    }

    return (
      <div
        data-disabled={disabled}
        data-date={stringDate}
        className={`ant-calendar-date multdate ${privateClassName} ${addSelectedDateClass}`}
        style={style}
      >
        {currentDate.date()}
      </div>
    )
  }

  disableTime = (current: any) => {
    const { defaultPickerValue } = this.props
    if ((current.year() !== moment(defaultPickerValue).year()) || (current.month() !== (moment(defaultPickerValue).month()))) {
      return true
    } else {
      return false
    }
  }

  // 关闭 隐藏显示 日历选择控件
  closeDatePicker = () => {
    const { dateArray } = this.state
    this.setState(
      {
        open: false
      },
      () => {
        try {
          this.props.onChange(dateArray)
        } catch (error) {}
      }
    )
  }

  onResetInputValue = () => {
    const { privateClassName } = this.props
    this.setState({
      dateArray: []
    })
    this.timer.resetTimer = setTimeout(() => {
      $(`.${privateClassName} .ant-calendar-input`).val(function () {
        return ' '
      })
    }, 0)
  }

  onClearVirturalInput = (value: any) => {
    this.setState({
      dateArray: []
    })
    this.props.onChange([])
  }

  onDateInputValueChange = (value: any) => {
    if (value === null) {
      this.setState({ dateArray: [] })
    } else {
      const { privateClassName } = this.props
      let actualInputValue = this.handleViewInputValue(this.state.dateArray)
      this.timer.dateInputValueChange = setTimeout(() => {
        $(`.${privateClassName} .ant-calendar-input`).val(function () {
          return actualInputValue
        })
      }, 0)
    }
  }

  // 日历控件 底下的内容
  dateFooterContent = (mode: any) => {
    return (
      <div style={{ textAlign: 'right' }}>
        <Button
          onClick={this.onResetInputValue}
          style={{ marginRight: 10 }}
          size='small'
        >
          重置时间
        </Button>
        <Button
          onClick={this.closeDatePicker}
          style={{ marginRight: 10 }}
          size='small'
        >
          取消
        </Button>
        <Button
          onClick={this.closeDatePicker}
          type='primary'
          size='small'
        >
          确定
        </Button>
      </div>
    )
  }

  render () {
    const { privateClassName, defaultPickerValue, disabled = false } = this.props
    return (
      <div className='multiple-date-picker'>
        <DatePicker
          className={privateClassName}
          dropdownClassName={privateClassName}
          showToday={false}
          open={this.state.open}
          dateRender={this.dateRender}
          onChange={this.onDateInputValueChange}
          renderExtraFooter={this.dateFooterContent}
          defaultPickerValue={moment(defaultPickerValue)}
          disabledDate={this.disableTime}
          disabled={disabled}
        />
        <span>
          <div>
            <Input
              className='virtual-input'
              placeholder='请选择日期'
              value={this.handleViewInputValue(this.state.dateArray)}
              onFocus={this.onOpenDateCalender}
              onChange={this.onClearVirturalInput}
              suffix={<img className='anticon anticon-close-circle' src={date}/>}
              allowClear
              disabled={disabled}
            />
          </div>
        </span>
      </div>
    )
  }
}
