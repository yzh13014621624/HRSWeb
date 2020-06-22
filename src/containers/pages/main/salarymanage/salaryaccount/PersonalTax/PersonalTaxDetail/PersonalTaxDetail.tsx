/*
 * @description: 薪酬核算-个税详情页面
 * @author: maqian
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: maqian
 * @Date: 2019-09-20 17:16:10
 * @LastEditTime: 2019-10-09 17:40:56
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { hot } from 'react-hot-loader'
import { FormComponentProps } from 'antd/lib/form'
import { RootComponent, BasicDowload } from '@components/index'
import { Button, Form, Row, Col, Icon } from 'antd'

import SysUtil from '@utils/SysUtil'
import '../style/PersonalTaxDetail.styl'
import nodate from '@assets/images/svg/share/insured/nodate.svg'
import InsureExcel from '@assets/images/svg/share/insured/insuredExcel.svg'

@hot(module)
export default class PersonalTaxDetail extends RootComponent<any, any> {
  constructor (props:any) {
    super(props)
    const { match } = props
    let saId = +match.params.id
    this.state = {
      saId,
      personalTaxData: {}
    }
  }

  componentDidMount () {
    const { saId } = this.state
    this.axios.request(this.api.PersonalTaxDetail, {
      saId
    }).then(({ data }) => {
      this.setState({
        personalTaxData: data
      })
    }).catch((err:any) => {
      this.error(err.msg[0])
    })
  }

  onReturnPage = () => { // 返回上一页面
    let date = SysUtil.getSessionStorage('personalTaxDate')
    if (date) {
      this.props.history.push(`/home/salaryAccountPage?key=2&personal=${date}`)
    } else {
      this.props.history.push(`/home/salaryAccountPage?key=2`)
    }
  }

  render () {
    const { personalTaxData, saId } = this.state
    const { projectName, monthlyTime, status, createTime } = personalTaxData
    return (
      <div id='personal-tax-detail'>
        <Row className='personal-tax-frist-row'>
          <Col span={8}>
            <span>项目：</span>
            <span>{ projectName || '- - -' }</span>
          </Col>
          <Col span={8}>
            <span>月度：</span>
            <span>{ monthlyTime || '- - -' }</span>
          </Col>
          <Col span={8}>
            <span>状态：</span>
            <span>{ (status === 0 ? '未关帐' : '已关帐') || '- - -' }</span>
          </Col>
        </Row>
        <Row className='personal-tax-two-row'>
          <Col span={5} offset={4} className='row-col-one row-col-margin'>
            <p className='font-tip-one'>最近一次个税核算结果</p>
            {
              createTime
                ? <div>
                  <img src={InsureExcel} alt=""/>
                  <p className="name-tips">{projectName + '-' + '个税核算结果-' + monthlyTime.replace('.', '-') || '- - -'}</p>
                  <BasicDowload action={this.api.PersonalExport}
                    parmsData={{
                      saId,
                      difference: 0
                    }}
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
          <Col span={5} offset={5} className='row-col-one'>
            <p className='font-tip-one'>个税核算表</p>
            {
              status === 1
                ? <div>
                  <img src={InsureExcel} alt=""/>
                  <p className="name-tips">{projectName + '-' + '薪酬核算（个税）-' + monthlyTime.replace('.', '-') || '- - -'}</p>
                  <BasicDowload action={this.api.PersonalExport}
                    parmsData={{
                      saId,
                      difference: 1
                    }}
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
