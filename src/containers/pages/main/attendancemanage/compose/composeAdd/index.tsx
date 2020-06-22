/*
 * @description: 排班详情
 * @author: songliubiao
 * @lastEditors: zhousong
 * @Date: 2019-09-19 14:52:39
 * @LastEditTime: 2020-06-08 16:52:53
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
import SysUtil from '@utils/SysUtil'
import HttpUtil from '@utils/HttpUtil'
import './index.styl'
import _ from 'lodash'
import moment from 'moment'
import rest from '@assets/images/main/salary/rest.png'
import absenteeism from '@assets/images/main/salary/absenteeism.png'
import overtime from '@assets/images/main/salary/overtime.png'

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
    name: 'ratedLegalHoliday'
  },
  {
    title: '排班出勤天数',
    value: 0,
    name: 'schedulingAttend'
  },
  {
    title: '排班法定假出勤天数',
    value: 0,
    name: 'schedulingLegalHoliday'
  },
  {
    title: '排班病假天数（a）',
    value: 0,
    name: 'schedulingSick'
  },
  {
    title: '排班事假天数（b）',
    value: 0,
    name: 'schedulingThing'
  },
  {
    title: '排班产前假天数（c）',
    value: 0,
    name: 'schedulingMaternityBefore'
  },
  {
    title: '排班产假天数（d）',
    value: 0,
    name: 'schedulingMaternityIn'
  },
  {
    title: '排班产后假天数（e）',
    value: 0,
    name: 'schedulingMaternityAfter'
  },
  {
    title: '排班陪产假天数（f）',
    value: 0,
    name: 'schedulingMaternityWith'
  },
  {
    title: '排班婚假天数（g）',
    value: 0,
    name: 'schedulingMarried'
  },
  {
    title: '排班年假天数（h）',
    value: 0,
    name: 'schedulingYear'
  },
  {
    title: '排班丧假天数（i）',
    value: 0,
    name: 'schedulingFuneral'
  },
  {
    title: '排班产检假天数（j）',
    value: 0,
    name: 'schedulingMaternityCheck'
  }
]

interface ComposeAddProps extends BaseProps, FormComponentProps {

}
interface ComposeAddState {
  disabledButton: boolean //  提交按钮
  userId: any // 用户id
  schedulingInfo: any, // 排班详情
  statistic: any[], // 统计表格列表
  loading: boolean,
  holidayParam: any[], // 节假日参数
  workdayParam: any[], // 工作日参数
}
@hot(module)
class ComposeAdd extends RootComponent<ComposeAddProps, ComposeAddState> {
  startEndWorkTime: any = []
  constructor (props: ComposeAddProps) {
    super(props)
    this.state = {
      disabledButton: true,
      userId: null,
      schedulingInfo: {},
      statistic: STATISTIC_ARRAY,
      loading: false,
      holidayParam: [],
      workdayParam: []
    }
  }
  componentDidMount () {
    const { userId } = HttpUtil.parseUrl(this.props.location.search)
    const { sId } = this.props.match.params
    if (userId) {
      this.setState({
        userId,
        loading: true
      })
      this.ApiGetScheduleInfo()
    } else {
      this.setState({ loading: true })
      const statistic = _.cloneDeep(this.state.statistic)
      this.axios.request(this.api.ApiGetScheduleInfo, { sId }, false).then(({ code, data }) => {
        const { scheduleMonthList, ratedAttend, ratedLegalHoliday, userId } = data
        if (code === 200) {
          statistic[0].value = ratedAttend
          statistic[1].value = ratedLegalHoliday
          const injectMontDetail = data
          injectMontDetail.monthDetail = scheduleMonthList
          this.setState({
            schedulingInfo: injectMontDetail,
            loading: false,
            statistic,
            userId
          }, () => {
            let nextFieldsValue = {
              'req_attendSystem': data.attendSystem
            }
            _(scheduleMonthList).forEach((item: any, index: any) => {
              // 将上下班时间存储起来
              this.startEndWorkTime[index] = { startWorkTime: item.startWorkTime, endWorkTime: item.endWorkTime }
              const currentValue = item.isHoliday
                ? `holiday_${item.schedulingCode}_${item.type === 1 ? 1 : 0}_${item.paramId}`
                : `workday_${item.schedulingCode}_${item.type === 1 ? 1 : 2}_${item.paramId}`
              Object.assign(nextFieldsValue, {
                [`${item.paramId === '0' ? 'normal' : 'req'}_schedule_${item.date}_${item.isHoliday !== 0 ? 'holiday' : 'workday'}`]: item.paramId === '0' ? undefined : currentValue
              })
            })
            this.props.form.setFieldsValue(nextFieldsValue)
            this.otherMethods()
            this.configureStatistic(nextFieldsValue)
          })
        }
      })
    }
    this.getParameter()
  }
  // 获取排版新增初始化数据
  ApiGetScheduleInfo = () => {
    let { userId, yearMonth } = HttpUtil.parseUrl(this.props.location.search)
    const storageInfo = this.getCachedFromStorage(`composeAdd_${userId}_${yearMonth}`)
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
    this.axios.request(this.api.ApiScheduleInsertInfo, payload).then(({ data }) => {
      statistic[0].value = data.ratedAttend
      statistic[1].value = data.ratedLegalHoliday
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
        if (storageInfo) {
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
          this.props.form.setFieldsValue(storageInfo)
          // this.getFieldsValue()
          this.otherMethods()
          // 每次从新进入之后从holidayParam workdayParam中拿到最新的上下班时间来填充上下班时间 避免班次参数修改之后这里展示的是修改之前的数据
          _.forEach(storageInfo, (value, key) => {
            if (key !== 'req_attendSystem') {
              const index = Number(key.split('_')[2])
              this.getFieldsValue(index - 1, value)
            }
          })
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
    this.axios.request(this.api.querySchedulingList, { type: 4 }, false).then(({ code, data }) => {
      if (code === 200) {
        this.setState({
          workdayParam: data.scheList
        })
      }
    })
  }

  // 表单值改变
  getFieldsValue = async (index?: any, value?: any) => {
    const { holidayParam, workdayParam } = this.state
    // const { yearMonth } = this.state.schedulingInfo
    // await this.props.form.getFieldsValue()
    // const fieldsValue = this.props.form.getFieldsValue()
    // const statistic = this.configureStatistic(fieldsValue)
    // const { disabledButton, hasPadedValue } = this.watchFieldsValues(fieldsValue, `composeAdd_${userId}_${yearMonth}`)
    // 选择班次之后展示对应的上下班时间
    this.otherMethods()
    if (value) {
      const allDay = _.cloneDeep([...holidayParam, ...workdayParam])
      const changeDay = value.split('_')[3]
      const filterDay = _.find(allDay, (o) => { return o.ophId === +changeDay })
      index >= 0 && (this.startEndWorkTime[index] = { startWorkTime: filterDay.startWorkTime, endWorkTime: filterDay.endWorkTime })
      // _(schedulingInfo.monthDetail).forEach((v, i) => {
      //   if (index === i) {
      //     console.log(filterDay, 'filterDay')
      //     v.startWorkTime = '11:22'
      //     v.endWorkTime = '22:50'
      //   }
      // })
    } else {
      this.startEndWorkTime.splice(index, 1, { startWorkTime: '', endWorkTime: '' })
    }
    // this.setState({
    //   disabledButton,
    //   statistic
    // })
  }

  // 改变按钮状态和生成统计信息
  otherMethods = () => {
    setTimeout(() => {
      const { userId } = this.state
      const { yearMonth } = this.state.schedulingInfo
      const fieldsValue = this.props.form.getFieldsValue()
      const statistic = this.configureStatistic(fieldsValue)
      const { disabledButton } = this.watchFieldsValues(fieldsValue, `composeAdd_${userId}_${yearMonth}`)
      this.setState({
        disabledButton,
        statistic
      })
    }, 0)
  }

  /** 判断当前页面是否支持编辑 */
  judgementStatus = () => {
    const { yearMonth, salaryAccount } = this.state.schedulingInfo
    let currYear, currMonth
    if (yearMonth) {
      currYear = yearMonth.substr(0, 4)
      currMonth = yearMonth.substr(4, 2)
    }
    const newYear = `${currYear}-${currMonth}`
    if ((moment(newYear).month() < moment().month() && (moment(newYear).year() <= moment().year())) || salaryAccount === 1) {
      return false
    } else {
      return true
    }
  }

  judgeStatusWithWorkInfo = () => {
    const { schedulingInfo: { quitTime } } = this.state
    const { sId } = this.props.match.params
    const baseStatus = this.judgementStatus()
    if (quitTime && moment(quitTime) < moment() && sId) {
      return false
    } else {
      return baseStatus
    }
  }

  /** 根据传入的表单值返回统计数据 */
  configureStatistic = (fieldsValue: any) => {
    const { schedulingInfo: { entryTime, quitTime, yearMonth } } = this.state
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
              break
            case 'b':
              statistic[5].value += 1
              break
            case '0.5b':
              statistic[5].value += 0.5
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
              break
            case 'z':
              break
            case '0.5z':
              break
          }
          if (valueArray[0] === 'holiday' && valueArray[1] !== 'Z') {
            statistic[3].value += 1
          }
          if (valueArray[0] === 'workday' && valueArray[1] !== 'Z' && Number(valueArray[2]) === 1) {
            statistic[2].value += 1
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
    this.otherMethods()
  }

  handleCancel = () => {
    this.props.history.replace('/home/compose')
  }

  handleConfirm = () => {
    const { userId, yearMonth } = HttpUtil.parseUrl(this.props.location.search)
    const { sId } = this.props.match.params
    const { schedulingInfo, statistic, holidayParam, workdayParam } = this.state
    const allDay = _.cloneDeep([...holidayParam, ...workdayParam])
    const fieldsValue = this.props.form.getFieldsValue()
    let requestMethod = this.api.ApiInsertSchedule
    let toastTips = '新增成功'
    let payload = {}
    let schedulingParameterJson: any[] = []
    _.forEach(fieldsValue, (item: any, key: any) => {
      if (key !== 'req_attendSystem') {
        let startTime, endTime
        const curDate = moment().get('date')
        if (curDate > Number(key.split('_')[2]) && sId) {
          startTime = _.get(schedulingInfo.monthDetail[key.split('_')[2] - 1], 'startWorkTime')
          endTime = _.get(schedulingInfo.monthDetail[key.split('_')[2] - 1], 'endWorkTime')
        } else {
          const changeDay = item ? item.split('_')[3] : ''
          startTime = _.get(_.find(allDay, (o) => { return o.ophId === Number(changeDay) }), 'startWorkTime')
          endTime = _.get(_.find(allDay, (o) => { return o.ophId === Number(changeDay) }), 'endWorkTime')
        }
        let everyParam = {
          date: key.split('_')[2],
          paramId: item ? item.split('_')[3] : '0',
          startTime: startTime || '',
          endTime: endTime || ''
        }
        schedulingParameterJson.push(everyParam)
      }
    })
    payload = {
      schedulingParameterJson,
      attendSystem: fieldsValue['req_attendSystem'],
      userId: schedulingInfo.userId,
      yearMonth: schedulingInfo.yearMonth
    }
    _(statistic).forEach((item: any) => {
      Object.assign(payload, {
        [item.name]: item.value
      })
    })
    if (sId) {
      requestMethod = this.api.ApiUpdateSchedule
      Object.assign(payload, {
        sId
      })
      toastTips = '修改成功'
    }
    this.axios.request(requestMethod, payload, false).then(({ code }) => {
      if (code === 200) {
        if (userId) {
          this.removeCachedStorage(`composeAdd_${schedulingInfo.userId}_${yearMonth}`)
        }
        this.$message.success(toastTips)
        this.props.history.replace('/home/compose')
      }
    })
  }

  render () {
    const {
      startEndWorkTime,
      props: {
        form: { getFieldDecorator }
      },
      state: { disabledButton, schedulingInfo, statistic, loading, workdayParam, holidayParam },
      AuthorityList: { compose },
      isAuthenticated
    } = this
    const active = { background: '#FFBC02', color: 'white' }
    const { userId, yearMonth } = HttpUtil.parseUrl(this.props.location.search)
    return (
      <div id='composeAdd'>
        <Spin spinning={loading}>
          <Row className='composeAdd-item line'>
            <Row className='composeAdd-item-title'><Icon component={IconPer1}></Icon><span>员工信息</span></Row>
            <Row className='composeAdd-item-row'>
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
            <Row className='composeAdd-item-row'>
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
            <Row className='composeAdd-item-row'>
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
                  })(<Select className='input-120' disabled={!this.judgementStatus()} onChange={this.handleChangeSystem} getPopupContainer={(triggerNode: any) => triggerNode.parentElement}>
                    <Option value={2}>六天工作制</Option>
                    <Option value={1}>五天工作制</Option>
                  </Select>)}
                </Item>
              </Col>
            </Row>
          </Row>
          <Row className='composeAdd-item'>
            <Row className='composeAdd-item-title'><Icon component={IconPer1}></Icon><span>{userId ? '员工排班凭证' : '员工排班信息'}</span></Row>
            <Row className='composeAdd-item-table'>
              <Row className='composeAdd-item-table-title'><span>排班明细</span>（以下均为必填项）</Row>
              <Row className='composeAdd-item-table-content'>
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
                                onChange={(value) => this.getFieldsValue(index, value)}
                                allowClear={true}
                                dropdownClassName='table-td-select-dropdown'
                                placeholder='- - 请选择- -'
                                showArrow={false}
                                // className='table-td-select'
                                className={paramType ? ((paramType === 1 && 'table-td-select-blue') || (paramType === 2 && 'table-td-select-red') || (paramType === 3 && 'table-td-select-green') || 'table-td-select') : 'table-td-select'}
                                disabled={(index < Number(moment().format('DD')) - 1 && !userId) || item.paramId === '0' || !this.judgementStatus()}
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
                        <Row className='table-foot'>
                          {/* {
                            item.startWorkTime
                              ? <Row>
                                <div>上班：{item.startWorkTime}</div>
                                <div>下班：{item.endWorkTime}</div>
                              </Row>
                              : <Row>无需打卡</Row>
                          } */}
                          {
                            startEndWorkTime[index] && startEndWorkTime[index].startWorkTime
                              ? <Row>
                                <div>上班：{startEndWorkTime[index].startWorkTime}</div>
                                <div>下班：{startEndWorkTime[index].endWorkTime}</div>
                              </Row>
                              : <Row>无需打卡</Row>
                          }
                        </Row>
                      </Col>
                    )
                  })
                }
              </Row>
            </Row>
            <Row className='composeAdd-item-table'>
              <Row className='composeAdd-item-table-title'><span>排班统计</span></Row>
              <Row className='composeAdd-item-table-content'>
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
        <Row className='composeAdd-btn'>
          {this.judgementStatus() && (userId ? isAuthenticated(compose[1]) : isAuthenticated(compose[2])) && <Button type='primary' className='confrim-btn' onClick={this.handleConfirm} disabled={disabledButton}>{userId ? '确定' : '保存'}</Button>}
          <Button className='cancel-btn' onClick={this.handleCancel}>{this.judgementStatus() && isAuthenticated(compose[2]) ? '取消' : '返回'}</Button>
        </Row>
        {userId && <Prompt when message={`composeAdd_${userId}_${yearMonth}`} />}
      </div>
    )
  }
}
const scheduling = Form.create<ComposeAddProps>()(ComposeAdd)
export default scheduling
