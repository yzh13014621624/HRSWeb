/*
 * @description: 员工计件收入详情
 * @author: qiuyang
 * @lastEditors: qiuyang
 * @Date: 2019-09-20 14:47:20
 * @LastEditTime: 2020-05-20 10:09:13
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { FormComponentProps } from 'antd/lib/form'
import { RootComponent } from '@components/index'
import { Button, Form, Row, DatePicker, Table, Icon, Modal, Divider, Col } from 'antd'
import { BaseProps, KeyValue } from 'typings/global'
import { IconPer1, IconPer9 } from '@components/icon/BasicIcon'
import './PieceworkIncomeInfo.styl'

const { Item } = Form

const labelLayout = {
  labelCol: {
    span: 5
  },
  wrapperCol: {
    span: 19
  }
}
// 员工计件收入明细，（循环）第一列表头
const columns = [
  {
    title: '收货（每托盘/数量）',
    dataIndex: 'collectGoods',
    width: 80
  },
  {
    title: '上架（每托盘/数量）',
    dataIndex: 'upShelf',
    width: 80
  },
  {
    title: '补货（每托盘/数量）',
    dataIndex: 'repairGoods',
    width: 80
  },
  {
    title: '整箱拣货-标签拣选（每箱/数量）',
    dataIndex: 'rfLabel',
    width: 110
  },
  {
    title: '整箱拣货-RF拣选（每箱/数量）',
    dataIndex: 'rfBox',
    width: 110
  },
  {
    title: '整箱拣货-RF拣选（每行/数量）',
    dataIndex: 'rfRow',
    width: 110
  },
  {
    title: '拆零拣货（每行/数量）',
    dataIndex: 'zeroPick',
    width: 90
  },
  {
    title: '拆零上架（每托盘/数量）',
    dataIndex: 'zeroUp',
    width: 90
  },
  {
    title: '拆零下架（每托盘/数量）',
    dataIndex: 'zeroDown',
    width: 90
  },
  {
    title: '越库（每箱/数量）',
    dataIndex: 'crossDocking',
    width: 80
  },
  {
    title: '移库（每托盘/数量）',
    dataIndex: 'moveLibrary',
    width: 80
  }
]

// 员工计件收入明细，（循环）第二列表头
const columns2 = [
  {
    title: '收货（每托盘/单价）',
    dataIndex: 'collectGoodsPrice',
    width: 80
  },
  {
    title: '上架（每托盘/单价）',
    dataIndex: 'upShelfPrice',
    width: 80
  },
  {
    title: '补货（每托盘/单价）',
    dataIndex: 'repairGoodsPrice',
    width: 80
  },
  {
    title: '整箱拣货-标签拣选（每箱/单价）',
    dataIndex: 'rfLabelPrice',
    width: 110
  },
  {
    title: '整箱拣货-RF拣选（每箱/单价）',
    dataIndex: 'rfBoxPrice',
    width: 110
  },
  {
    title: '整箱拣货-RF拣选（每行/单价）',
    dataIndex: 'rfRowPrice',
    width: 110
  },
  {
    title: '拆零拣货（每行/单价）',
    dataIndex: 'zeroPickPrice',
    width: 90
  },
  {
    title: '拆零上架（每托盘/单价）',
    dataIndex: 'zeroUpPrice',
    width: 90
  },
  {
    title: '拆零下架（每托盘/单价）',
    dataIndex: 'zeroDownPrice',
    width: 90
  },
  {
    title: '越库（每箱/单价）',
    dataIndex: 'crossDockingPrice',
    width: 80
  },
  {
    title: '移库（每托盘/单价）',
    dataIndex: 'moveLibraryPrice',
    width: 80
  }
]

// 员工计件收入明细，（循环）第三列表头
const columns3 = [
  {
    title: '本月收货（每托盘）金额',
    dataIndex: 'collectGoodsMoney',
    width: 80
  },
  {
    title: '本月上架（每托盘）金额',
    dataIndex: 'upShelfMoney',
    width: 80
  },
  {
    title: '本月补货（每托盘）金额',
    dataIndex: 'repairGoodsMoney',
    width: 80
  },
  {
    title: '本月整箱拣货-标签拣选（每箱）金额',
    dataIndex: 'rfLabelMoney',
    width: 110
  },
  {
    title: '本月整箱拣货-RF拣选（每箱）金额',
    dataIndex: 'rfBoxMoney',
    width: 110
  },
  {
    title: '本月整箱拣货-RF拣选（每行）金额',
    dataIndex: 'rfRowMoney',
    width: 110
  },
  {
    title: '本月拆零拣货（每行）金额',
    dataIndex: 'zeroPickMoney',
    width: 90
  },
  {
    title: '本月拆零上架（每托盘）金额',
    dataIndex: 'zeroUpMoney',
    width: 90
  },
  {
    title: '本月拆零下架（每托盘）金额',
    dataIndex: 'zeroDownMoney',
    width: 90
  },
  {
    title: '本月越库（每箱）金额',
    dataIndex: 'crossDockingMoney',
    width: 80
  },
  {
    title: '本月移库（每托盘）金额',
    dataIndex: 'moveLibraryMoney',
    width: 80
  }
]

// 员工计件收入明细，底部计件项目总明细表头
const columns5: any[] = [
  {
    title: `计件收入小计`,
    dataIndex: 'pvIncomeTotal',
    align: 'center',
    width: 120
  },
  {
    title: `计件小时数小计`,
    dataIndex: 'pvHourNumTotal',
    align: 'center',
    width: 120
  },
  {
    title: `平均每小时计件费用`,
    dataIndex: 'pvHourPriceTotal',
    align: 'center',
    width: 120
  },
  {
    title: `非计件小时数小计`,
    dataIndex: 'pvNoHourNumTotal',
    align: 'center',
    width: 120
  },
  {
    title: '非计件收入小计',
    dataIndex: 'pvNoIncome',
    align: 'center',
    width: 120
  },
  {
    title: '实际计件类收入',
    dataIndex: 'apworkIncome',
    align: 'center',
    width: 120
  },
  {
    title: '计件奖金',
    dataIndex: 'pvBonusTotal',
    align: 'center',
    width: 120
  }
]

interface State {
  pieceworkIncomeInfo: KeyValue
  pIncomeDetails: any[]
}

interface FormProps extends BaseProps, FormComponentProps{}

class PieceworkIncomeInfo extends RootComponent<FormProps, State> {
  columns4: any
  userInfo: KeyValue = this.props.location.state || JSON.parse(localStorage.getItem('PieceoverviewPage') as string)
  constructor (props: FormProps) {
    super(props)
    // 动态表头
    this.columns4 = []
    this.state = {
      pieceworkIncomeInfo: {}, // 存储详情接口存储所有数据
      pIncomeDetails: []
    }
  }

  UNSAFE_componentWillMount= () => {
    this.axios.request(this.api.PieceworkIncomeInfo, this.userInfo).then(({ data }) => {
      const { pIncomeDetails } = data
      for (let i = 0; i < pIncomeDetails.length; i++) {
        this.columns4.push([
          {
            title: `${pIncomeDetails[i].pipName}计件收入`,
            dataIndex: 'pvIncome',
            width: 120,
            align: 'center'
          },
          {
            title: `${pIncomeDetails[i].pipName}计件小时数`,
            dataIndex: 'pvHourNum',
            width: 120,
            align: 'center'
          },
          {
            title: `${pIncomeDetails[i].pipName}非计件小时数`,
            dataIndex: 'pvNoHourNum',
            width: 120,
            align: 'center'
          },
          {
            title: `计件系数`,
            dataIndex: 'pvCoe',
            width: 120,
            align: 'center'
          },
          {
            title: '计件奖金',
            dataIndex: 'pvBonus',
            width: 120,
            align: 'center'
          }
        ])
      }
      this.setState({
        pieceworkIncomeInfo: data,
        pIncomeDetails
      })
    })
  }

  titleTop = (index: number) => {
    const { state: { pIncomeDetails } } = this
    return <span className='PieceworkIncomeEdit-table-title-span'>{ (pIncomeDetails[index] || {}).pipName }</span>
  }

  titleBottom = () => {
    return <span className='PieceworkIncomeEdit-table-title-span'>计件项目总明细</span>
  }

  cancel = () => {
    this.props.history.push(`/home/salarypiece?defaultActive=${'2'}`)
  }

  render () {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const { pieceworkIncomeInfo: { projectName, projectNumber, sjNumber, userName, organize, idCard, entity }, pIncomeDetails, pieceworkIncomeInfo } = this.state
    getFieldDecorator('keys', { initialValue: pIncomeDetails || {} })
    const keys = getFieldValue('keys')
    const formText = keys.map((k: any, index: any) => (
      <div key = {index}>
        <Row className = 'table-row'>
          <Table rowKey='collectGoods' columns={columns} dataSource={[pIncomeDetails[index]]} pagination = {false} bordered = {true} title = {() => this.titleTop(index)}></Table>
          <Table rowKey='collectGoodsPrice' columns={columns2} dataSource={[pIncomeDetails[index]]} pagination = {false} bordered = {true}></Table>
          <Table rowKey='collectGoodsMoney' columns={columns3} dataSource={[pIncomeDetails[index]]} pagination = {false} bordered = {true} className='last-table'></Table>
        </Row>
        <Row className='table-row-bottom'>
          <Table rowKey='pvCoe' columns={this.columns4[index]} dataSource={[pIncomeDetails[index]]} pagination = {false} bordered = {true}></Table>
        </Row>
      </div>
    ))
    return (
      <div id = 'PieceworkIncomeEdit'>
        <Form {...labelLayout}>
          <Row className='PieceworkIncomeEdit-title-icon'>
            <Icon component={IconPer1}/>
            <span className='PieceworkIncomeEdit-title-text'> 员工信息</span>
          </Row>
          <Row className = 'PieceworkIncomeEdit-top-info'>
            <Row>
              <Col span={6}>
                <Form.Item label='项目'>
                  <span className='text-color'>{projectName || '---'}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label='工号'>
                  <span className='text-color'>{projectNumber || '---'}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label='管理编号'>
                  <span className='text-color'>{sjNumber || '---'}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label='姓名'>
                  <span className='text-color'>{userName || '---'}</span>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <Item label='组织'>
                  <span className='text-color'>{organize || '---'}</span>
                </Item>
              </Col>
              <Col span={6}>
                <Item label='法人主体'>
                  <span className='text-color'>{entity || '---'}</span>
                </Item>
              </Col>
              <Col span={6}>
                <Item label='月度'>
                  <span className='text-color'>{this.userInfo.pvTime || '---'}</span>
                </Item>
              </Col>
              <Col span={6}>
                <Item label='身份证号码'>
                  <span className='text-color'>{idCard || '---'}</span>
                </Item>
              </Col>
            </Row>
          </Row>
          <Divider/>
        </Form>
        <Row className='PieceworkIncomeEdit-title-icon-bottom'>
          <Icon component={IconPer9}/>
          <span className='PieceworkIncomeEdit-title-text'> 员工计件收入明细</span>
        </Row>
        { formText }
        <Row className = 'table-row-bottom'>
          <Table rowKey='address3' columns={columns5} dataSource={[pieceworkIncomeInfo]} pagination = {false} bordered = {true} title = { () => { return <span className='PieceworkIncomeEdit-table-title-span'>计件项目总明细</span> } }></Table>
        </Row>
        <Button onClick = {this.cancel} className="contract-page-button" type="primary">返回</Button>
      </div>
    )
  }
}
export default Form.create()(PieceworkIncomeInfo)
