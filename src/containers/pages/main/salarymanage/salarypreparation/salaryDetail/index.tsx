/*
 * @description: 查看-薪资凭证维护
 * @author: wanglu
 * @lastEditors: wanglu
 * @Date: 2019-09-24 17:01:46
 * @LastEditTime: 2020-05-29 09:27:21
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent } from '@components/index'
import { Prompt } from 'react-router-dom'
import { FormComponentProps } from 'antd/lib/form'
import { Button, Form, Input, Col, Row } from 'antd'
import per1 from '@assets/images/share/entry/per1.png'
import per7 from '@assets/images/share/entry/per7.png'
import '@pages/main/basics/salary/details/SalaryDetails.styl'
import './index.styl'
import { HttpUtil, FormatInputValue, SysUtil } from '@utils/index'
import { FormProps, KeyValue } from 'typings/global'

const { Item } = Form
const { toFixedAndKeepMinus } = FormatInputValue

interface State {
  salaryList: any,
  params: any,
}
const toFixed = (n: string) => {
  n = n || '0'
  return parseFloat(n).toFixed(2)
}

class SalaryDetail extends RootComponent<FormProps, State> {
  id: KeyValue = HttpUtil.parseUrl(this.props.location.search)
  constructor (props: any) {
    super(props)
    this.state = {
      salaryList: {}, // 详情列表
      params: {}
    }
  }
  componentDidMount () {
    this.getSalaryVoucherInfo()
  }
  getSalaryVoucherInfo = () => {
    const { id, id: { salaryVoucherId } } = this

    this.axios.request(this.api.SalaryVoucherInfo, { salaryVoucherId: salaryVoucherId }).then(({ data }) => {
      this.setState({
        salaryList: data
      })
    })
  }
  handleSubmit = () => {
    const { accommodateEdeduct, adminEdeduct, afterEdeduct, afterReissue, attendDeduct,
      beforeEdeduct, beforeReissue, communicateSubsidy, computerSubsidy, fuelSubsidy,
      fullBonus, heatSubsidy, maternityAdjust, newYearRetention, otherBonus, otherBonusFirst,
      otherCommission, otherEdeduct, otherSubsidy, performWages, quitCompensate, recommendBonus, recruitCommission,
      refrigerateSubsidy, salesCommission, sickAdjust, singleBonus, thirteenSalary, transportCommission, senioritySubsidy,
      yearEndBonus, attendanceBonus } = this.props.form.getFieldsValue()
    const index = window.location.href.indexOf('salaryVoucherId')
    const salaryVoucherId = window.location.href.substr(index).split('=')[1]
    const params = {
      salaryVoucherId: Number(salaryVoucherId),
      accommodateEdeduct,
      adminEdeduct,
      afterEdeduct,
      afterReissue,
      attendDeduct,
      beforeEdeduct,
      beforeReissue,
      communicateSubsidy,
      computerSubsidy,
      fuelSubsidy,
      attendanceBonus,
      fullBonus,
      heatSubsidy,
      maternityAdjust,
      newYearRetention,
      otherBonus,
      otherBonusFirst,
      otherCommission,
      otherEdeduct,
      otherSubsidy,
      quitCompensate,
      recommendBonus,
      recruitCommission,
      salesCommission,
      refrigerateSubsidy,
      sickAdjust,
      singleBonus,
      senioritySubsidy,
      thirteenSalary,
      transportCommission,
      yearEndBonus,
      performWages
    }
    this.axios.request(this.api.SalaryUpdateInfo, params)
      .then(() => {
        this.$message.success('保存成功', 2)
        this.props.history.push('/home/salaryprePage')
      })
  }

  cancel = () => {
    this.props.history.push('/home/salaryprePage')
  }
  transformInputValue = (value: string) => {
    return FormatInputValue.toFixed(value)
  }
  KeepMinusInputValue = (value: string) => {
    return FormatInputValue.toFixedAndKeepMinus(value)
  }
  render () {
    const {
      state: { salaryList },
      props: { form: { getFieldDecorator } }
    } = this
    const [, adde, addq, edit, det, del, dels, imp, exp, down] = this.AuthorityList.salarypreparation
    const { projectName, projectNumber, sjNumber, entity, organize, position, entryTime, quitTime,
      salaryType, month, workCondition, idCard, performWages, sickAdjust, maternityAdjust, recruitCommission,
      salesCommission, transportCommission, otherCommission, heatSubsidy, computerSubsidy, communicateSubsidy,
      refrigerateSubsidy, fuelSubsidy, otherSubsidy, singleBonus, recommendBonus, fullBonus, otherBonus, attendDeduct,
      adminEdeduct, accommodateEdeduct, otherEdeduct, beforeReissue, afterReissue, beforeEdeduct, afterEdeduct, quitCompensate,
      yearEndBonus, thirteenSalary, newYearRetention, otherBonusFirst, roleType, typeName, userName, senioritySubsidy, attendanceBonus,
      rankValue, sequenceValue, officialRankValue
    } = salaryList
    const isShangJia = projectName === '上嘉'
    return (
      <div id="salary-detail">
        <div style={{ padding: '33px 40px 0 40px' }}>
          <Row className="salary-add-label-title">
            <Col><img src={per1}/><span>员工信息</span></Col>
          </Row>
          <Form className="form-styl">
            <Row style={{ marginBottom: 22 }}>
              <Col span={6}>项目：{ projectName || '---' }</Col>
              <Col span={6}>工号：{ projectNumber || '---' }</Col>
              <Col span={6}>管理编号：{ sjNumber || '---' }</Col>
              <Col span={6}>法人主体：{ entity || '---' }</Col>
            </Row>
            <Row style={{ marginBottom: 22 }}>
              <Col span={6}>组织：{ organize || '---' }</Col>
              <Col span={6}>{isShangJia ? `职级：${rankValue || '---'}` : `职位：${position || '---'}`}</Col>
              <Col span={6}>{isShangJia ? `序列：${sequenceValue || '---'}` : `员工类型：${roleType || '---'}`}</Col>
              <Col span={6}>{isShangJia ? `职等：${officialRankValue || '---'}` : `合同类型：${typeName || '---'}`}</Col>
            </Row>
            <Row style={{ marginBottom: 22 }}>
              <Col span={6}>姓名：{ userName || '---'}</Col>
              <Col span={6}>计薪类型: { salaryType || '---' }</Col>
              <Col span={6}>月度: { month || '---' }</Col>
              <Col span={6}>身份证号码： { idCard || '---' }</Col>
            </Row>
            <Row style={{ marginBottom: 22 }}>
              <Col span={6}>在职状态: { workCondition || '---' }</Col>
              <Col span={6}>入职时间：{ entryTime || '---'}</Col>
              <Col span={6}>离职时间: { quitTime || '---'}</Col>
              {isShangJia && <Col span={6}>员工类型：{ roleType || '---' }</Col>}
            </Row>
            {
              isShangJia && <Row style={{ marginBottom: 22 }}>
                <Col span={6}>合同类型：{ typeName || '---' }</Col>
              </Row>
            }
          </Form>
        </div>
        <div style={{ padding: '31px 40px 30px 40px' }}>
          <Row className="salary-add-label-title" style={{ marginBottom: '10px' }}>
            <Col><img src={per7}/><span>薪资信息</span></Col>
          </Row>
          <Form layout="inline">
            <Row style={{ display: 'flex', background: '#F2F6FC', marginBottom: '20px' }}>
              <Col span={6}>
                <Item label="绩效工资系数："
                  className="form_item_salary"
                  labelCol={{ span: 10 }}
                  wrapperCol={{ span: 14 }}>
                  {getFieldDecorator('performWages', {
                    initialValue: performWages || '1',
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(<Input allowClear className='input-220' />)}
                </Item>
              </Col>
              <Col span={6}>
                <Item label="病假扣款手动调整:"
                  className="form_item_salary"
                  labelCol={{ span: 10 }}
                  wrapperCol ={{ span: 14 }}>
                  {getFieldDecorator('sickAdjust', {
                    initialValue: sickAdjust,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.KeepMinusInputValue(e.target.value)
                    }
                  })(<Input allowClear className='input-220' />)}
                </Item>
              </Col>
              <Col span={6}>
                <Item label="产假类扣款手动调整："
                  className="form_item_salary"
                  labelCol={{ span: 10 }}
                  wrapperCol ={{ span: 14 }}>
                  {getFieldDecorator('maternityAdjust', {
                    initialValue: maternityAdjust,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.KeepMinusInputValue(e.target.value)
                    }
                  })(<Input allowClear className='input-220' />)}
                </Item>
              </Col>
            </Row>
          </Form>
          <Row className="salary-add-label-title">
            <Col><span>提成项</span></Col>
          </Row>
          <Form layout="inline">
            <Row style={{ display: 'flex', background: '#F2F6FC', paddingLeft: '28px' }}>
              <Col span={6}>
                <Item label="招聘提成："
                  className="form_item_salary"
                  labelCol={{ span: 10 }}
                  wrapperCol ={{ span: 14 }}>
                  {getFieldDecorator('recruitCommission', {
                    initialValue: recruitCommission,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(<Input allowClear className='input-220' />)}
                </Item>
              </Col>
              <Col span={6}>
                <Item label="销售提成："
                  className="form_item_salary"
                  labelCol={{ span: 10 }}
                  wrapperCol ={{ span: 14 }}>
                  {getFieldDecorator('salesCommission', {
                    initialValue: salesCommission,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(<Input allowClear className='input-220' />)}
                </Item>
              </Col>
              <Col span={6}>
                <Item label="运输提成："
                  className="form_item_salary"
                  labelCol={{ span: 10 }}
                  wrapperCol ={{ span: 14 }}>
                  {getFieldDecorator('transportCommission', {
                    initialValue: transportCommission,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(<Input allowClear className='input-220' />)}
                </Item>
              </Col>
              <Col span={6}>
                <Item label="其他提成："
                  className="form_item_salary"
                  labelCol={{ span: 10 }}
                  wrapperCol ={{ span: 14 }}>
                  {getFieldDecorator('otherCommission', {
                    initialValue: otherCommission,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(<Input allowClear className='input-220' />)}
                </Item>
              </Col>
            </Row>
          </Form>
          <Row className="salary-add-label-title">
            <Col><span>津补贴项目</span></Col>
          </Row>
          <Form layout="inline">
            <Row style={{ display: 'flex', background: '#F2F6FC', paddingLeft: '28px' }}>
              <Col span={6}>
                <Item label="高温补贴："
                  className="form_item_salary"
                  labelCol={{ span: 10 }}
                  wrapperCol ={{ span: 14 }}>
                  {getFieldDecorator('heatSubsidy', {
                    initialValue: heatSubsidy,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(<Input allowClear className='input-220' />)}
                </Item>
              </Col>
              <Col span={6}>
                <Item label="电脑补贴："
                  className="form_item_salary"
                  labelCol={{ span: 10 }}
                  wrapperCol ={{ span: 14 }}>
                  {getFieldDecorator('computerSubsidy', {
                    initialValue: computerSubsidy,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(<Input allowClear className='input-220' />)}
                </Item>
              </Col>
              <Col span={6}>
                <Item label="通讯补贴："
                  className="form_item_salary"
                  labelCol={{ span: 10 }}
                  wrapperCol ={{ span: 14 }}>
                  {getFieldDecorator('communicateSubsidy', {
                    initialValue: communicateSubsidy,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(<Input allowClear className='input-220' />)}
                </Item>
              </Col>
              <Col span={6}>
                <Item label="冷藏/冷冻补贴："
                  className="form_item_salary"
                  labelCol={{ span: 10 }}
                  wrapperCol ={{ span: 14 }}>
                  {getFieldDecorator('refrigerateSubsidy', {
                    initialValue: refrigerateSubsidy,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(<Input allowClear className='input-220' />)}
                </Item>
              </Col>
            </Row>
            <Row style={{ display: 'flex', background: '#F2F6FC', paddingLeft: '28px' }}>
              <Col span={6}>
                <Item label="工龄补贴："
                  className="form_item_salary"
                  labelCol={{ span: 10 }}
                  wrapperCol ={{ span: 14 }}>
                  {getFieldDecorator('senioritySubsidy', {
                    initialValue: senioritySubsidy,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(<Input allowClear className='input-220' />)}
                </Item>
              </Col>
              <Col span={6}>
                <Item label="燃油补贴："
                  className="form_item_salary"
                  labelCol={{ span: 10 }}
                  wrapperCol ={{ span: 14 }}>
                  {getFieldDecorator('fuelSubsidy', {
                    initialValue: fuelSubsidy,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(<Input allowClear className='input-220' />)}
                </Item>
              </Col>
              <Col span={6}>
                <Item label="其他补贴："
                  className="form_item_salary"
                  labelCol={{ span: 10 }}
                  wrapperCol ={{ span: 14 }}>
                  {getFieldDecorator('otherSubsidy', {
                    initialValue: otherSubsidy,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(<Input allowClear className='input-220' />)}
                </Item>
              </Col>
            </Row>
          </Form>
          <Row className="salary-add-label-title">
            <Col><span>奖金</span></Col>
          </Row>
          <Form layout="inline">
            <Row style={{ display: 'flex', background: '#F2F6FC', paddingLeft: '28px' }}>
              <Col span={6}>
                <Item label="单项奖："
                  className="form_item_salary"
                  labelCol={{ span: 10 }}
                  wrapperCol ={{ span: 14 }}>
                  {getFieldDecorator('singleBonus', {
                    initialValue: singleBonus,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(<Input allowClear className='input-220' />)}
                </Item>
              </Col>
              <Col span={6}>
                <Item label="内推奖金："
                  className="form_item_salary"
                  labelCol={{ span: 10 }}
                  wrapperCol ={{ span: 14 }}>
                  {getFieldDecorator('recommendBonus', {
                    initialValue: recommendBonus,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(<Input allowClear className='input-220' />)}
                </Item>
              </Col>
              <Col span={6}>
                <Item label="全勤奖："
                  className="form_item_salary"
                  labelCol={{ span: 10 }}
                  wrapperCol ={{ span: 14 }}>
                  {getFieldDecorator('fullBonus', {
                    initialValue: fullBonus,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(<Input allowClear className='input-220' />)}
                </Item>
              </Col>
              <Col span={6}>
                <Item label="出勤奖金："
                  className="form_item_salary"
                  labelCol={{ span: 10 }}
                  wrapperCol ={{ span: 14 }}>
                  {getFieldDecorator('attendanceBonus', {
                    initialValue: attendanceBonus,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(<Input allowClear className='input-220' />)}
                </Item>
              </Col>
            </Row>
            <Row style={{ display: 'flex', background: '#F2F6FC', paddingLeft: '28px' }}>
              <Col span={6}>
                <Item label="其他奖金："
                  className="form_item_salary"
                  labelCol={{ span: 10 }}
                  wrapperCol ={{ span: 14 }}>
                  {getFieldDecorator('otherBonus', {
                    initialValue: otherBonus,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(<Input allowClear className='input-220' />)}
                </Item>
              </Col>
            </Row>
          </Form>
          <Row className="salary-add-label-title">
            <Col><span>罚款扣款</span></Col>
          </Row>
          <Form layout="inline">
            <Row style={{ display: 'flex', background: '#F2F6FC', paddingLeft: '28px' }}>
              <Col span={6}>
                <Item label="考勤扣款："
                  className="form_item_salary"
                  labelCol={{ span: 10 }}
                  wrapperCol ={{ span: 14 }}>
                  {getFieldDecorator('attendDeduct', {
                    initialValue: attendDeduct,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.KeepMinusInputValue(e.target.value)
                    }
                  })(<Input allowClear className='input-220' />)}
                </Item>
              </Col>
              <Col span={6}>
                <Item label="行政扣款："
                  className="form_item_salary"
                  labelCol={{ span: 10 }}
                  wrapperCol ={{ span: 14 }}>
                  {getFieldDecorator('adminEdeduct', {
                    initialValue: adminEdeduct,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.KeepMinusInputValue(e.target.value)
                    }
                  })(<Input allowClear className='input-220' />)}
                </Item>
              </Col>
              <Col span={6}>
                <Item label="住宿扣款："
                  className="form_item_salary"
                  labelCol={{ span: 10 }}
                  wrapperCol ={{ span: 14 }}>
                  {getFieldDecorator('accommodateEdeduct', {
                    initialValue: accommodateEdeduct,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.KeepMinusInputValue(e.target.value)
                    }
                  })(<Input allowClear className='input-220' />)}
                </Item>
              </Col>
              <Col span={6}>
                <Item label="其他扣款："
                  className="form_item_salary"
                  labelCol={{ span: 10 }}
                  wrapperCol ={{ span: 14 }}>
                  {getFieldDecorator('otherEdeduct', {
                    initialValue: otherEdeduct,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.KeepMinusInputValue(e.target.value)
                    }
                  })(<Input allowClear className='input-220' />)}
                </Item>
              </Col>
            </Row>
          </Form>
          <Row className="salary-add-label-title">
            <Col><span>补发</span></Col>
          </Row>
          <Form layout="inline">
            <Row style={{ display: 'flex', background: '#F2F6FC', paddingLeft: '28px' }}>
              <Col span={6}>
                <Item label="税前补发："
                  className="form_item_salary"
                  labelCol={{ span: 10 }}
                  wrapperCol ={{ span: 14 }}>
                  {getFieldDecorator('beforeReissue', {
                    initialValue: beforeReissue,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(<Input allowClear className='input-220' />)}
                </Item>
              </Col>
              <Col span={6}>
                <Item label="税后补发："
                  className="form_item_salary"
                  labelCol={{ span: 10 }}
                  wrapperCol ={{ span: 14 }}>
                  {getFieldDecorator('afterReissue', {
                    initialValue: afterReissue,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(<Input allowClear className='input-220' />)}
                </Item>
              </Col>
            </Row>
          </Form>
          <Row className="salary-add-label-title">
            <Col><span>补扣</span></Col>
          </Row>
          <Form layout="inline">
            <Row style={{ display: 'flex', background: '#F2F6FC', paddingLeft: '28px' }}>
              <Col span={6}>
                <Item label="税前补扣："
                  className="form_item_salary"
                  labelCol={{ span: 10 }}
                  wrapperCol ={{ span: 14 }}>
                  {getFieldDecorator('beforeEdeduct', {
                    initialValue: beforeEdeduct,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.KeepMinusInputValue(e.target.value)
                    }
                  })(<Input allowClear className='input-220' />)}
                </Item>
              </Col>
              <Col span={6}>
                <Item label="税后补扣："
                  className="form_item_salary"
                  labelCol={{ span: 10 }}
                  wrapperCol ={{ span: 14 }}>
                  {getFieldDecorator('afterEdeduct', {
                    initialValue: afterEdeduct,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.KeepMinusInputValue(e.target.value)
                    }
                  })(<Input allowClear className='input-220' />)}
                </Item>
              </Col>
            </Row>
          </Form>
          <Row className="salary-add-label-title">
            <Col><span>离职补偿金</span></Col>
          </Row>
          <Form layout="inline">
            <Row style={{ display: 'flex', background: '#F2F6FC', paddingLeft: '28px' }}>
              <Col span={6}>
                <Item label="离职补偿金："
                  className="form_item_salary"
                  labelCol={{ span: 10 }}
                  wrapperCol ={{ span: 14 }}>
                  {getFieldDecorator('quitCompensate', {
                    initialValue: quitCompensate,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.KeepMinusInputValue(e.target.value)
                    }
                  })(<Input allowClear className='input-220' />)}
                </Item>
              </Col>
            </Row>
          </Form>
          <Row className="salary-add-label-title">
            <Col><span>年终奖</span></Col>
          </Row>
          <Form layout="inline">
            <Row style={{ display: 'flex', background: '#F2F6FC', paddingLeft: '28px' }}>
              <Col span={6}>
                <Item label="年终奖："
                  className="form_item_salary"
                  labelCol={{ span: 10 }}
                  wrapperCol ={{ span: 14 }}>
                  {getFieldDecorator('yearEndBonus', {
                    initialValue: yearEndBonus,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(<Input allowClear className='input-220' />)}
                </Item>
              </Col>
              <Col span={6}>
                <Item label="13薪："
                  className="form_item_salary"
                  labelCol={{ span: 10 }}
                  wrapperCol ={{ span: 14 }}>
                  {getFieldDecorator('thirteenSalary', {
                    initialValue: thirteenSalary,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(<Input allowClear className='input-220' />)}
                </Item>
              </Col>
              <Col span={6}>
                <Item label="春节留人方案："
                  className="form_item_salary"
                  labelCol={{ span: 10 }}
                  wrapperCol ={{ span: 14 }}>
                  {getFieldDecorator('newYearRetention', {
                    initialValue: newYearRetention,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(<Input allowClear className='input-220' />)}
                </Item>
              </Col>
              <Col span={6}>
                <Item label="其他奖金1："
                  className="form_item_salary"
                  labelCol={{ span: 10 }}
                  wrapperCol ={{ span: 14 }}>
                  {getFieldDecorator('otherBonusFirst', {
                    initialValue: otherBonusFirst,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(<Input allowClear className='input-220' />)}
                </Item>
              </Col>
            </Row>
          </Form>
        </div>
        <div style={{ padding: '0 0 10px 40px' }}>
          {this.isAuthenticated(edit) && <Button type="primary" className="ant_button_confirm" onClick={ () => this.preventMoreClick(this.handleSubmit)}>保存</Button>}
          <Button className="ant_button_cancel" onClick={this.cancel}>{this.isAuthenticated(edit) ? '取消' : '返回'}</Button>
        </div>
      </div>
    )
  }
}
export default Form.create<FormProps>()(SalaryDetail)
