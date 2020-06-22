/*
 * @description: 考勤排版
 * @author: songliubiao
 * @lastEditors: songliubiao
 * @Date: 2019-09-19 14:52:39
 * @LastEditTime: 2020-05-21 10:11:14
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { hot } from 'react-hot-loader'
import { EmptyTable, ReportTable, RootComponent, customizeRenderEmpty } from '@components/index'
import { Button, Form, Row, Table, Tag, Icon, Spin, Select, Col, Modal, TimePicker, ConfigProvider } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { IconPer1 } from '@components/icon/BasicIcon'
import { BaseProps } from 'typings/global'
import HttpUtil from '@utils/HttpUtil'
import rest1 from '@assets/images/main/salary/rest1.png'
import absenteeism1 from '@assets/images/main/salary/absenteeism1.png'
import overtime1 from '@assets/images/main/salary/overtime1.png'
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
  },
  {
    title: '本月迟到次数',
    value: 0,
    name: 'lateNum'
  },
  {
    title: '本月早退次数',
    value: 0,
    name: 'earlyNum'
  },
  {
    title: '本月未打卡次数',
    value: 0,
    name: 'notClockInNum'
  },
  {
    title: '本月工作时长（分钟）',
    value: 0,
    name: 'workHours'
  },
  {
    title: '本月迟到时长（分钟）',
    value: 0,
    name: 'lateHours'
  },
  {
    title: '本月早退时长（分钟）',
    value: 0,
    name: 'earlyHours'
  },
  {
    title: '本月出差时长（分钟）',
    value: 0,
    name: 'tripHours'
  },
  {
    title: '本月加班时长（分钟）',
    value: 0,
    name: 'overHours'
  },
  {
    title: '本月请假时长（分钟）',
    value: 0,
    name: 'leaveHours'
  },
  {
    title: '本月外出时长（分钟）',
    value: 0,
    name: 'outHours'
  }
]

interface FaceDetailProps extends BaseProps, FormComponentProps {

}
interface FaceDetailState {
  faceInfo: any, // 排班详情
  statistic: any[], // 统计表格列表
  loading: boolean
  tableData: any[]
  modalVisible: boolean
  startOpen: boolean
  endOpen: boolean
  absenceList: any[]
  currentEdit: any
  dataSourcePic: boolean
  emptyTableOfficial: boolean // 无数据时展示的文案
}
@hot(module)
class FaceDetail extends RootComponent<FaceDetailProps, FaceDetailState> {
  constructor (props: FaceDetailProps) {
    super(props)
    this.state = {
      faceInfo: {},
      statistic: STATISTIC_ARRAY,
      loading: false,
      tableData: [],
      modalVisible: false,
      startOpen: false,
      endOpen: false,
      absenceList: [],
      currentEdit: {},
      dataSourcePic: true,
      emptyTableOfficial: true
    }
  }
  componentDidMount () {
    this.getAttendInfo()
    this.getAbsenceList()
  }

  // 获取出勤信息
  getAttendInfo = () => {
    this.setState({
      loading: true
    })
    const { aId } = this.props.match.params
    this.axios.request(this.api.getAttendParamDetail, { aId }, false).then(({ code, data }) => {
      if (code === 200) {
        let tempStatistic = _.cloneDeep(STATISTIC_ARRAY)
        _.forEach(data, (value: any, key: any) => {
          tempStatistic.forEach((item: any) => {
            if (item.name === key) {
              item.value = value || 0
            }
          })
        })
        this.setState({
          faceInfo: data,
          tableData: data.attendParameterJson || [],
          loading: false,
          statistic: tempStatistic
        })
      }
    })
  }

  // 获取缺勤参数 - 模态框下拉框数组
  getAbsenceList = () => {
    this.setState({
      loading: true
    })
    this.axios.request(this.api.querySchedulingList, { type: 2 }, false).then(({ code, data }) => {
      if (code === 200) {
        this.setState({
          absenceList: data.scheList,
          loading: false
        })
      }
    })
  }

  /** 页面事件 */
  handleCancel = () => {
    this.props.history.replace('/home/scheduling')
  }

  handleEdit = (item: any) => {
    const date = item.dateWeek.split(' ')[0]
    this.setState({
      modalVisible: true,
      currentEdit: item
    }, () => {
      this.props.form.setFieldsValue({
        startTime: item.startTime ? moment(`${date} ${item.startTime}`) : null,
        endTime: item.endTime ? moment(`${date} ${item.endTime}`) : null
      })
    })
  }

  onCloseModal = () => {
    this.setState({
      modalVisible: false
    })
  }

  onSaveAdd = () => {
    const { currentEdit } = this.state
    const { aId } = this.props.match.params
    let date = currentEdit.dateWeek.split(' ')[0]
    this.props.form.validateFields((err: any, value: any) => {
      if (err) {}
      const scheTime = currentEdit.scheduling.split(' ')[1]
      let isWorkNextDay = false
      if (scheTime) {
        const scheStart = scheTime.split('-')[0]
        const scheEnd = scheTime.split('-')[1]
        if (moment(`${date} ${scheStart}`) > moment(`${date} ${scheEnd}`)) {
          isWorkNextDay = true
        }
      }
      let nextDate = moment(date).add(1, 'days').format('YYYY-MM-DD')
      const params = {
        aId: parseFloat(aId),
        date: currentEdit.date,
        endTime: value.endTime ? `${isWorkNextDay ? nextDate : date} ${value.endTime.format('HH:mm:ss')}` : null,
        startTime: value.startTime ? `${date} ${value.startTime.format('HH:mm:ss')}` : null,
        holidayStatus: value.holidayStatus || null
      }
      this.axios.request(this.api.updateAttendFace, params, false).then(({ code, data }) => {
        this.onCloseModal()
        if (code === 200) {
          this.$message.success('修改成功！')
          this.getAttendInfo()
        }
      })
    })
  }

  // 员工考勤信息搜索时事件
  SearchData = () => {
    const {
      api: { getAttendParamDetail },
      props: { form: { getFieldsValue } }
    } = this
    const { aId } = this.props.match.params
    let { startResult, endResult, temp } = getFieldsValue()
    if (startResult === '全部') startResult = ''
    if (endResult === '全部') endResult = ''
    if (temp === '全部') temp = ''
    let params = { aId, startResult, endResult, temp }
    const flag = this.isObjEqual(params)
    if (flag) this.setState({ emptyTableOfficial: true })
    else this.setState({ emptyTableOfficial: false })
    this.axios.request(getAttendParamDetail, params).then(({ code, data }) => {
      if (code === 200) this.setState({ tableData: data.attendParameterJson })
    })
  }

  // 添加类名用来改变行元素的类名添加动态鼠标移入效果
  setClassName = (record: any, index: any): any => {
    const { paramType } = record
    if (paramType) {
      if (paramType === '1') return 'bg-b'
      else if (paramType === '3') return 'bg-g'
      else if (paramType === '2') return 'bg-m'
    }
  }

  // 比较搜索条件是否变化---用于解决初始无数据时和搜索无数据时展示的文案
  isObjEqual = (o1: any) => {
    let count = 0
    let o2 = o1 ? JSON.parse(JSON.stringify(o1)) : o1
    if (o2) {
      // 剔除列表初始加载中的空串和空数组
      for (let i in o2) {
        if (typeof o2[i] !== 'number') {
          if (!o2[i].length) {
            delete o2[i]
          }
        }
      }
      var props2 = Object.getOwnPropertyNames(o2)
      const len = props2.length
      for (var i = 0; i < len; i++) {
        if (!o2[props2[i]]) count++
      }
      if (len > 0 && len === count) return true
      else return false
    }
  }

  render () {
    const {
      props: {
        form: { getFieldDecorator }
      },
      state: { faceInfo, statistic, loading, tableData, modalVisible, startOpen, endOpen, absenceList, dataSourcePic, emptyTableOfficial }
    } = this
    const formItemLayout = {
      labelCol: { xs: { span: 24 }, sm: { span: 6 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 18 } }
    }
    const columns: any = [
      {
        title: '',
        dataIndex: 'icon',
        fixed: 'left',
        width: 60,
        render: (value: any, item: any) => {
          const { paramType } = item
          let img: any = ''
          if (paramType) {
            if (paramType === '1') img = rest1
            else if (paramType === '3') img = overtime1
            else if (paramType === '2') img = absenteeism1
          }
          return <img src={img} alt='' />
        }
      },
      {
        title: '考勤日期',
        dataIndex: 'dateWeek',
        fixed: 'left',
        width: 100,
        render: (value: any) => {
          return <span>{value || '---'}</span>
        }
      },
      {
        title: '关联的审批单',
        dataIndex: 'apply',
        width: 150,
        render: (value: any, item: any) => {
          const { paramType } = item
          let color: string = ''
          if (value) {
            if (paramType === '1') color = '#008BFF'
            else if (paramType === '3') color = '#16BC35'
            else if (paramType === '2') color = '#FF3226'
          }
          return <div>
            <div style={{ color: color }}>{value || '---'}</div>
            {
              item.applyBefore && <div style={{ color: 'red' }}>{item.applyBefore}</div>
            }
          </div>
        }
      },
      {
        title: '排班',
        dataIndex: 'scheduling',
        width: 150,
        render: (value: any, item: any) => {
          const { apply, paramType } = item
          let color: string = ''
          if (!apply && value) {
            if (paramType === '1') color = '#008BFF'
            else if (paramType === '3') color = '#16BC35'
            else if (paramType === '2') color = '#FF3226'
          }
          return <span style={{ color: color }}>{value || '---'}</span>
        }
      },
      {
        title: '上班打卡时间',
        dataIndex: 'startTime',
        width: 150,
        render: (value: any, item: any) => {
          return <div>
            <div>{value || '---'}</div>
            {
              item.startTimeBefore && <div style={{ color: 'red' }}>{item.startTimeBefore}</div>
            }
          </div>
        }
      },
      {
        title: '上班打卡结果',
        dataIndex: 'startResult',
        width: 150,
        render: (text: any) => {
          if (text === '迟到') return <Tag color="purple">{text}</Tag>
          else if (text === '旷工未打卡') return <Tag color="red">{text}</Tag>
          else if (text === '未打卡') return <Tag color="orange">{text}</Tag>
          else return <span>{text || '---'}</span>
        }
      },
      {
        title: '上班温度检测',
        dataIndex: 'startTemp',
        width: 150,
        render: (value: any) => {
          let flag1: boolean
          let flag2: boolean
          if (value) {
            const v = value.split('℃')[0]
            flag1 = Number(v) >= 37.3
            flag2 = Number(v) < 36.0
            return <span style={{ color: (flag1 && '#FF4A14') || (flag2 && '#09C2D0') || '' }}>{(flag1 && `${value}(偏高)`) || (flag2 && `${value}(偏低)`) || (`${value}(正常)`)}</span>
          } else {
            return <span>--</span>
          }
        }
      },
      {
        title: '下班打卡时间',
        dataIndex: 'endTime',
        width: 150,
        render: (value: any, item: any) => {
          return <div>
            <div>{value || '---'}</div>
            {
              item.endTimeBefore && <div style={{ color: 'red' }}>{item.endTimeBefore}</div>
            }
          </div>
        }
      },
      {
        title: '下班打卡结果',
        dataIndex: 'endResult',
        width: 150,
        render: (text: any) => {
          if (text === '早退') return <Tag color="blue">{text}</Tag>
          else if (text === '旷工未打卡') return <Tag color="red">{text}</Tag>
          else if (text === '未打卡') return <Tag color="orange">{text}</Tag>
          else return <span>{text || '---'}</span>
        }
      },
      {
        title: '下班温度检测',
        dataIndex: 'endTemp',
        width: 150,
        render: (value: any) => {
          let flag1: boolean
          let flag2: boolean
          if (value) {
            const v = value.split('℃')[0]
            flag1 = Number(v) >= 37.3
            flag2 = Number(v) < 36.0
            return <span style={{ color: (flag1 && '#FF4A14') || (flag2 && '#09C2D0') || '' }}>{(flag1 && `${value}(偏高)`) || (flag2 && `${value}(偏低)`) || (`${value}(正常)`)}</span>
          } else {
            return <span>--</span>
          }
        }
      },
      {
        title: '工作时长（分钟）',
        dataIndex: 'workHours',
        width: 180,
        render: (value: any) => {
          if (value) {
            return <span>{value}分钟</span>
          } else {
            return <span>--</span>
          }
        }
      },
      {
        title: '迟到时长（分钟）',
        dataIndex: 'lateHours',
        width: 180,
        render: (value: any) => {
          if (value) {
            return <span>{value}分钟</span>
          } else {
            return <span>--</span>
          }
        }
      },
      {
        title: '早退时长（分钟）',
        dataIndex: 'earlyHours',
        width: 180,
        render: (value: any) => {
          if (value) {
            return <span>{value}分钟</span>
          } else {
            return <span>--</span>
          }
        }
      },
      {
        title: '出差时长（分钟）',
        dataIndex: 'tripHours',
        width: 180,
        render: (value: any) => {
          if (value) {
            return <span>{value}分钟</span>
          } else {
            return <span>--</span>
          }
        }
      },
      {
        title: '加班时长（分钟）',
        dataIndex: 'overHours',
        width: 180,
        render: (value: any) => {
          if (value) {
            return <span>{value}分钟</span>
          } else {
            return <span>--</span>
          }
        }
      },
      {
        title: '请假时长（分钟）',
        dataIndex: 'leaveHours',
        width: 180,
        render: (value: any) => {
          if (value) {
            return <span>{value}分钟</span>
          } else {
            return <span>--</span>
          }
        }
      },
      {
        title: '外出时长（分钟）',
        dataIndex: 'outHours',
        width: 180,
        render: (value: any) => {
          if (value) {
            return <span>{value}分钟</span>
          } else {
            return <span>--</span>
          }
        }
      },
      {
        title: '操作',
        dataIndex: 'actions',
        fixed: 'right',
        render: (value: any, item: any) => {
          return <Button type='link' onClick={() => this.handleEdit(item)}>编辑</Button>
        }
      }
    ]
    return (
      <div id='faceDetail'>
        <Spin spinning={loading}>
          <Row className='schedulingAdd-item line'>
            <Row className='schedulingAdd-item-title'><Icon component={IconPer1}></Icon><span>员工信息</span></Row>
            <Row className='schedulingAdd-item-row'>
              <Col span={6}>
                <span>项目：</span>{faceInfo.projectName || '---'}
              </Col>
              <Col span={6}>
                <span>工号：</span>{faceInfo.projectNumber || '---'}
              </Col>
              <Col span={6}>
                <span>管理编号：</span>{faceInfo.sjNumber || '---'}
              </Col>
              <Col span={6}>
                <span>员工姓名</span>：{faceInfo.userName || '---'}
              </Col>
            </Row>
            <Row className='schedulingAdd-item-row'>
              <Col span={6}>
                <span>组织：</span>{faceInfo.organize || '---'}
              </Col>
              <Col span={6}>
                <span>在职状态：</span>{faceInfo.workCondition || '---'}
              </Col>
              <Col span={6}>
                <span>入职时间：</span>{faceInfo.entryTime || '---'}
              </Col>
              <Col span={6}>
                <span>离职时间：</span>{faceInfo.quitTime || '---'}
              </Col>
            </Row>
            <Row className='schedulingAdd-item-row'>
              <Col span={6}>
                <span>月度：</span>{faceInfo.yearMonth || '---'}
              </Col>
              <Col span={6}>
                <span>工时类型：</span>{faceInfo.hourType || '---'}
              </Col>
              <Col span={6}>
                <span>计薪类型：</span>{faceInfo.salaryType ? (faceInfo.salaryType === 1 ? '计薪制' : '计件制') : '---'}
              </Col>
              <Col span={6}>
                <Item label='考勤制度：'
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                >
                  {getFieldDecorator('req_attendSystem', {
                    initialValue: faceInfo.attendSystem ? faceInfo.attendSystem : 1
                  })(<Select className='input-120' disabled={true} getPopupContainer={(triggerNode: any) => triggerNode.parentElement}>
                    <Option value={2}>六天工作制</Option>
                    <Option value={1}>五天工作制</Option>
                  </Select>)}
                </Item>
              </Col>
            </Row>
          </Row>
          <Row className='schedulingAdd-item'>
            <Row className='schedulingAdd-item-title' type='flex' justify='space-between' >
              <Col span={4}><Icon component={IconPer1}></Icon><span>员工考勤信息</span></Col>
              <Col span={20}>
                <Row type='flex' justify='end' >
                  <Col span={5}>
                    <Item label='上班打卡结果：'
                      labelCol={{ span: 10 }}
                      wrapperCol={{ span: 14 }}
                    >
                      {getFieldDecorator('startResult', {
                        initialValue: '全部'
                      })(<Select className='input-120' getPopupContainer={(triggerNode: any) => triggerNode.parentElement}>
                        <Option value='全部'>全部</Option>
                        <Option value='正常'>正常</Option>
                        <Option value='迟到'>迟到</Option>
                        <Option value='未打卡'>未打卡</Option>
                        <Option value='旷工未打卡'>旷工未打卡</Option>
                      </Select>)}
                    </Item>
                  </Col>
                  <Col span={5}>
                    <Item label='下班打卡结果：'
                      labelCol={{ span: 10 }}
                      wrapperCol={{ span: 14 }}
                    >
                      {getFieldDecorator('endResult', {
                        initialValue: '全部'
                      })(<Select className='input-120' getPopupContainer={(triggerNode: any) => triggerNode.parentElement}>
                        <Option value='全部'>全部</Option>
                        <Option value='正常'>正常</Option>
                        <Option value='早退'>早退</Option>
                        <Option value='未打卡'>未打卡</Option>
                        <Option value='旷工未打卡'>旷工未打卡</Option>
                      </Select>)}
                    </Item>
                  </Col>
                  <Col span={5}>
                    <Item label='温度：'
                      labelCol={{ span: 6 }}
                      wrapperCol={{ span: 18 }}
                    >
                      {getFieldDecorator('temp', {
                        initialValue: '全部'
                      })(<Select className='input-120' getPopupContainer={(triggerNode: any) => triggerNode.parentElement}>
                        <Option value='全部'>全部</Option>
                        <Option value='正常'>正常</Option>
                        <Option value='偏高'>偏高</Option>
                        <Option value='偏低'>偏低</Option>
                      </Select>)}
                    </Item>
                  </Col>
                  <Col span={3}>
                    <Item>
                      <Button type="primary" className='searchbtn' onClick={this.SearchData}>搜索</Button>
                    </Item>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className='schedulingAdd-item-table'>
              <ConfigProvider renderEmpty={dataSourcePic ? emptyTableOfficial ? EmptyTable : customizeRenderEmpty : ReportTable}>
                <Table
                  columns={columns}
                  scroll={{ x: 2560 }}
                  dataSource={tableData}
                  rowKey='date'
                  pagination={false}
                  rowClassName={ this.setClassName }
                />
              </ConfigProvider>
            </Row>
            <Row className='schedulingAdd-item-title'><Icon component={IconPer1}></Icon><span>员工考勤统计</span></Row>
            <Row className='schedulingAdd-item-table'>
              <Row className='schedulingAdd-item-table-title'><span>考勤统计</span></Row>
              <Row className='schedulingAdd-item-table-content'>
                {
                  statistic.map((item:any, index: number) => {
                    return (
                      <Col span={3} key={`static${index}`} className='table-tr'>
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
          <Button className='cancel-btn' onClick={this.handleCancel}>返回</Button>
        </Row>
        <Modal
          visible={modalVisible}
          onCancel={this.onCloseModal}
          width='480px'
          title={<div className='attendance-modal-title'>编辑</div>}
          footer={false}
          destroyOnClose={true}
        >
          <Form.Item label='关联的审批单' {...formItemLayout}>
            {getFieldDecorator('holidayStatus', {})(
              <Select placeholder='请选择' allowClear className='modal-form-width'>
                {
                  absenceList && absenceList.length > 0 && absenceList.map((item: any, index: number) => {
                    return (
                      <Option key={`absence${index}`} value={item.schedulingName}>{item.schedulingName}</Option>
                    )
                  })
                }
              </Select>
            )}
          </Form.Item>
          <Form.Item label='上班打卡时间' {...formItemLayout}>
            {getFieldDecorator('startTime', {})(
              <TimePicker
                format="HH:mm:ss"
                allowClear
                className='modal-form-width'
                onOpenChange={(open) => this.setState({ startOpen: open })}
                open={startOpen}
                addon={() => (
                  <div style={{ textAlign: 'right' }}>
                    <Button size="small" type="primary" onClick={() => this.setState({ startOpen: false })}>
                      确定
                    </Button>
                  </div>
                )}
              />
            )}
          </Form.Item>
          <Form.Item label='下班打卡时间' {...formItemLayout}>
            {getFieldDecorator('endTime', {})(
              <TimePicker
                format="HH:mm:ss"
                allowClear
                className='modal-form-width'
                onOpenChange={(open) => this.setState({ endOpen: open })}
                open={endOpen}
                addon={() => (
                  <div style={{ textAlign: 'right' }}>
                    <Button size="small" type="primary" onClick={() => this.setState({ endOpen: false })}>
                      确定
                    </Button>
                  </div>
                )}
              />
            )}
          </Form.Item>
          <div className='modal-button-group'>
            <Button className='modal-button' type='primary' onClick={this.onSaveAdd}>确定</Button>
            <Button className='modal-button' onClick={this.onCloseModal}>取消</Button>
          </div>
        </Modal>
      </div>
    )
  }
}
const faceDetail = Form.create<FaceDetailProps>()(FaceDetail)
export default faceDetail
