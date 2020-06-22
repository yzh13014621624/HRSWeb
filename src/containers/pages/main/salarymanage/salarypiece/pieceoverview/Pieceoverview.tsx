/*
 * @description: 计件项目总览列表
 * @author: qiuyang
 * @lastEditors: qiuyang
 * @Date: 2019-09-20 14:44:39
 * @LastEditTime: 2020-05-29 13:19:59
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, TableItem } from '@components/index'
import { Button, Form, Row, DatePicker, Input, Icon, Modal, Popover, Col } from 'antd'
import { BaseProps, KeyValue } from 'typings/global'
import moment from 'moment'
import Compute from './../Compute'
import { FormComponentProps } from 'antd/lib/form'
import './Pieceoverview.styl'
import NumberFormatUtils from '@utils/NumberFormat'
import SysUtil from '@utils/SysUtil'

const { Item } = Form
const { MonthPicker } = DatePicker

interface FormProps extends BaseProps, FormComponentProps {}

interface PopContentState {
  dataSet: KeyValue
}

class PopContent extends RootComponent<FormProps, PopContentState> {
  constructor (props: FormProps) {
    super(props)
  }

  render () {
    const { pipName, dataSet } = this.props
    return (
      <div id = 'Pieceoverview'>
        {
          dataSet.requpShelf
            ? <div>
              <p className='Pieceoverview-title'>
                <span>{pipName}</span>
              </p>
              <p className='Pieceoverview-p-left'>
                <span className='Pieceoverview-div-left'><span className='Pieceoverview-span-left'>收货（每托盘/单价）：</span><span className='Pieceoverview-span-right'>{dataSet.reqcollectGoods}</span></span>
                <span><span className='Pieceoverview-span-left'>上架（每托盘/单价）：</span><span className='Pieceoverview-span-right'>{dataSet.requpShelf}</span></span>
              </p>
              <p className='Pieceoverview-p-left'>
                <span className='Pieceoverview-div-left'><span className='Pieceoverview-span-left'>补货（每托盘/单价）：</span><span className='Pieceoverview-span-right'>{dataSet.reqrepairGoods}</span></span>
                <span><span className='Pieceoverview-span-left'>整箱拣货-标签拣选（每箱/单价）：</span><span className='Pieceoverview-span-right'>{dataSet.reqrfLabel}</span></span>
              </p>
              <p className='Pieceoverview-p-left'>
                <span className='Pieceoverview-div-left'><span className='Pieceoverview-span-left'>整箱拣货-RF拣选（每箱/单价）：</span><span className='Pieceoverview-span-right'>{dataSet.reqrfBox}</span></span>
                <span><span className='Pieceoverview-span-left'>整箱拣货-RF拣选（每行/单价）：</span><span className='Pieceoverview-span-right'>{dataSet.reqrfRow}</span></span>
              </p>
              <p className='Pieceoverview-p-left'>
                <span className='Pieceoverview-div-left'><span className='Pieceoverview-span-left'>拆零拣货（单价）：</span><span className='Pieceoverview-span-right'>{dataSet.reqzeroPick}</span></span>
                <span><span className='Pieceoverview-span-left'>拆零上架（每托盘/单价）：</span><span className='Pieceoverview-span-right'>{dataSet.reqzeroUp}</span></span>
              </p>
              <p className='Pieceoverview-p-left'>
                <span className='Pieceoverview-div-left'><span className='Pieceoverview-span-left'>拆零下架（每托盘/单价）：</span><span className='Pieceoverview-span-right'>{dataSet.reqzeroDown}</span></span>
                <span><span className='Pieceoverview-span-left'>越库（每箱/单价）：</span><span className='Pieceoverview-span-right'>{dataSet.reqcrossDocking}</span></span>
              </p>
              <p className='Pieceoverview-p-left'>
                <span className='Pieceoverview-div-left'><span className='Pieceoverview-span-left'>移库（每托盘/单价）：</span><span className='Pieceoverview-span-right'>{dataSet.reqmoveLibrary}</span></span>
              </p>
            </div> : <p className='Pieceoverview-notData'><span>请先配置该计件项目参数!</span></p>
        }
      </div>
    )
  }
}

interface State {
  searchParams: KeyValue
  dataSet: KeyValue
  dataCache: KeyValue
}

class SalaryPieceOverview extends RootComponent<FormProps, State> {
  constructor (props: FormProps) {
    super(props)
    const searchParams = SysUtil.getSessionStorage('pieceoverview_searchParams')
    this.state = {
      dataCache: {}, // 列表各单价缓存
      searchParams: searchParams || {
        pvTime: moment().subtract(1, 'months').format('YYYYMM')
      },
      dataSet: {} // 存储各单价
    }
  }

  // 鼠标移入调用
  propsChang = (records: KeyValue) => {
    const { piProjectId } = records
    const { searchParams: { pvTime }, dataCache } = this.state
    let manageData = {}
    if (!dataCache[piProjectId]) {
      this.axios.request(this.api.getParameterHis, { piProjectId, pvTime }).then(({ data }) => {
        if (data.ppDataList) {
          manageData = data.ppDataList ? Compute.PriceProcessing(data.ppDataList) : {}
        }
        dataCache[piProjectId] = data
        this.setState({
          dataCache,
          dataSet: manageData
        })
      })
    } else {
      if (dataCache[piProjectId]) {
        manageData = dataCache[piProjectId].ppDataList ? Compute.PriceProcessing(dataCache[piProjectId].ppDataList) : {}
      }
      this.setState({
        dataSet: manageData
      })
    }
  }

  // 搜素点击事件
  searchOnClick = () => {
    const momentTime = this.props.form.getFieldValue('pvTime')
    const pvTime = parseInt(moment(momentTime).format('YYYYMM'))
    this.setState({ searchParams: { pvTime } })
  }

  // 列表查看
  examineClick = (records: any) => {
    const momentTime = this.props.form.getFieldValue('pvTime')
    const pvTime = parseInt(moment(momentTime).format('YYYYMM'))
    const { piProjectId, pipName, pipAddress, maintenance } = records
    const userInfo = JSON.stringify({ maintenance, piProjectId, pipName, pvTime, pipAddress })
    localStorage.setItem('pieceoverviewList-userInfo', userInfo)
    this.props.history.push(`/home/salarypiece/SalaryPieceOverview/pieceoverviewlist`)
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { searchParams } = this.state
    const columns = [
      { title: '序号', dataIndex: 'index', width: 80 },
      {
        title: '计件项目',
        dataIndex: '',
        render: (text: any, records: any) => {
          return (
            <Popover placement="bottomLeft" content={<PopContent {...this.props} dataSet={this.state.dataSet} pipName={records.pipName}/>}>
              <span style = {{ color: '#40A9FF' }} key = {records.id} onMouseOver={() => this.propsChang(records)}>{records.pipName}</span>
            </Popover>
          )
        }
      },
      {
        title: '月度',
        render: () => {
          return (
            <span>{this.state.searchParams.pvTime ? NumberFormatUtils.doubleFormat(this.state.searchParams.pvTime / 100, 2) : '---'}</span>
          )
        }
      },
      { title: '人数', dataIndex: 'peopleNumber' },
      { title: '计件收入', dataIndex: 'pvIncomeTotal' },
      { title: '非计件收入', dataIndex: 'pvNoIncomeTotal' },
      { title: '计件小时数', dataIndex: 'pvHourNumTotal' },
      { title: '非计件小时数', dataIndex: 'pvNoHourNumTotal' },
      { title: '计件奖金', dataIndex: 'pvBonusTotal' },
      { title: '计件凭证维护状态',
        render: (text: any, records: any) => {
          // 根据人数判断为0，则为未维护
          return (
            records.peopleNumber ? <span>已维护</span> : <span style = {{ color: '#F5222D' }}>未维护</span>
          )
        }
      },
      {
        title: '操作',
        render: (text: any, records: any) => {
          return this.isAuthenticated(this.AuthorityList.salarypiece[10]) && <span style = {{ color: '#40A9FF', cursor: 'pointer' }} onClick={() => this.examineClick(records)}>查看</span>
        }
      }
    ]
    return (
      <div id = 'PieceoverviewList'>
        <Form layout='inline'>
          <Row>
            <Item label="月度">
              { getFieldDecorator('pvTime', {
                initialValue: searchParams.pvTime ? moment(String(searchParams.pvTime), 'YYYYMM') : undefined
              })(
                <MonthPicker format="YYYY年MM月" allowClear={false} disabledDate={(current: any) => current && current > moment().endOf('day')}/>
              ) }
            </Item>
            <Item>
              <Button type="primary" className='contract-search-button' onClick={this.searchOnClick}>搜索</Button>
            </Item>
          </Row>
          <TableItem
            rowSelection = {false}
            searchParams = {searchParams}
            columns = {columns}
            URL = {this.api.Pieceoverview}
            rowSelectionFixed
            rowKey = {({ index }) => index}
            bufferSearchParamsKey='pieceoverview_searchParams'
          />
        </Form>
      </div>
    )
  }
}
export default Form.create()(SalaryPieceOverview)
