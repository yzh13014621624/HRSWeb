/*
 * @description 薪酬核算-税后详情页面-样式
 * @author: maqian
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: maqian
 * @Date: 2019-09-21 14:00:56
 * @LastEditTime: 2019-10-17 19:25:29
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { hot } from 'react-hot-loader'
import { BaseProps } from 'typings/global'
import { RootComponent, BasicDowload } from '@components/index'
import { Button, Form, Row, Col, Icon } from 'antd'

import '../style/AfterTaxDetail.styl'
import SysUtil from '@utils/SysUtil'
import TemplateModal from '../../components/TemplateModal'
import nodate from '@assets/images/svg/share/insured/nodate.svg'
import InsureExcel from '@assets/images/svg/share/insured/insuredExcel.svg'

interface AfterTaxDetailProps extends BaseProps {}
interface AfterTaxDetailStatus {
  afterTaxData:any
  saId:any
  templateModalVisible:boolean
  templateTree:any
  type: any
}

@hot(module)
export default class AfterTaxDetail extends RootComponent<AfterTaxDetailProps, AfterTaxDetailStatus> {
  constructor (props:any) {
    super(props)
    const { match } = props
    let saId = +match.params.id
    this.state = {
      saId,
      afterTaxData: {},
      templateModalVisible: false, // 控制模板模态显示/隐藏
      templateTree: null,
      type: null
    }
  }
  componentDidMount () {
    const { saId } = this.state
    this.axios.request(this.api.AfterTaxDetail, { saId }).then(({ data }) => {
      this.setState({
        afterTaxData: data
      })
    }).catch((err:any) => {
      this.error(err.msg[0])
    })
  }

  onReturnPage = () => { // 返回上一页面
    let date = SysUtil.getSessionStorage('afterTaxDate')
    if (date) {
      this.props.history.push(`/home/salaryAccountPage?key=3&after=${date}`)
    } else {
      this.props.history.push(`/home/salaryAccountPage?key=3`)
    }
  }

  onTemplateChange = (templateModalVisible:boolean) => {
    this.setState({
      templateModalVisible
    })
  }

  onClickChange = (num:number) => { // 点击下载按钮显示弹框
    // 获取弹框模板数据
    this.axios.request(this.api.getSalaryTemplate).then(({ data }) => {
      if (num === 1) {
        this.setState({
          type: 0
        })
      } else {
        this.setState({
          type: 1
        })
      }
      this.setState({
        templateTree: data,
        templateModalVisible: true
      })
    }).catch((err:any) => {
      this.error(err.msg[0])
    })
  }

  render () {
    const { afterTaxData, templateModalVisible, templateTree, type } = this.state
    const { month, projectName, status, accountingDate, historyDate } = afterTaxData
    return (
      <div id='after-tax-detail'>
        <Row className='after-tax-frist-row'>
          <Col span={8}>
            <span>项目：</span>
            <span>{ projectName || '- - -' }</span>
          </Col>
          <Col span={8}>
            <span>月度：</span>
            <span>{ month || '- - -' }</span>
          </Col>
          <Col span={8}>
            <span>状态：</span>
            <span>{ status || '- - -' }</span>
          </Col>
        </Row>
        <Row className='after-tax-two-row'>
          <Col span={5} offset={4} className='row-col-one row-col-margin'>
            <p className='font-tip-one'>最近一次税后核算结果</p>
            {
              historyDate
                ? <div>
                  <img src={InsureExcel} alt=""/>
                  <p className="name-tips">{projectName + '-税后核算结果-' + month || '- - -'}</p>
                  <Button onClick={() => this.onClickChange(1)} type='primary' className='btn-style'>下载</Button>
                </div>
                : <div>
                  <img src={nodate} style={{ marginBottom: '0.08rem' }} alt=""/>
                  <p className="nodatas">暂无记录</p>
                </div>
            }
          </Col>
          <Col span={5} offset={5} className='row-col-one'>
            <p className='font-tip-one'>税后核算表</p>
            {
              accountingDate
                ? <div>
                  <img src={InsureExcel} alt=""/>
                  <p className="name-tips">{projectName + '-薪酬核算（税后薪资）-' + month || '- - -'}</p>
                  <Button onClick={() => this.onClickChange(2)} type='primary' className='btn-style'>下载</Button>
                </div>
                : <div>
                  <img src={nodate} style={{ marginBottom: '0.08rem' }} alt=""/>
                  <p className="nodatas">暂无记录</p>
                </div>
            }
          </Col>
        </Row>
        <Button type='primary' onClick={this.onReturnPage} className='return-btn'>返回</Button>
        <TemplateModal type={type} list={false} api={this.api.AfterTaxLoadDetail} data={month} templateTree={templateTree} templateModalVisible={templateModalVisible} onTemplateChange={this.onTemplateChange} />
      </div>
    )
  }
}
