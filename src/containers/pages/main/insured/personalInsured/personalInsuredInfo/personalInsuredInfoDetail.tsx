/*
 * @description: 参保管理模块 - 个人参保 - 个人参保信息 详情
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-04-10 15:46:24
 * @LastEditTime: 2019-07-30 10:17:12
 * @copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import RootComponent from '@components/root/RootComponent'
import SysUtil from '@utils/SysUtil'
import { hot } from 'react-hot-loader'
import { Card, Row, Col, Button } from 'antd'

import '../style/PersonalInsuredInfoDetail'

import { BaseProps, KeyValue } from 'typings/global'

interface BaseState {
  staffDetail: KeyValue
}

@hot(module)
export default class PersonalInsuredInfoDetail extends RootComponent<BaseProps, BaseState> {
  sessionStoragedStaffInfo: KeyValue = SysUtil.getSessionStorage('PersonalInsuredDetail') || {}

  constructor (props: BaseProps) {
    super(props)
    this.state = {
      staffDetail: {
        hrsInsuredDetailsInforResponses: []
      }
    }
  }

  componentDidMount () {
    this.getStaffDetail()
  }

  getStaffDetail () {
    const { userId } = this.sessionStoragedStaffInfo
    this.axios.request(this.api.personalInsuredInfoDetail, { userId })
      .then(({ data }) => {
        this.setState({
          staffDetail: data
        })
      })
      .catch(({ msg }) => {
        this.$message.error(msg[0])
      })
  }

  goBackInfoPage = () => {
    this.props.history.replace({ pathname: '/home/personalInsured', state: '2' })
  }

  render () {
    const {
      projectName, projectNumber, sjNumber, userName,
      idCard, passportCard, organize, entity, roleType,
      type, hourType, taxationType, startTime, endTime,
      entryTime, quitTime, icName, standardName,
      hrsInsuredDetailsInforResponses,
      company, persional, isBj
    } = this.state.staffDetail
    let personalBase: KeyValue = {}
    let personalPay: KeyValue = {}
    let companyPay: KeyValue = {}
    hrsInsuredDetailsInforResponses.forEach((item: KeyValue) => {
      const type = Number(item.type)
      if (type < 2) personalBase = item
      else if (type === 2) personalPay = item
      else companyPay = item
    })
    return (
      <div id="personal_insured_info_detail">
        <Card className="detail_content">
          <Row>
            <Col span={6}>
              <Row className="detail_item">
                <Col span={13}>项目：</Col>
                <Col span={11}>{projectName}</Col>
              </Row>
            </Col>
            <Col span={6}>
              <Row className="detail_item">
                <Col span={6}>工号：</Col>
                <Col span={18}>{projectNumber}</Col>
              </Row>
            </Col>
            <Col span={6}>
              <Row className="detail_item">
                <Col span={6}>管理编号：</Col>
                <Col span={18}>{sjNumber}</Col>
              </Row>
            </Col>
            <Col span={6}>
              <Row className="detail_item">
                <Col span={8}>姓名：</Col>
                <Col span={16}>{userName}</Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <Row className="detail_item">
                <Col span={13}>身份证号码/通行证/护照号：</Col>
                <Col span={11}>{idCard || passportCard || '- - - '}</Col>
              </Row>
            </Col>
            <Col span={6}>
              <Row className="detail_item">
                <Col span={6}>组织：</Col>
                <Col span={18}>{organize}</Col>
              </Row>
            </Col>
            <Col span={6}>
              <Row className="detail_item">
                <Col span={6}>法人主体：</Col>
                <Col span={18}>{entity}</Col>
              </Row>
            </Col>
            <Col span={6}>
              <Row className="detail_item">
                <Col span={8}>员工类型：</Col>
                <Col span={16}>{roleType}</Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <Row className="detail_item">
                <Col span={13}>合同类型：</Col>
                <Col span={11}>{type}</Col>
              </Row>
            </Col>
            <Col span={6}>
              <Row className="detail_item">
                <Col span={6}>工时类型：</Col>
                <Col span={18}>{hourType}</Col>
              </Row>
            </Col>
            <Col span={6}>
              <Row className="detail_item">
                <Col span={6}>计税类型：</Col>
                <Col span={18}>{taxationType}</Col>
              </Row>
            </Col>
            <Col span={6}>
              <Row className="detail_item">
                <Col span={8}>合同有效时间：</Col>
                <Col span={16}>{startTime} 至 {endTime}</Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <Row className="detail_item">
                <Col span={13}>入职日期：</Col>
                <Col span={11}>{entryTime}</Col>
              </Row>
            </Col>
            <Col span={6}>
              <Row className="detail_item">
                <Col span={6}>离职日期：</Col>
                <Col span={18}>{quitTime || '- - - '}</Col>
              </Row>
            </Col>
            <Col span={6}>
              <Row className={`detail_item ${icName ? null : 'todo'}`}>
                <Col span={6}>参保城市：</Col>
                <Col span={18}>{icName || '待维护'}</Col>
              </Row>
            </Col>
            <Col span={6}>
              <Row className={`detail_item ${standardName ? null : 'todo'}`}>
                <Col span={8}>参保标准：</Col>
                <Col span={16}>{standardName || '待维护'}</Col>
              </Row>
            </Col>
          </Row>
        </Card>
        <Row className="detail_title">参保信息{isBj < 2 && <span>(北京农村户口的员工不缴纳失业险！)</span>}</Row>
        <Card className="table_content">
          <Row className="table_header" type="flex" justify="space-around">
            <Col span={2}>
              {/*  */}
            </Col>
            <Col span={2}>
              养老险
            </Col>
            <Col span={2}>
              医疗险
            </Col>
            <Col span={2}>
              失业险
            </Col>
            <Col span={2}>
              工伤险
            </Col>
            <Col span={2}>
              生育险
            </Col>
            <Col span={2}>
              大病医疗险
            </Col>
            <Col span={2}>
              补充医疗险
            </Col>
            <Col span={2}>
              残保金
            </Col>
            <Col span={2}>
              公积金
            </Col>
            <Col span={2}>
              补充公积金
            </Col>
            <Col span={2}>
              服务费
            </Col>
          </Row>
          <Row className="table_row" type="flex" justify="space-around">
            <Col span={2} className="table_title">
              个人基数
            </Col>
            <Col span={2}>
              {personalBase.pension}
            </Col>
            <Col span={2}>
              {personalBase.medical}
            </Col>
            <Col span={2}>
              {personalBase.unemployment}
            </Col>
            <Col span={2}>
              {personalBase.workhurt}
            </Col>
            <Col span={2}>
              {personalBase.fertility || '- - - '}
            </Col>
            <Col span={2}>
              {personalBase.seriousillnessMedical || '- - - '}
            </Col>
            <Col span={2}>
              {personalBase.supplementMedical || '- - - '}
            </Col>
            <Col span={2}>
              {personalBase.residualPremium || '- - - '}
            </Col>
            <Col span={2}>
              {personalBase.providentfund}
            </Col>
            <Col span={2}>
              {personalBase.supplementHouse}
            </Col>
            <Col span={2}>
              {personalBase.serve || '- - -'}
            </Col>
          </Row>
          <Row className="table_row" type="flex" justify="space-around">
            <Col span={2} className="table_title">
              个人缴纳金额
            </Col>
            <Col span={2}>
              {personalPay.pension}
            </Col>
            <Col span={2}>
              {personalPay.medical}
            </Col>
            <Col span={2}>
              {personalPay.unemployment}
            </Col>
            <Col span={2}>
              {personalPay.workhurt}
            </Col>
            <Col span={2}>
              {personalPay.fertility || '- - - '}
            </Col>
            <Col span={2}>
              {personalPay.seriousillnessMedical || '- - - '}
            </Col>
            <Col span={2}>
              {personalPay.supplementMedical || '- - - '}
            </Col>
            <Col span={2}>
              {personalPay.residualPremium || '- - - '}
            </Col>
            <Col span={2}>
              {personalPay.providentfund}
            </Col>
            <Col span={2}>
              {personalPay.supplementHouse}
            </Col>
            <Col span={2}>
              {personalPay.serve || '- - - '}
            </Col>
          </Row>
          <Row className="table_row" type="flex" justify="space-around">
            <Col span={2} className="table_title">
              公司缴纳金额
            </Col>
            <Col span={2}>
              {companyPay.pension}
            </Col>
            <Col span={2}>
              {companyPay.medical}
            </Col>
            <Col span={2}>
              {companyPay.unemployment}
            </Col>
            <Col span={2}>
              {companyPay.workhurt}
            </Col>
            <Col span={2}>
              {companyPay.fertility || '- - - '}
            </Col>
            <Col span={2}>
              {companyPay.seriousillnessMedical || '- - - '}
            </Col>
            <Col span={2}>
              {companyPay.supplementMedical || '- - - '}
            </Col>
            <Col span={2}>
              {companyPay.residualPremium || '- - - '}
            </Col>
            <Col span={2}>
              {companyPay.providentfund || '- - - '}
            </Col>
            <Col span={2}>
              {companyPay.supplementHouse || '- - - '}
            </Col>
            <Col span={2}>
              {companyPay.serve || '- - - '}
            </Col>
          </Row>
        </Card>
        <Row className="detail_total">
          <b>小计</b> 公司：<span className="company">￥{company}</span> 个人：<span>￥{persional}</span>
        </Row>
        <Button type="primary" className="detail_back_button" size="large" onClick={this.goBackInfoPage}>返回</Button>
      </div>
    )
  }
}
