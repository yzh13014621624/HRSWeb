/*
 * @description: 日统计主页面
 * @author: yanzihao
 * @lastEditors: yanzihao
 * @Date: 2020-05-06 09:18:04
 * @LastEditTime: 2020-05-21 10:11:05
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { hot } from 'react-hot-loader'
import { RootComponent, TableItem, BasicModal, BasicDowload, FileUpload } from '@components/index'
import { Button, Form, Row, DatePicker, Input, Tag, message, Select, TimePicker } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import SharedStructure from '@shared/structure/SharedStructure'
import { BaseProps } from 'typings/global'
import moment from 'moment'
import DayStatisticsNum from './components/dayStatisticsNum'
import rest1 from '@assets/images/main/salary/rest1.png'
import absenteeism1 from '@assets/images/main/salary/absenteeism1.png'
import overtime1 from '@assets/images/main/salary/overtime1.png'
import './index.styl'

const { Option } = Select
const { Item } = Form
interface DayStatisticsSearchProps extends FormComponentProps {
  searchData: Function
}
interface DayStatisticsState {
  searchParams: any // 列表的参数
  startOpen: boolean
  endOpen: boolean
  countlist: any
  absenceList: any[] // 关联的审批单
}

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}
class DayStatisticsSearch extends RootComponent<DayStatisticsSearchProps, DayStatisticsState> {
  constructor (props: DayStatisticsSearchProps) {
    super(props)
  }

  // 点击搜索的事件
  searchData = () => {
    const { props: { form: { getFieldsValue } } } = this
    const value = getFieldsValue()
    this.props.searchData(value)
  }

  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <div>
        <Form layout="inline">
          <Item label='考勤日期:'>
            {getFieldDecorator('dayDate', { initialValue: moment().subtract(1, 'days') })(
              <DatePicker dropdownClassName='datepicker'/>
            )}
          </Item>
          <Item>
            <Button type="primary" htmlType="submit" onClick={this.searchData}>
              搜索
            </Button>
          </Item>
        </Form>
      </div>
    )
  }
}
const DayStatisticsSearchComponent = Form.create<DayStatisticsSearchProps>()(DayStatisticsSearch)

class DayStatistics extends RootComponent<BaseProps, DayStatisticsState> {
  tableRef = React.createRef<TableItem<any>>()
  basicModal = React.createRef<BasicModal>()
  selectData: any = undefined // 当前操作的整条数据
  constructor (props: BaseProps) {
    super(props)
    this.state = {
      searchParams: {
        dayDate: moment().subtract(1, 'days').format('YYYYMMDD')
      },
      startOpen: false,
      endOpen: false,
      countlist: {},
      absenceList: []
    }
  }

  componentDidMount = () => {
    this.getCountList()
    // 获取编辑时关联的审批单
    this.axios.request(this.api.querySchedulingList, { type: 2 }, false).then(({ code, data }) => {
      if (code === 200) this.setState({ absenceList: data.scheList })
    })
  }

  // 搜索列表的参数
  searchData = (params: any) => {
    const { dayDate } = params
    this.setState({
      searchParams: { dayDate: dayDate ? moment(dayDate).format('YYYYMMDD') : moment().subtract(1, 'days').format('YYYYMMDD') }
    }, () => {
      this.getCountList()
    })
  }

  // 获取迟到人数、早退人数、出差人数、请假人数
  getCountList = () => {
    const {
      api: { ApiGetAttendList },
      state: { searchParams }
    } = this
    this.axios.request(ApiGetAttendList, searchParams).then(({ code, data }) => {
      if (code === 200 && data.data.length) this.setState({ countlist: data.data[0].faceCountResponse })
      else this.setState({ countlist: {} })
    })
  }

  // 编辑数据
  editData = async (recond: any) => {
    const { faceAttendDetail: { apply, startTime, endTime, dateWeek } } = recond
    const {
      state: { searchParams },
      props: { form: { setFieldsValue } }
    } = this
    this.selectData = recond
    await this.basicModal.current!.handleOk()
    const time = moment(searchParams.dayDate).format('YYYY-MM-DD')
    setFieldsValue({
      apply: apply || undefined,
      startTime: startTime ? moment(`${time} ${startTime}`) : undefined,
      endTime: endTime ? moment(`${time} ${endTime}`) : undefined
    })
  }

  // 弹窗确认
  handleConfirm = () => {
    const {
      selectData,
      api: { updateAttendFace },
      props: { form: { getFieldsValue } }
    } = this
    const { apply, startTime, endTime } = getFieldsValue()
    let { aId, faceAttendDetail: { date, dateWeek } } = selectData
    dateWeek = dateWeek.split(' ')[0]
    const params = {
      aId,
      holidayStatus: apply,
      startTime: startTime ? `${dateWeek} ${moment(startTime).format('HH:mm:ss')}` : undefined,
      endTime: endTime ? `${dateWeek} ${moment(endTime).format('HH:mm:ss')}` : undefined,
      date: Number(date)
    }
    this.basicModal.current!.handleCancel()
    this.axios.request(updateAttendFace, params).then(({ code }) => {
      if (code === 200) {
        message.success('编辑成功')
        this.tableRef.current!.loadingTableData()
        this.getCountList()
      }
    })
  }

  // 弹窗关闭
  handleCancel = (tag: boolean) => {
    if (!tag) this.basicModal.current!.handleCancel()
  }

  render () {
    const {
      isAuthenticated,
      AuthorityList,
      state: { searchParams, startOpen, endOpen, countlist, absenceList },
      props: {
        form: { getFieldDecorator }
      },
      api: { ApiGetAttendList }
    } = this
    const columnData = [
      {
        title: '',
        dataIndex: 'icon',
        width: 60,
        render: (value: any, item: any) => {
          const { faceAttendDetail: { paramType } } = item
          let img: any = ''
          if (paramType) {
            if (paramType === '1') img = rest1
            else if (paramType === '3') img = overtime1
            else if (paramType === '2') img = absenteeism1
          }
          return <img src={img} alt='' />
        }
      },
      { title: '序号', dataIndex: 'index', width: 50 },
      { title: '项目', dataIndex: 'projectName', width: 50 },
      { title: '工号', dataIndex: 'projectNumber', width: 100 },
      { title: '管理编号', dataIndex: 'sjNumber', width: 150 },
      { title: '姓名', dataIndex: 'userName', width: 90 },
      { title: '组织', dataIndex: 'organize', width: 200 },
      { title: '在职状态', dataIndex: 'workCondition', width: 100 },
      {
        title: '入职日期',
        dataIndex: 'entryTime',
        sorter: (a:any, b:any) => Date.parse(a.userInfo.entryTime.replace('-', '/').replace('-', '/')) - Date.parse(b.userInfo.entryTime.replace('-', '/').replace('-', '/')),
        width: 100
      },
      { title: '离职日期', dataIndex: 'quitTime', width: 100 },
      { title: '考勤日期', dataIndex: 'faceAttendDetail.dateWeek', width: 160 },
      {
        title: '关联的审批单',
        dataIndex: 'faceAttendDetail.apply',
        width: 200,
        render: (value: any, item: any) => {
          const { faceAttendDetail: { paramType } } = item
          let color: string = ''
          if (value) {
            if (paramType === '1') color = '#008BFF'
            else if (paramType === '3') color = '#16BC35'
            else if (paramType === '2') color = '#FF3226'
          }
          return <div>
            <div style={{ color: color }}>{value || '---'}</div>
            {
              item.faceAttendDetail.applyBefore && <div style={{ color: 'red' }}>{item.faceAttendDetail.applyBefore}</div>
            }
          </div>
        }
      },
      {
        title: '排班',
        dataIndex: 'faceAttendDetail.scheduling',
        width: 160,
        render: (value: any, item: any) => {
          const { faceAttendDetail: { apply, paramType } } = item
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
        dataIndex: 'faceAttendDetail.startTime',
        width: 160,
        render: (text: any, recond: any) => (
          <span>
            <div>{text || '---'}</div>
            { recond.faceAttendDetail.startTimeBefore && <div className='font-red'>{recond.faceAttendDetail.startTimeBefore}</div> }
          </span>
        )
      },
      {
        title: '上班打卡结果',
        dataIndex: 'faceAttendDetail.startResult',
        width: 160,
        render: (text: any) => {
          if (text === '迟到') return <Tag color="purple">{text}</Tag>
          else if (text === '旷工未打卡') return <Tag color="red">{text}</Tag>
          else if (text === '未打卡') return <Tag color="orange">{text}</Tag>
          else return <span>{text || '---'}</span>
        }
      },
      {
        title: '上班温度检测',
        dataIndex: 'faceAttendDetail.startTemp',
        width: 160,
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
        dataIndex: 'faceAttendDetail.endTime',
        width: 160,
        render: (text: any, recond: any) => (
          <span>
            <div>{text || '---'}</div>
            { recond.faceAttendDetail.endTimeBefore && <div className='font-red'>{recond.faceAttendDetail.endTimeBefore}</div> }
          </span>
        )
      },
      {
        title: '下班打卡结果',
        dataIndex: 'faceAttendDetail.endResult',
        width: 160,
        render: (text: any) => {
          if (text === '早退') return <Tag color="blue">{text}</Tag>
          else if (text === '旷工未打卡') return <Tag color="red">{text}</Tag>
          else if (text === '未打卡') return <Tag color="orange">{text}</Tag>
          else return <span>{text || '---'}</span>
        }
      },
      {
        title: '下班温度检测',
        dataIndex: 'faceAttendDetail.endTemp',
        width: 160,
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
      { title: '工作时长（分钟）', dataIndex: 'faceAttendDetail.workHours', width: 160, render: (text: any) => <span>{text ? `${text}分钟` : '---'}</span> },
      { title: '迟到时长（分钟）', dataIndex: 'faceAttendDetail.lateHours', width: 160, render: (text: any) => <span>{text ? `${text}分钟` : '---'}</span> },
      { title: '早退时长（分钟）', dataIndex: 'faceAttendDetail.earlyHours', width: 160, render: (text: any) => <span>{text ? `${text}分钟` : '---'}</span> },
      { title: '出差时长（分钟）', dataIndex: 'faceAttendDetail.tripHours', width: 160, render: (text: any) => <span>{text ? `${text}分钟` : '---'}</span> },
      { title: '加班时长（分钟）', dataIndex: 'faceAttendDetail.overHours', width: 160, render: (text: any) => <span>{text ? `${text}分钟` : '---'}</span> },
      { title: '请假时长（分钟）', dataIndex: 'faceAttendDetail.leaveHours', width: 160, render: (text: any) => <span>{text ? `${text}分钟` : '---'}</span> },
      { title: '外出时长（分钟）', dataIndex: 'faceAttendDetail.outHours', width: 160, render: (text: any) => <span>{text ? `${text}分钟` : '---'}</span> },
      {
        title: '操作',
        dataIndex: 'action',
        fixed: 'right',
        render: (value: any, item: any) => {
          return (
            <span>{isAuthenticated(AuthorityList.compose[4]) && <Button type='link' onClick={() => this.editData(item)}>编辑</Button>}</span>
          )
        }
      }
    ]
    return (
      <div id='daystatistics'>
        <DayStatisticsSearchComponent searchData={this.searchData}/>
        <Row className='count'>
          <DayStatisticsNum title={'迟到人数'} count={countlist.lateNum || 0} />
          <DayStatisticsNum title={'早退人数'} count={countlist.earlyNum || 0} />
          <DayStatisticsNum title={'出差人数'} count={countlist.tripNum || 0} />
          <DayStatisticsNum title={'请假人数'} count={countlist.leaveNum || 0}/>
        </Row>
        <Row>
          <TableItem
            ref={this.tableRef}
            rowSelectionFixed
            filterKey="userId"
            rowKey={({ userId }) => userId}
            URL={ ApiGetAttendList }
            scroll={{ x: 2950 }}
            searchParams={searchParams}
            columns={columnData}
            rowSelection={false}
            setRowClassNameType={1}
          />
        </Row>
        <BasicModal
          ref={this.basicModal}
          title='编辑'
          width={480}
          destroyOnClose={true}
          colseModel={this.handleCancel}
        >
          <Form>
            <Row>
              <Item label='关联的审批单:' {...formItemLayout} >
                {getFieldDecorator('apply')(
                  <Select className='input-220' placeholder='请选择'>
                    {
                      absenceList.map((item: any) => (
                        <Option value={item.schedulingName} key={item.ophId}>{item.schedulingName}</Option>
                      ))
                    }
                  </Select>
                )}
              </Item>
            </Row>
            <Row>
              <Item label='上班打卡时间:' {...formItemLayout}>
                {getFieldDecorator('startTime')(
                  <TimePicker
                    format='HH:mm:ss'
                    allowClear
                    className='input-220'
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
              </Item>
            </Row>
            <Row>
              <Item label='下班打卡时间:' {...formItemLayout}>
                {getFieldDecorator('endTime')(
                  <TimePicker
                    format='HH:mm:ss'
                    allowClear
                    className='input-220'
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
              </Item>
            </Row>
            <Row className='daystatistics-btn'>
              <Button type='primary' onClick={this.handleConfirm} className='confrim-btn'>确定</Button>
              <Button className='cancel-btn' onClick={() => this.handleCancel(false)}>取消</Button>
            </Row>
          </Form>
        </BasicModal>
      </div>
    )
  }
}
export default Form.create<any>()(DayStatistics)
