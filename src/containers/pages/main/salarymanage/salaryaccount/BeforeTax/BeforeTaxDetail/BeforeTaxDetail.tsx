/*
 * @description: 薪酬核算-税前详情页面
 * @author: maqian
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: maqian
 * @Date: 2019-09-20 17:16:10
 * @LastEditTime: 2019-10-18 09:39:18
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { hot } from 'react-hot-loader'
import { FormComponentProps } from 'antd/lib/form'
import { RootComponent, BasicDowload } from '@components/index'
import { Button, Form, Row, Col, Icon } from 'antd'

import SysUtil from '@utils/SysUtil'
import '../style/BeforeTaxDetail.styl'
import nodate from '@assets/images/svg/share/insured/nodate.svg'
import InsureExcel from '@assets/images/svg/share/insured/insuredExcel.svg'

export default class BeforeTaxDetail extends RootComponent<any, any> {
  constructor (props:any) {
    super(props)
    const { match } = props
    let saId = +match.params.id
    this.state = {
      saId,
      beforeTaxData: {}
    }
  }

  componentDidMount () {
    const { saId } = this.state
    this.axios.request(this.api.BeforeTaxDetail, { saId }, true).then(({ data }) => {
      this.setState({
        beforeTaxData: data
      })
    }).catch((err:any) => {
      this.error(err.msg[0])
    })
  }

  onReturnPage = () => { // 返回上一页面
    let date = SysUtil.getSessionStorage('beforeTaxDate')
    if (date) {
      this.props.history.push(`/home/salaryAccountPage?key=1&before=${date}`)
    } else {
      this.props.history.push(`/home/salaryAccountPage?key=1`)
    }
  }

  render () {
    const { beforeTaxData, saId } = this.state
    const { projectName, monthly, statusMeaning, pDocumentsClose, pDocumentsNewTime, sDocumentsClose, sDocumentsNewTime } = beforeTaxData
    return (
      <div id='before-tax-detail'>
        <Row className='before-tax-frist-row'>
          <Col span={8}>
            <span>项目：</span>
            <span>{ projectName || '- - -' }</span>
          </Col>
          <Col span={8}>
            <span>月度：</span>
            <span>{ monthly || '- - -' }</span>
          </Col>
          <Col span={8}>
            <span>状态：</span>
            <span>{ statusMeaning || '- - -' }</span>
          </Col>
        </Row>
        <Row className='before-tax-two-row'>
          <Col span={5} className='row-col-one row-col-margin mr10'>
            <p className='font-tip-one'>最近一次核算的个税申报-人员信息表</p>
            {
              pDocumentsNewTime
                ? <div>
                  <img src={InsureExcel} alt=""/>
                  <p className="name-tips">{pDocumentsNewTime.fileName}</p>
                  <BasicDowload action={this.api.BeforeTaxInsuredLoad}
                    parmsData={{
                      saId,
                      type: 1
                    }}
                    fileName={pDocumentsNewTime.fileName}
                    type="default"
                    dowloadURL="URL"
                    className="btn-style"
                  >
                    <span>下载</span>
                  </BasicDowload>
                </div>
                : <div>
                  <img src={nodate} style={{ marginBottom: '0.08rem' }} alt=""/>
                  <p className="nodatas">暂无记录</p>
                </div>
            }
          </Col>
          <Col span={5} className='row-col-one'>
            <p className='font-tip-one'>最近一次核算的个税申报-工资表</p>
            {
              sDocumentsNewTime
                ? <div>
                  <img src={InsureExcel} alt=""/>
                  <p className="name-tips">{sDocumentsNewTime.fileName}</p>
                  <BasicDowload action={this.api.BeforeTaxInsuredLoad}
                    parmsData={{
                      saId,
                      type: 2
                    }}
                    fileName={sDocumentsNewTime.fileName}
                    type="default"
                    dowloadURL="URL"
                    className="btn-style"
                  >
                    <span>下载</span>
                  </BasicDowload>
                </div>
                : <div>
                  <img src={nodate} style={{ marginBottom: '0.08rem' }} alt=""/>
                  <p className="nodatas">暂无记录</p>
                </div>
            }
          </Col>
          <Col span={5} offset={2} className='row-col-one row-col-margin'>
            <p className='font-tip-one'>关账的个税申报-人员信息表</p>
            {
              pDocumentsClose
                ? <div>
                  <img src={InsureExcel} alt=""/>
                  <p className="name-tips">{pDocumentsClose.fileName}</p>
                  <BasicDowload action={this.api.BeforeTaxInsuredLoad}
                    parmsData={{
                      saId,
                      type: 3
                    }}
                    fileName={pDocumentsClose.fileName}
                    type="default"
                    dowloadURL="URL"
                    className="btn-style"
                  >
                    <span>下载</span>
                  </BasicDowload>
                </div>
                : <div>
                  <img src={nodate} style={{ marginBottom: '0.08rem' }} alt=""/>
                  <p className="nodatas">暂无记录</p>
                </div>
            }
          </Col>
          <Col span={5} className='row-col-one'>
            <p className='font-tip-one'>关账的个税申报-工资表</p>
            {
              sDocumentsClose
                ? <div>
                  <img src={InsureExcel} alt=""/>
                  <p className="name-tips">{sDocumentsClose.fileName}</p>
                  <BasicDowload action={this.api.BeforeTaxInsuredLoad}
                    parmsData={{
                      saId,
                      type: 4
                    }}
                    fileName={sDocumentsClose.fileName}
                    type="default"
                    dowloadURL="URL"
                    className="btn-style"
                  >
                    <span>下载</span>
                  </BasicDowload>
                </div>
                : <div>
                  <img src={nodate} style={{ marginBottom: '0.08rem' }} alt=""/>
                  <p className="nodatas">暂无记录</p>
                </div>
            }
          </Col>
        </Row>
        <Button type='primary' onClick={this.onReturnPage} className='return-btn'>返回</Button>
      </div>
    )
  }
}
