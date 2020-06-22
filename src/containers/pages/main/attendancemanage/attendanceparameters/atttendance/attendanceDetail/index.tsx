/*
 * @description: 出勤参数-新增、编辑页面
 * @author: zhousong
 * @lastEditors: zhousong
 * @Date: 2019-09-23 17:45:12
 * @LastEditTime: 2020-05-28 17:39:45
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { hot } from 'react-hot-loader'
import { Prompt } from 'react-router-dom'
import { FormComponentProps } from 'antd/lib/form'
import { RootComponent, TableItem } from '@components/index'
import { Form, DatePicker, Row, Col, Input, Button, Spin, Icon } from 'antd'
import { BaseProps } from 'typings/global'
import MultipleDatePicker from '../../components/multipleDatePicker'
import date from '@assets/images/date.png'
import './index.styl'
import moment from 'moment'
import _ from 'lodash'

const FormItem = Form.Item
const TABLE_HEADER = [
  {
    title: '法定假日期',
    index: 0,
    name: 'hilidayDate'
  },
  {
    title: '法定假天数(天)',
    index: 1,
    name: 'holiday'
  },
  {
    title: '额定出勤天数-六天制(天)',
    index: 2,
    name: 'attendanceSix'
  },
  {
    title: '额定出勤天数-五天制(天)',
    index: 3,
    name: 'attendanceFive'
  }
]
let INIT_DATA = new Array(12)
for (let i = 0, length = INIT_DATA.length; i < length; i++) {
  INIT_DATA[i] = {
    festivalList: [],
    month: `${i + 1}`,
    legalHolidayNum: 0
  }
}

interface AttendanceDetailProps extends BaseProps, FormComponentProps {
}
interface AttendanceDetailState {
  yearPickerOpen: boolean,
  chooseYear: any,
  disable: boolean,
  holidayListData: any[],
  loading: boolean,
  isSetYear: any
}

@hot(module)
class AttendanceDetail extends RootComponent<AttendanceDetailProps, AttendanceDetailState> {
  timer: any = null
  constructor (props:AttendanceDetailProps) {
    super(props)
    this.state = {
      yearPickerOpen: false,
      chooseYear: null,
      disable: true,
      holidayListData: INIT_DATA,
      loading: false,
      isSetYear: 0
    }
  }

  componentDidMount () {
    const { params } = this.props.match
    if (!params.hasOwnProperty('id')) {
      /** 新增出勤参数，若存在缓存则读取 */
      const storage = this.getCachedFromStorage('attendanceDetail')
      if (storage) {
        const pageDataList = _.cloneDeep(storage.infoList)
        pageDataList.forEach((i: any) => {
          i.festivalList = i.legalHolidayDate ? i.legalHolidayDate.split('/') : []
        })
        this.setState({
          chooseYear: storage.ahpYear,
          holidayListData: pageDataList,
          isSetYear: storage.isSetYear
        }, () => {
          this.props.form.validateFields(['yearPicker'], { force: true })
          this.judgeButtonStatus()
        })
      }
    } else {
      /** 查看出勤参数，编辑 */
      this.setState({ loading: true })
      const AHP_ID = params.id
      this.axios.request(this.api.getAttendParamInfo, { ahpId: AHP_ID }, undefined, false).then(({ code, data }) => {
        if (code === 200) {
          const pageDataList = _.cloneDeep(data.attendParamDetailResponseList)
          pageDataList.forEach((i: any) => {
            i.festivalList = i.legalHolidayDate ? i.legalHolidayDate.split('/') : []
          })
          this.setState({
            chooseYear: data.ahpYear,
            holidayListData: pageDataList,
            loading: false,
            disable: false
          })
          this.getCurrentYearHolidays(data.ahpYear).then(({ code, data }: any) => {
            if (code === 200) {
              pageDataList.forEach((i: any, index: number) => {
                i.workList = data.holidayDetail[index].workList
              })
              this.setState({ holidayListData: pageDataList })
            }
          })
        }
      })
    }
  }

  componentWillUnmount () {
    clearTimeout(this.timer)
  }

  /** 获取当前年份节假日列表 */
  getCurrentYearHolidays = (year: string) => {
    return new Promise((resolve, reject) => {
      this.axios.request(this.api.getAttendParamInit, { ahpYear: year }, undefined, false).then(({ code, data }) => {
        resolve({ code, data })
      })
    })
  }

  accordingHolidaySetValue = (year: string) => {
    this.setState({ loading: true })
    this.getCurrentYearHolidays(year).then(({ code, data }: any) => {
      if (code === 200) {
        let deepHolidayDetail = _.cloneDeep(data.holidayDetail)
        deepHolidayDetail.forEach((element: any, index: any) => {
          const { totalFiveWorkDays, totalSixWorkDays } = this.calculatedDays(year, index, element.festivalList, element.workList)
          element.legalHolidayNum = element.festivalList.length
          element.ratedAttendanceFive = totalFiveWorkDays
          element.ratedAttendanceSix = totalSixWorkDays
        })
        this.setState({
          holidayListData: deepHolidayDetail,
          loading: false,
          isSetYear: data.isSetYear
        }, () => {
          this.setPageFormValues(deepHolidayDetail)
          this.props.form.validateFields(['yearPicker'], { force: true })
          this.judgeButtonStatus()
        })
      }
    })
  }

  /** 设置表单值 */
  setPageFormValues = (dataArray: any[]) => {
    const { setFieldsValue } = this.props.form
    dataArray.forEach((item, index) => {
      setFieldsValue({
        [`multiple-date-picker_${index}`]: item.festivalList,
        [`fiveDaysInput_${index}`]: item.ratedAttendanceFive,
        [`sixDaysInput_${index}`]: item.ratedAttendanceSix
      })
    })
  }

  /** 表单验证 */
  validateHolidayInput = (rules: any, value: any, callback: any) => {
    if (parseFloat(value) > 31) {
      callback(new Error('最多为31天！'))
    }
    callback()
  }

  validateYearPicker = (rules: any, value: any, callback: any) => {
    const { isSetYear } = this.state
    if (value && isSetYear === 1) {
      callback(new Error('该年度已设置出勤参数！'))
    }
    callback()
  }

  normalize = (value: any) => {
    const reg = /^[1-9]\d*$/
    if (value) {
      value = value instanceof String ? value.replace(/[^\d]/g, '') : value.toString().replace(/[^\d]/g, '')
      if (reg.test(value)) {
        return value
      }
    }
  }

  /** yearpicker事件开始 */
  onChangePage = (page: any) => {
    console.log(page)
  }

  onChangeYear = (value: any) => {
    this.props.form.setFieldsValue({ 'yearPicker': value })
    this.setState({
      yearPickerOpen: false,
      chooseYear: value.format('YYYY-MM-DD')
    })
    this.accordingHolidaySetValue(value.format('YYYY'))
    this.judgeButtonStatus()
  }

  onChangeOpen = (status: any) => {
    if (status) {
      this.setState({ yearPickerOpen: true })
    } else {
      this.setState({ yearPickerOpen: false })
    }
  }
  /** yearpicker事件结束 */

  /** 确定按钮disable状态 */
  judgeButtonStatus = () => {
    const { params } = this.props.match
    if (this.timer) clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      let disabled = false
      const formValues = this.props.form.getFieldsValue()
      const erros = this.props.form.getFieldsError()
      if (!params.hasOwnProperty('id')) {
        this.setCachedToStorage('attendanceDetail', this.dataReorganization(formValues))
      }
      _.forEach(formValues, (value) => {
        if (value === undefined || value === null || value === '') {
          disabled = true
        }
      })
      _.forEach(erros, (value) => {
        if (value !== undefined) {
          disabled = true
        }
      })
      this.setState({ disable: disabled })
    }, 50)
  }

  /** 数据重组处理 */
  dataReorganization = (filesValue: any): any => {
    const { holidayListData, isSetYear } = this.state
    const dataArray = _.cloneDeep(holidayListData)
    dataArray.forEach((c: any, i: number) => {
      c.ratedAttendanceFive = filesValue[`fiveDaysInput_${i}`]
      c.ratedAttendanceSix = filesValue[`sixDaysInput_${i}`]
      c.legalHolidayDate = filesValue[`multiple-date-picker_${i}`].join('/')
      delete c.festivalList
    })
    return {
      ahpYear: filesValue.yearPicker ? moment(filesValue.yearPicker).format('YYYY') : filesValue.yearPicker,
      infoList: dataArray,
      isSetYear
    }
  }

  /**
   * @description 计算传入月份的工作日
   * @param year 当前年份
   * @param month 对应月份在该年的月份索引
   * @param holidays 接口返回的法定节假日数组
   * @param workList 接口返回的调休日期数组
  */
  calculatedDays = (year: string, month: number, holidays: any[], workList: any[]) => {
    let totalSixWorkDays = 0
    let totalFiveWorkDays = 0
    const beginDate = moment(year).month(month).startOf('month')
    const endDate = moment([year, 0, 31]).month(month).endOf('d')
    const diff = endDate.diff(beginDate, 'd') + 1
    const startWeekDay = parseFloat(beginDate.format('E'))
    const endWeekDay = parseFloat(endDate.format('E'))
    const middleFullWeek = (diff - (7 - startWeekDay + 1) - endWeekDay) / 7
    // 双休制休息总天数
    let totalFiveWeekDays = middleFullWeek * 2 + (startWeekDay <= 6 ? 2 : 1) + (endWeekDay <= 5 ? 0 : (endWeekDay - 5))
    totalFiveWorkDays = diff - totalFiveWeekDays - holidays.length
    // 单休制休息总天数，默认周日休息
    let totalSixWeekDays = middleFullWeek + 1 + (endWeekDay <= 6 ? 0 : 1)
    totalSixWorkDays = diff - totalSixWeekDays - holidays.length
    holidays.forEach(i => {
      const holidayWeek = parseFloat(moment(i).format('E'))
      if (holidayWeek === 6) {
        totalFiveWorkDays += 1
      } else if (holidayWeek === 7) {
        totalSixWorkDays += 1
        totalFiveWorkDays += 1
      }
    })
    workList.forEach(i => {
      const workDayWeek = parseFloat(moment(i).format('E'))
      if (workDayWeek === 6) {
        totalFiveWorkDays += 1
      } else if (workDayWeek === 7) {
        totalSixWorkDays += 1
        totalFiveWorkDays += 1
      }
    })
    return {
      totalFiveWorkDays,
      totalSixWorkDays
    }
  }

  // 按钮禁用状态
  inputDaysDisabled = (ind: number, item: any) => {
    const { chooseYear } = this.state
    let chooseYearMoment
    if (chooseYear) {
      chooseYearMoment = moment(chooseYear).year()
    }
    const currentYear = moment().year()
    const currentMonth = moment().month()
    if (item.closeAccounts === 1 || item.hasUsed === 1) {
      return true
    }
    if (ind < currentMonth && currentYear === chooseYearMoment) {
      return true
    } else if (chooseYearMoment && currentYear > chooseYearMoment) {
      return true
    } else {
      return false
    }
  }

  /** 页面事件 */
  onChangeMultiplePicker = (value: any, index: number) => {
    const { chooseYear } = this.state
    const nextPageData = _.cloneDeep(this.state.holidayListData)
    const { totalFiveWorkDays, totalSixWorkDays } = this.calculatedDays(chooseYear, index, value, nextPageData[index].workList)
    nextPageData[index].festivalList = value
    nextPageData[index].legalHolidayNum = value.length || 0
    nextPageData[index].ratedAttendanceFive = totalFiveWorkDays
    nextPageData[index].ratedAttendanceSix = totalSixWorkDays
    this.setState({
      holidayListData: nextPageData
    }, () => {
      this.judgeButtonStatus()
      this.setPageFormValues(nextPageData)
    })
  }

  onCancel = () => {
    this.props.history.replace('/home/attendanceparameters')
  }

  onConfirm = () => {
    const { params } = this.props.match
    const isEdit = params.hasOwnProperty('id')
    let requestApi = this.api.insertAttendParam
    let tipText = '新增出勤参数成功！'
    if (isEdit) {
      requestApi = this.api.updateAttendParam
      tipText = '修改出勤参数成功！'
    }
    this.props.form.validateFields((err: any, value: any) => {
      if (err) return
      const payload = this.dataReorganization(value)
      if (isEdit) {
        payload.ahpId = params.id
      }
      this.axios.request(requestApi, payload, undefined, false).then(({ code }) => {
        if (code === 200) {
          if (!isEdit) {
            this.removeCachedStorage('attendanceDetail')
          }
          this.$message.success(tipText)
          this.onCancel()
        }
      })
    })
  }

  render () {
    const {
      props: { form: { getFieldDecorator }, match: { params } },
      state: { yearPickerOpen, chooseYear, disable, holidayListData, loading },
      isAuthenticated,
      AuthorityList: { composeParam }
    } = this
    return (
      <div className='attendance-detail'>
        <FormItem label={<span className='detail-label'>出勤参数所属年度</span>} colon={false}>
          {
            getFieldDecorator('yearPicker', {
              rules: [
                {
                  required: true,
                  message: '请选择出勤参数所属年度'
                },
                {
                  validator: this.validateYearPicker
                }
              ],
              initialValue: chooseYear ? moment(chooseYear) : null
            })(
              <DatePicker
                suffixIcon={<img src={date}/>}
                mode='year'
                format='YYYY'
                allowClear={true}
                placeholder='请选择年度'
                disabled={params.hasOwnProperty('id')}
                onPanelChange={this.onChangeYear}
                open={yearPickerOpen}
                onOpenChange={this.onChangeOpen}
                onChange={() => { this.setState({ chooseYear: null }); this.judgeButtonStatus() }}
              />
            )
          }
        </FormItem>
        <div className='attendance-config-conten'>
          <div className='attendance-config'>出勤参数配置</div>
          {params.hasOwnProperty('id') && <div className='config-tips'><Icon className='icon' type="info-circle" />薪资已关账月份、已有排班或考勤数据的月份、已过完的自然月份不可再次编辑修改！</div>}
        </div>
        <div className='table-box'>
          <Row className='table-row-title-bg'>
            <Col span={3}></Col>
            <Col span={21}>
              <Row type="flex" justify="space-around" className='table-row-title'>
                <Col span={2}>1月</Col>
                <Col span={2}>2月</Col>
                <Col span={2}>3月</Col>
                <Col span={2}>4月</Col>
                <Col span={2}>5月</Col>
                <Col span={2}>6月</Col>
                <Col span={2}>7月</Col>
                <Col span={2}>8月</Col>
                <Col span={2}>9月</Col>
                <Col span={2}>10月</Col>
                <Col span={2}>11月</Col>
                <Col span={2}>12月</Col>
              </Row>
            </Col>
          </Row>
          <Spin spinning={loading}>
            <Row className='table-body'>
              <Col span={3} className='table-left-title'>
                {TABLE_HEADER.map((item, index) => {
                  return <div className={`left-title-item ${index === 2 || index === 3 ? 'required' : ''}`} key={item.index} title={item.title}>{item.title}</div>
                })}
              </Col>
              <Col span={21}>
                <Row type="flex" justify="space-around" className='table-row table-body-row'>
                  {
                    holidayListData.map((i: any, ind: number) => {
                      return (
                        <Col span={2} key={ind}>
                          <FormItem className='tab-columns'>
                            {getFieldDecorator(`multiple-date-picker_${ind}`, {
                              initialValue: i.festivalList
                            })(
                              <MultipleDatePicker
                                onChange={(value) => this.onChangeMultiplePicker(value, ind)}
                                privateClassName={`multiple-date-picker${ind}`}
                                defaultPickerValue={`${chooseYear ? chooseYear.split('-')[0] : moment().format('YYYY')}-${i.month}`}
                                key={`multiple_${ind}`}
                                disabled={this.inputDaysDisabled(ind, i)}
                              />
                            )}
                          </FormItem>
                          <FormItem className='tab-columns'>
                            <div>{i.legalHolidayNum}</div>
                          </FormItem>
                          <FormItem className='tab-columns'>
                            {
                              getFieldDecorator(`sixDaysInput_${ind}`, {
                                initialValue: i.ratedAttendanceSix,
                                normalize: this.normalize,
                                rules: [
                                  {
                                    required: true,
                                    message: '请输入天数'
                                  },
                                  {
                                    validator: this.validateHolidayInput
                                  }
                                ]
                              })(
                                <Input maxLength={2} className='rated-attendance' disabled={this.inputDaysDisabled(ind, i)} allowClear onChange={this.judgeButtonStatus} />
                              )
                            }
                          </FormItem>
                          <FormItem className='tab-columns'>
                            {
                              getFieldDecorator(`fiveDaysInput_${ind}`, {
                                initialValue: i.ratedAttendanceFive || undefined,
                                normalize: this.normalize,
                                rules: [
                                  {
                                    required: true,
                                    message: '请输入天数'
                                  },
                                  {
                                    validator: this.validateHolidayInput
                                  }
                                ]
                              })(
                                <Input maxLength={2} className='rated-attendance' disabled={this.inputDaysDisabled(ind, i)} allowClear onChange={this.judgeButtonStatus} />
                              )
                            }
                          </FormItem>
                        </Col>
                      )
                    })
                  }
                </Row>
              </Col>
            </Row>
          </Spin>
        </div>
        <div className='action-button-group'>
          {
            chooseYear
              ? (moment(chooseYear).year() >= moment().year() && !this.inputDaysDisabled(11, holidayListData[11]) && isAuthenticated(composeParam[2]) && <Button className='action-button' type='primary' disabled={disable} onClick={this.onConfirm}>确定</Button>)
              : <Button className='action-button' type='primary' disabled={disable} onClick={this.onConfirm}>确定</Button>
          }
          <Button className='action-button' onClick={this.onCancel}>{chooseYear ? ((moment(chooseYear).year() >= moment().year() && !this.inputDaysDisabled(11, holidayListData[11])) && isAuthenticated(composeParam[2]) ? '取消' : '返回') : '取消'}</Button>
        </div>
        {!params.hasOwnProperty('id') && <Prompt when message={`attendanceDetail`} />}
      </div>
    )
  }
}
export default Form.create<AttendanceDetailProps>()(AttendanceDetail)
