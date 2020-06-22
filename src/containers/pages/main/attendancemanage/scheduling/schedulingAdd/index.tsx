/*
 * @description: 考勤排版
 * @author: songliubiao
 * @lastEditors: songliubiao
 * @Date: 2019-09-19 14:52:39
 * @LastEditTime: 2020-06-08 17:19:12
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { hot } from 'react-hot-loader'
import { Prompt } from 'react-router-dom'
import { RootComponent, TableItem, BasicModal } from '@components/index'
import { Button, Form, Row, DatePicker, Input, Icon, Spin, Select, Col } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { IconPer1 } from '@components/icon/BasicIcon'
import { BaseProps } from 'typings/global'
import HttpUtil from '@utils/HttpUtil'
import rest from '@assets/images/main/salary/rest.png'
import absenteeism from '@assets/images/main/salary/absenteeism.png'
import overtime from '@assets/images/main/salary/overtime.png'
import './index.styl'
import _ from 'lodash'
import moment from 'moment'
const { Option } = Select
const { Item } = Form

const STATISTIC_ARRAY = [
  {
    title: '额定出勤天数',
    value: 0,
    name: 'ratedAttend'
  },
  {
    title: '额定法定假天数',
    value: 0,
    name: 'ratedHolidayAttend'
  },
  {
    title: '实际应出勤天数',
    value: 0,
    name: 'realAttend'
  },
  {
    title: '实际法定假出勤天数',
    value: 0,
    name: 'realLegalHoliday'
  },
  {
    title: '实际病假天数（a）',
    value: 0,
    name: 'realSick'
  },
  {
    title: '实际事假天数（b）',
    value: 0,
    name: 'realThing'
  },
  {
    title: '实际产前假天数（c）',
    value: 0,
    name: 'realMaternityBefore'
  },
  {
    title: '实际产假天数（d）',
    value: 0,
    name: 'realMaternityIn'
  },
  {
    title: '实际产后假天数（e）',
    value: 0,
    name: 'realMaternityAfter'
  },
  {
    title: '实际陪产假天数（f）',
    value: 0,
    name: 'realMaternityWith'
  },
  {
    title: '实际婚假天数（g）',
    value: 0,
    name: 'realMarried'
  },
  {
    title: '实际年假天数（h）',
    value: 0,
    name: 'realYear'
  },
  {
    title: '实际丧假天数（i）',
    value: 0,
    name: 'realFuneral'
  },
  {
    title: '实际产检假天数（j）',
    value: 0,
    name: 'realMaternityCheck'
  },
  {
    title: '实际旷工天数（z）',
    value: 0,
    name: 'realAbsent'
  },
  {
    title: '本月有效出勤天数',
    value: 0,
    name: 'monthValidAttend'
  },
  {
    title: '本月薪资试用期天数',
    value: 0,
    name: 'monthSalaryProbation'
  },
  {
    title: '本月薪资转正天数',
    value: 0,
    name: 'monthSalaryFormal'
  }
]

interface SchedulingAddProps extends BaseProps, FormComponentProps {

}
interface SchedulingAddState {
  disabledButton: boolean //  提交按钮
  userId: any // 用户id
  schedulingInfo: any, // 排班详情
  statistic: any[], // 统计表格列表
  loading: boolean,
  holidayParam: any[], // 节假日参数
  workdayParam: any[], // 工作日参数
  attendStatus: any
}
@hot(module)
class SchedulingAdd extends RootComponent<SchedulingAddProps, SchedulingAddState> {
  constructor (props: SchedulingAddProps) {
    super(props)
    this.state = {
      disabledButton: true,
      userId: null,
      schedulingInfo: {},
      statistic: STATISTIC_ARRAY,
      loading: false,
      holidayParam: [],
      workdayParam: [],
      attendStatus: ''
    }
  }
  componentDidMount () {
    const { userId } = HttpUtil.parseUrl(this.props.location.search)
    const { aId } = this.props.match.params
    if (userId) {
      this.setState({
        userId,
        loading: true
      })
      this.ApiGetScheduleInfo()
    } else {
      this.setState({ loading: true })
      const statistic = _.cloneDeep(this.state.statistic)
      this.axios.request(this.api.getAttendParamDetail, { aId }, false).then(({ code, data }) => {
        if (code === 200) {
          this.attendStatus(data.yearMonth)

          statistic[0].value = data.ratedAttend
          statistic[1].value = data.ratedHolidayAttend
          const injectMontDetail = data
          injectMontDetail.monthDetail = data.attendMonthList
          this.setState({
            schedulingInfo: injectMontDetail,
            loading: false,
            statistic,
            userId: data.userId
          }, () => {
            let nextFieldsValue = {
              'req_attendSystem': data.attendSystem
            }
            _(data.attendMonthList).forEach((item: any, index: any) => {
              const currentValue = item.isHoliday
                ? `holiday_${item.schedulingCode}_${item.type === 1 ? 1 : 0}_${item.paramId}`
                : `workday_${item.schedulingCode}_${item.type === 1 ? 1 : 2}_${item.paramId}`
              Object.assign(nextFieldsValue, {
                [`${item.paramId === '0' ? 'normal' : 'req'}_schedule_${item.date}_${item.isHoliday !== 0 ? 'holiday' : 'workday'}`]: item.paramId === '0' ? undefined : currentValue
              })
            })
            this.props.form.setFieldsValue(nextFieldsValue)
            this.getFieldsValue()
            this.configureStatistic(nextFieldsValue)
          })
        }
      })
    }
    this.getParameter()
  }

  // 获取月份审核状态
  attendStatus = (yearMonth: any) => {
    this.axios.request(this.api.attendStatus, { yearMonth }, false).then(({ code, data }) => {
      if (code === 200) {
        this.setState({
          attendStatus: data
        })
      }
    })
  }

  // 获取排版新增初始化数据
  ApiGetScheduleInfo = () => {
    let { userId, yearMonth } = HttpUtil.parseUrl(this.props.location.search)
    const storageInfo = this.getCachedFromStorage(`schedulingAdd_${userId}_${yearMonth}`)
    let attendSystem = 1
    if (storageInfo && storageInfo.req_attendSystem) {
      attendSystem = storageInfo.req_attendSystem
    }
    if (userId === undefined) {
      userId = this.state.schedulingInfo.userId
      yearMonth = this.state.schedulingInfo.yearMonth
    }
    const payload = {
      userId: Number(userId),
      yearMonth: Number(yearMonth),
      attendSystem
    }
    const statistic = _.cloneDeep(this.state.statistic)
    this.axios.request(this.api.ApiGetAttendParamInit, payload).then(({ data }) => {
      statistic[0].value = data.ratedAttend
      statistic[1].value = data.ratedHolidayAttend
      this.setState((state: any) => ({
        schedulingInfo: {
          ...state.schedulingInfo,
          ...data
        },
        statistic,
        loading: false
      }), () => {
        const deepStorage = _.cloneDeep(storageInfo)
        const { holidayParam, workdayParam } = this.state
        _.forEach(deepStorage, (item, key) => {
          if (key !== 'req_attendSystem') {
            const nameMarkArray = item.split('_')
            const keyMark = key.split('_')[3]
            let noCurrentCode = true
            if (nameMarkArray[0] === 'workday' || keyMark === 'workday') {
              if (_.some(workdayParam, ['schedulingCode', nameMarkArray[1]])) {
                noCurrentCode = false
              }
            } else if (nameMarkArray[0] === 'holiday' || keyMark === 'holiday') {
              if (_.some(holidayParam, ['schedulingCode', nameMarkArray[1]])) {
                noCurrentCode = false
              }
            }
            if (noCurrentCode) {
              delete storageInfo[key]
            }
          }
        })
        if (storageInfo) {
          this.props.form.setFieldsValue(storageInfo)
          this.getFieldsValue()
        } else {
          // s
        }
      })
    })
  }

  // 获取班次参数
  getParameter = () => {
    this.axios.request(this.api.querySchedulingList, { type: 6 }, false).then(({ code, data }) => {
      if (code === 200) {
        this.setState({
          holidayParam: data.scheList
        })
      }
    })
    this.axios.request(this.api.querySchedulingList, { type: 5 }, false).then(({ code, data }) => {
      if (code === 200) {
        this.setState({
          workdayParam: data.scheList
        })
      }
    })
  }

  // 表单值改变
  getFieldsValue = async (data: any = {}) => {
    const { userId } = this.state
    const { yearMonth } = this.state.schedulingInfo
    await this.props.form.getFieldsValue()
    const fieldsValue = this.props.form.getFieldsValue()
    const statistic = this.configureStatistic(fieldsValue)
    const { disabledButton, hasPadedValue } = this.watchFieldsValues(fieldsValue, `schedulingAdd_${userId}_${yearMonth}`)
    this.setState({
      disabledButton,
      statistic
    })
  }

  /** 根据传入的表单值返回统计数据 */
  configureStatistic = (fieldsValue: any) => {
    const { schedulingInfo: { tryAlphalDate, entryTime, quitTime, yearMonth } } = this.state
    let probationStartDate: any, probationEndDate: any
    if (tryAlphalDate) {
      let { start, end } = tryAlphalDate
      probationStartDate = start.split('-')[2]
      probationEndDate = end.split('-')[2]
    } else {
      probationStartDate = 0
      probationEndDate = 0
    }
    const statistic = _.cloneDeep(this.state.statistic)
    _(statistic).forEach((item: any, index: any) => {
      if (index > 1) {
        item.value = 0
      }
    })
    _.forEach(fieldsValue, (value: any, key: any) => {
      if (value && key !== 'req_attendSystem') {
        const valueArray = value.split('_')
        const currentDate = key.split('_')[2]
        const currentDateFormate = `${yearMonth.substr(0, 4)}-${yearMonth.substr(4, 2)}-${currentDate}`
        const isProbation = Number(probationStartDate) <= Number(currentDate) && Number(currentDate) <= Number(probationEndDate)
        const isOfficial = Number(probationEndDate) < Number(currentDate)
        let inService = false
        if (quitTime) {
          inService = moment(currentDateFormate) >= moment(entryTime) && moment(currentDateFormate) <= moment(quitTime)
        } else {
          inService = moment(currentDateFormate) >= moment(entryTime)
        }
        if (inService) {
          switch (valueArray[1]) {
            case 'a':
              statistic[4].value += 1
              break
            case '0.5a':
              statistic[4].value += 0.5
              statistic[15].value += 1
              break
            case 'b':
              statistic[5].value += 1
              break
            case '0.5b':
              statistic[5].value += 0.5
              statistic[15].value += 1
              break
            case 'c':
              statistic[6].value += 1
              break
            case 'd':
              statistic[7].value += 1
              break
            case 'e':
              statistic[8].value += 1
              break
            case 'f':
              statistic[9].value += 1
              break
            case 'g':
              statistic[10].value += 1
              break
            case 'h':
              statistic[11].value += 1
              break
            case 'i':
              statistic[12].value += 1
              break
            case 'j':
              statistic[13].value += 1
              statistic[15].value += 1
              break
            case 'z':
              statistic[14].value += 1
              break
            case '0.5z':
              statistic[14].value += 0.5
              statistic[15].value += 1
              break
          }
          if (valueArray[0] === 'holiday' && valueArray[1] !== 'Z') {
            statistic[3].value += 1
            statistic[15].value += 1
          }
          if (valueArray[0] === 'workday' && valueArray[1] !== 'Z' && Number(valueArray[2]) === 1) {
            statistic[2].value += 1
            statistic[15].value += 1
            if (isProbation || isOfficial) {
              statistic[16].value += isProbation ? 1 : 0
              statistic[17].value += isOfficial ? 1 : 0
            }
          } else if (valueArray[0] === 'workday' && valueArray[1] !== 'Z' && Number(valueArray[2]) === 2) {
            statistic[2].value += 1
            if (isProbation || isOfficial) {
              statistic[16].value += isProbation ? 1 : 0
              statistic[17].value += isOfficial ? 1 : 0
            }
          }
        }
      }
    })
    return statistic
  }

  getWorkdayParam = () => {}

  getCachedFromStoragInfo = (name: string) => {
    const { userId } = this.state
    const data = this.getCachedFromStorage(name)
    return (data && data[userId]) || {}
  }

  judgeButtonStatus = () => {
    const { userId } = HttpUtil.parseUrl(this.props.location.search)
    const { schedulingInfo: { status }, attendStatus } = this.state
    if (userId) {
      return true
    } else if (attendStatus === 1) {
      return false
    } else {
      return status === 0
    }
  }

  /** 页面事件 */
  handleAdd = () => {
  }

  handleChangeSystem = (value: any) => {
    const { yearMonth } = this.state.schedulingInfo
    this.axios.request(this.api.getAttendSystemDetail, { yearMonth, attendSystem: value }, false).then(({ code, data }) => {
      let statistic = _.cloneDeep(this.state.statistic)
      if (code === 200) {
        statistic[0].value = value === 1 ? data.ratedAttendanceFive : data.ratedAttendanceSix
        statistic[1].value = data.legalHolidayNum
        this.setState({
          statistic
        })
      }
    })
    this.getFieldsValue()
  }

  handleCancel = () => {
    this.props.history.replace('/home/scheduling')
  }

  handleConfirm = () => {
    const { userId, yearMonth } = HttpUtil.parseUrl(this.props.location.search)
    const { aId } = this.props.match.params
    const { schedulingInfo, statistic } = this.state
    const fieldsValue = this.props.form.getFieldsValue()
    let requestMethod = this.api.addAttend
    let toastTips = '新增成功'
    let payload = {}
    let attendParameterJson: any[] = []
    _.forEach(fieldsValue, (item: any, key: any) => {
      if (key !== 'req_attendSystem') {
        let everyParam = {
          date: key.split('_')[2],
          paramId: item ? item.split('_')[3] : '0'
        }
        attendParameterJson.push(everyParam)
      }
    })
    payload = {
      attendParameterJson,
      attendSystem: fieldsValue['req_attendSystem'],
      userId: schedulingInfo.userId,
      yearMonth: schedulingInfo.yearMonth
    }
    _(statistic).forEach((item: any) => {
      Object.assign(payload, {
        [item.name]: item.value
      })
    })
    if (aId) {
      requestMethod = this.api.updateAttend
      Object.assign(payload, {
        aId
      })
      toastTips = '修改成功'
    }
    this.axios.request(requestMethod, payload, false).then(({ code }) => {
      if (code === 200) {
        if (userId) {
          this.removeCachedStorage(`schedulingAdd_${schedulingInfo.userId}_${yearMonth}`)
        }
        this.$message.success(toastTips)
        this.props.history.replace('/home/scheduling')
      }
    })
  }

  render () {
    const {
      props: {
        form: { getFieldDecorator }
      },
      state: { disabledButton, schedulingInfo, statistic, loading, workdayParam, holidayParam },
      AuthorityList: { scheduling },
      isAuthenticated
    } = this
    const active = { background: '#FFBC02', color: 'white' }
    const { userId, yearMonth } = HttpUtil.parseUrl(this.props.location.search)
    return (
      <div id='schedulingAdd'>
        <Spin spinning={loading}>
          <Row className='schedulingAdd-item line'>
            <Row className='schedulingAdd-item-title'><Icon component={IconPer1}></Icon><span>员工信息</span></Row>
            <Row className='schedulingAdd-item-row'>
              <Col span={6}>
                <span>项目：</span>{schedulingInfo.projectName || '---'}
              </Col>
              <Col span={6}>
                <span>工号：</span>{schedulingInfo.projectNumber || '---'}
              </Col>
              <Col span={6}>
                <span>管理编号：</span>{schedulingInfo.sjNumber || '---'}
              </Col>
              <Col span={6}>
                <span>员工姓名</span>：{schedulingInfo.userName || '---'}
              </Col>
            </Row>
            <Row className='schedulingAdd-item-row'>
              <Col span={6}>
                <span>组织：</span>{schedulingInfo.organize || '---'}
              </Col>
              <Col span={6}>
                <span>在职状态：</span>{schedulingInfo.workCondition || '---'}
              </Col>
              <Col span={6}>
                <span>入职时间：</span>{schedulingInfo.entryTime || '---'}
              </Col>
              <Col span={6}>
                <span>离职时间：</span>{schedulingInfo.quitTime || '---'}
              </Col>
            </Row>
            <Row className='schedulingAdd-item-row'>
              <Col span={6}>
                <span>月度：</span>{schedulingInfo.yearMonth || '---'}
              </Col>
              <Col span={6}>
                <span>工时类型：</span>{schedulingInfo.hourType || '---'}
              </Col>
              <Col span={6}>
                <span>计薪类型：</span>{schedulingInfo.salaryType ? (schedulingInfo.salaryType === 1 ? '计薪制' : '计件制') : '---'}
              </Col>
              <Col span={6}>
                <Item label='考勤制度：'
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                >
                  {getFieldDecorator('req_attendSystem', {
                    initialValue: schedulingInfo.attendSystem ? schedulingInfo.attendSystem : 1
                  })(<Select className='input-120' disabled={!this.judgeButtonStatus()} onChange={this.handleChangeSystem} getPopupContainer={(triggerNode: any) => triggerNode.parentElement}>
                    <Option value={2}>六天工作制</Option>
                    <Option value={1}>五天工作制</Option>
                  </Select>)}
                </Item>
              </Col>
            </Row>
          </Row>
          <Row className='schedulingAdd-item'>
            <Row className='schedulingAdd-item-title'><Icon component={IconPer1}></Icon><span>{userId ? '员工考勤凭证' : '员工考勤信息'}</span></Row>
            <Row className='schedulingAdd-item-table'>
              <Row className='schedulingAdd-item-table-title'><span>考勤明细</span>（以下均为必填项）</Row>
              <Row className='schedulingAdd-item-table-content'>
                {
                  schedulingInfo.monthDetail && schedulingInfo.monthDetail.map((item:any, index: number) => {
                    const { paramType } = item
                    return (
                      <Col span={3} key={index} className='table-tr'>
                        <Row className='table-th' style={ item.isHoliday !== 0 ? active : {} }>{index + 1}日</Row>
                        <Row className='table-td'>
                          <Item
                          >
                            {getFieldDecorator(`${item.paramId === '0' ? 'normal' : 'req'}_schedule_${index + 1}_${item.isHoliday !== 0 ? 'holiday' : 'workday'}`, {})(
                              <Select
                                onChange={this.getFieldsValue.bind(this)}
                                allowClear={true}
                                dropdownClassName='table-td-select-dropdown'
                                placeholder='- - 请选择- -'
                                showArrow={false}
                                // className='table-td-select'
                                className={paramType ? ((paramType === 1 && 'table-td-select-blue') || (paramType === 2 && 'table-td-select-red') || (paramType === 3 && 'table-td-select-green') || 'table-td-select') : 'table-td-select'}
                                disabled={item.paramId === '0' || !this.judgeButtonStatus()}
                                getPopupContainer={(triggerNode: any) => triggerNode.parentElement}
                              >
                                {
                                  item.isHoliday !== 0
                                    ? holidayParam.map((i: any, ind: number) => {
                                      return (
                                        <Option
                                          key={`${index}_holi_${ind}`}
                                          title={i.schedulingName}
                                          value={`holiday_${i.schedulingCode}_${i.type === 1 ? 1 : 0}_${i.ophId}`}
                                        >{i.type === 1 ? '班次' : '加班'}--{i.schedulingCode} {i.schedulingName}</Option>
                                      )
                                    })
                                    : workdayParam.map((i: any, ind: any) => {
                                      return (
                                        <Option
                                          key={`${index}_work_${ind}`}
                                          title={i.schedulingName}
                                          value={`workday_${i.schedulingCode}_${i.type === 1 ? 1 : 2}_${i.ophId}`}
                                        >{i.type === 1 ? '班次' : '缺勤'}--{i.schedulingCode} {i.schedulingName}</Option>
                                      )
                                    })
                                }
                              </Select>
                            )}
                          </Item>
                          <img className='icon-work' src={(paramType === 1 && rest) || (paramType === 2 && absenteeism) || (paramType === 3 && overtime) || ''} alt='' />
                          <span className='icon-triangle'></span>
                        </Row>
                      </Col>
                    )
                  })
                }
              </Row>
            </Row>
            <Row className='schedulingAdd-item-table'>
              <Row className='schedulingAdd-item-table-title'><span>考勤统计</span></Row>
              <Row className='schedulingAdd-item-table-content'>
                {
                  statistic.map((item:any, index: number) => {
                    return (
                      <Col span={3} key={index} className='table-tr'>
                        <Row className='table-th'>{item.title}</Row>
                        <Row className='table-td'>
                          {item.value}
                        </Row>
                      </Col>
                    )
                  })
                }
              </Row>
            </Row>
          </Row>
        </Spin>
        <Row className='schedulingAdd-btn'>
          {this.judgeButtonStatus() && (userId ? isAuthenticated(scheduling[1]) : isAuthenticated(scheduling[2])) && <Button type='primary' className='confrim-btn' onClick={this.handleConfirm} disabled={disabledButton}>{userId ? '确定' : '保存'}</Button>}
          <Button className='cancel-btn' onClick={this.handleCancel}>{this.judgeButtonStatus() && isAuthenticated(scheduling[2]) ? '取消' : '返回'}</Button>
        </Row>
        {userId && <Prompt when message={`schedulingAdd_${userId}_${yearMonth}`} />}
      </div>
    )
  }
}
const scheduling = Form.create<SchedulingAddProps>()(SchedulingAdd)
export default scheduling
