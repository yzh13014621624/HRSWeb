/*
 * @description: 员工历史薪资页面
 * @author: maqian
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: maqian
 * @Date: 2019-09-25 18:19:38
 * @LastEditTime: 2020-05-29 15:55:55
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import moment from 'moment'
import { hot } from 'react-hot-loader'
import SysUtil from '@utils/SysUtil'
import { Tabs, Row, Icon, Col } from 'antd'
import { IconDc } from '@components/icon/BasicIcon'
import { RootComponent, TableItem, BasicDowload } from '@components/index'

import './index.styl'
import HistorySalaryForm from '../components/Form'

const TabPane = Tabs.TabPane

@hot(module)
class HistorySalary extends RootComponent<any, any> {
  private columnData1:Array<any> = SysUtil.getSessionStorage('HistoryList')
  private columnData2:Array<any> = SysUtil.getSessionStorage('HistoryList')
  private columnData3:Array<any> = SysUtil.getSessionStorage('HistoryList')
  private columnData4:Array<any> = SysUtil.getSessionStorage('HistoryList')
  constructor (props:any) {
    super(props)
    // let a = {
    //   type: null || '1',
    //   number: null,
    //   numberType: null,
    //   name: null,
    //   to: null,
    //   from: null
    // }
    this.state = {
      type: null || '1',
      dataSource: [],
      searchParams1: {},
      searchParams2: {},
      searchParams3: {},
      searchParams4: {}
    }
  }

  onSearchChange = (searchParam:any) => {
    const { type } = this.state
    const { from, to } = searchParam
    searchParam['type'] = type
    let resMonth:any
    resMonth = this.getMonthBetween(from, to)
    if (resMonth) {
      if (type === '1') {
        this.columnData1 = []
        this.columnData1 = SysUtil.getSessionStorage('HistoryList')
        resMonth.forEach((element:string) => {
          this.columnData1.push({ title: element + '税前工资', dataIndex: `preTaxSalaryVO.everyMonth.${element}`, width: 180, render: (text:any) => (<span>{text || '- - -'}</span>) })
        })
        this.columnData1.push(
          { title: '一年一次优惠奖金', dataIndex: 'preTaxSalaryVO.preferentialBonusTotal', width: 180, render: (text:any) => (<span>{text || '- - -'}</span>) },
          { title: '总收入', dataIndex: 'preTaxSalaryVO.total', width: 130, render: (text:any) => (<span>{text || '- - -'}</span>) },
          { title: '平均工资', dataIndex: 'preTaxSalaryVO.average', width: 140, render: (text:any) => (<span>{text || '- - -'}</span>) }
        )
        this.setState({
          searchParams1: searchParam
        })
      } else if (type === '2') {
        this.columnData2 = []
        this.columnData2 = SysUtil.getSessionStorage('HistoryList')
        resMonth.forEach((element:string) => {
          this.columnData2.push({ title: element + '最终发放', dataIndex: `finalGrantVO.everyMonth.${element}`, width: 180, render: (text:any) => (<span>{text || '- - -'}</span>) })
        })
        this.columnData2.push(
          { title: '总发放工资', dataIndex: 'finalGrantVO.total', width: 180, render: (text:any) => (<span>{text || '- - -'}</span>) },
          { title: '平均发放工资', dataIndex: 'finalGrantVO.average', width: 130, render: (text:any) => (<span>{text || '- - -'}</span>) }
        )
        this.setState({
          searchParams2: searchParam
        })
      } else if (type === '3') {
        this.columnData3 = []
        this.columnData3 = SysUtil.getSessionStorage('HistoryList')
        resMonth.forEach((element:string) => {
          this.columnData3.push({ title: element + '人力成本', dataIndex: `humanCostVO.everyMonth.${element}`, width: 180, render: (text:any) => (<span>{text || '- - -'}</span>) })
        })
        this.columnData3.push(
          { title: '总人力成本', dataIndex: 'humanCostVO.total', width: 180, render: (text:any) => (<span>{text || '- - -'}</span>) },
          { title: '平均人力成本', dataIndex: 'humanCostVO.average', width: 130, render: (text:any) => (<span>{text || '- - -'}</span>) }
        )
        this.setState({
          searchParams3: searchParam
        })
      } else if (type === '4') {
        this.columnData4 = []
        this.columnData4 = SysUtil.getSessionStorage('HistoryList')
        resMonth.forEach((element:string) => {
          this.columnData4.push({ title: element + '税前工资&一年一次优惠奖金', dataIndex: `preTaxInComeVO.everyMonth.${element}`, width: 300, render: (text:any) => (<span>{text || '- - -'}</span>) })
        })
        this.columnData4.push(
          { title: '税前工资&一年一次优惠奖金总计', dataIndex: 'preTaxInComeVO.total', width: 200, render: (text:any) => (<span>{text || '- - -'}</span>) }
        )
        this.setState({
          searchParams4: searchParam
        })
      }
    }
  }

  onTabChange = (type:any) => {
    this.setState({ type })
  }

  getMonthBetween (start:string, end:string) { // 传入的格式YYYY-MM
    if (start && end) {
      let result:string[] = []
      let [s1, s2]:string[] = start.split('-')
      let [e1, e2]:string[] = end.split('-')
      let min:Date = new Date()
      let max:Date = new Date()
      min.setFullYear(Number(s1), Number(s2) * 1 - 1, 1) // 开始日期
      max.setFullYear(Number(e1), Number(e2) * 1 - 1, 1) // 结束日期
      let curr = min
      while (curr.getTime() <= max.getTime()) {
        let month: number = curr.getMonth()
        result.push(moment(curr).format('YYYY-MM'))
        curr.setMonth(month + 1)
      }
      return result
    }
  }

  render () {
    const { state, isAuthenticated, AuthorityList, columnData1, columnData2, columnData3, columnData4 } = this
    const salaryaccount = AuthorityList.salaryaccount
    const { searchParams1, searchParams2, searchParams3, searchParams4 } = state
    let sum1:number = 0
    let sum2:number = 0
    let sum3:number = 0
    let sum4:number = 0
    columnData1.forEach((el:any) => {
      sum1 += Number(el.width)
    })
    columnData2.forEach((el:any) => {
      sum2 += Number(el.width)
    })
    columnData3.forEach((el:any) => {
      sum3 += Number(el.width)
    })
    columnData4.forEach((el:any) => {
      sum4 += Number(el.width)
    })
    return (
      <div id='history-salary'>
        <Tabs defaultActiveKey={'1'} onChange={this.onTabChange}>
          <TabPane tab="税前工资查询" key='1' >
            <Row className='ant-row-margin'>
              <Col span={20}>
                <HistorySalaryForm onSearchChange={this.onSearchChange} type={1} {...this.props} />
              </Col>
              {
                isAuthenticated(salaryaccount[16]) &&
                  <Col span={2} offset={2} style={{ marginTop: 8 }}>
                    <BasicDowload action={this.api.HistoryListExport}
                      parmsData={searchParams1}
                      dowloadURL="URL"
                      className="btn-style" btntype="primary">
                      <Icon component={IconDc}/>导出
                    </BasicDowload>
                  </Col>
              }
            </Row>
            <TableItem
              rowSelectionFixed
              filterKey="projectId"
              URL={this.api.HistroyList}
              columns={this.columnData1}
              rowKey={({ projectId }) => projectId}
              scroll={{ x: sum1 }}
              searchParams={searchParams1}
              isPagination={false}
              requried={false}
            />
          </TabPane>
          <TabPane tab="最终发放工资查询" key="2">
            <Row className='ant-row-margin'>
              <Col span={20}>
                <HistorySalaryForm onSearchChange={this.onSearchChange} type={2} {...this.props} />
              </Col>
              {
                isAuthenticated(salaryaccount[17]) &&
                  <Col span={2} offset={2} style={{ marginTop: 8 }}>
                    <BasicDowload action={this.api.HistoryListExport}
                      parmsData={searchParams2}
                      dowloadURL="URL"
                      className="btn-style" btntype="primary">
                      <Icon component={IconDc}/>导出
                    </BasicDowload>
                  </Col>
              }
            </Row>
            <TableItem
              rowSelectionFixed
              filterKey="projectId"
              URL={this.api.HistroyList}
              columns={this.columnData2}
              rowKey={({ projectId }) => projectId}
              scroll={{ x: sum2 }}
              searchParams={searchParams2}
              isPagination={false}
              requried={false}
            />
          </TabPane>
          <TabPane tab="人力成本查询" key="3">
            <Row className='ant-row-margin'>
              <Col span={20}>
                <HistorySalaryForm onSearchChange={this.onSearchChange} type={3} {...this.props} />
              </Col>
              {
                isAuthenticated(salaryaccount[18]) &&
                  <Col span={2} offset={2} style={{ marginTop: 8 }}>
                    <BasicDowload action={this.api.HistoryListExport}
                      parmsData={searchParams3}
                      dowloadURL="URL"
                      className="btn-style" btntype="primary">
                      <Icon component={IconDc}/>导出
                    </BasicDowload>
                  </Col>
              }
            </Row>
            <TableItem
              rowSelectionFixed
              filterKey="projectId"
              URL={this.api.HistroyList}
              columns={this.columnData3}
              rowKey={({ projectId }) => projectId}
              scroll={{ x: sum3 }}
              searchParams={searchParams3}
              isPagination={false}
              requried={false}
            />
          </TabPane>
          <TabPane tab="税前收入查询" key="4">
            <Row className='ant-row-margin'>
              <Col span={20}>
                <HistorySalaryForm onSearchChange={this.onSearchChange} type={4} {...this.props} />
              </Col>
              {
                isAuthenticated(salaryaccount[19]) &&
                  <Col span={2} offset={2} style={{ marginTop: 8 }}>
                    <BasicDowload action={this.api.HistoryListExport}
                      parmsData={searchParams4}
                      dowloadURL="URL"
                      className="btn-style" btntype="primary">
                      <Icon component={IconDc}/>导出
                    </BasicDowload>
                  </Col>
              }
            </Row>
            <TableItem
              rowSelectionFixed
              filterKey="projectId"
              URL={this.api.HistroyList}
              columns={this.columnData4}
              rowKey={({ projectId }) => projectId}
              scroll={{ x: sum4 }}
              searchParams={searchParams4}
              isPagination={false}
              requried={false}
            />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
export default HistorySalary
