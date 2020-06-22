/**
 * @author minjie
 * @createTime 2019/04/20
 * @description 行的信息
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent } from '@components/index'
import { Button, Row, Col } from 'antd'
import moment from 'moment'
import './index.styl'

const TABLE_HEADER = [
  {
    title: '法定假日期',
    index: 0,
    name: 'legalHolidayDate'
  },
  {
    title: '法定假天数',
    index: 1,
    name: 'legalHolidayNum'
  },
  {
    title: '额定出勤天数-六天制',
    index: 2,
    name: 'ratedAttendanceSix'
  },
  {
    title: '额定出勤天数-五天制',
    index: 3,
    name: 'ratedAttendanceFive'
  }
]

interface AttendanceTaleProps {
  dataSource: any,
  history: any,
  isAllowEdit: boolean
}

interface AttendanceTaleState {
}

export default class AttendanceTale extends RootComponent<AttendanceTaleProps, AttendanceTaleState> {
  constructor (props:any) {
    super(props)
    this.state = {
    }
  }

  componentDidMount () {
  }

  handleHolidayDate = (dates: string) => {
    let holidayRenderString = ''
    if (!dates) return '---'
    const dateArray = dates.split('/')
    dateArray.forEach((element, index) => {
      const singleDay = element.split('-')
      if (index !== 0) {
        holidayRenderString += '/'
      }
      holidayRenderString += parseFloat(singleDay[2]) + '号'
    })
    return holidayRenderString
  }

  onViewDetail = (id: any) => {
    this.props.history.push(`/home/attendanceparameters/atttendance/${id}`)
  }

  render () {
    const { dataSource, isAllowEdit } = this.props
    return (
      <div className="attendance-table">
        <Row className='table-row-header'>
          <Col span={12} className='header-check'>
            <span className="create-time">{dataSource.ahpYear}年度 {`（创建时间：${dataSource.createTime}）`}</span>
          </Col>
          <Col span={4} offset={8} className='header-btn'>
            {isAllowEdit && <Button size='small' style={{ float: 'right' }} onClick={() => this.onViewDetail(dataSource.ahpId)}>查看</Button>}
          </Col>
        </Row>
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
        <Row className='table-body'>
          <Col span={3} className='table-left-title'>
            {TABLE_HEADER.map(item => {
              return <div className='left-title-item' key={item.index}>{item.title}</div>
            })}
          </Col>
          <Col span={21}>
            <Row>
              {
                dataSource.attendParamDetailResponseList && dataSource.attendParamDetailResponseList.map((item: any, index: any) => {
                  return (
                    <Col span={2} key={index}>
                      <Row className='table-row table-body-row holiday-date' title={this.handleHolidayDate(item.legalHolidayDate)}>
                        {this.handleHolidayDate(item.legalHolidayDate)}
                      </Row>
                      <Row className='table-row table-body-row'>
                        {item.legalHolidayNum}
                      </Row>
                      <Row className='table-row table-body-row'>
                        {item.ratedAttendanceSix}
                      </Row>
                      <Row className='table-row table-body-row'>
                        {item.ratedAttendanceFive}
                      </Row>
                    </Col>
                  )
                })
              }
            </Row>
          </Col>
        </Row>
      </div>
    )
  }
}
