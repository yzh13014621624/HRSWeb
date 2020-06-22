/*
 * @description: 查看-薪资凭证维护
 * @author: wanglu
 * @lastEditors: wanglu
 * @Date: 2019-09-24 17:01:46
 * @LastEditTime: 2020-05-29 09:27:51
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from '@components/index'
import { Prompt } from 'react-router-dom'
import { Button, Form, Input, Col, Row } from 'antd'
import per1 from '@assets/images/share/entry/per1.png'
import per7 from '@assets/images/share/entry/per7.png'
import '@pages/main/basics/salary/details/SalaryDetails.styl'
import './index.styl'
import { HttpUtil, FormatInputValue, SysUtil } from '@utils/index'
import { BaseProps, KeyValue } from 'typings/global'
import { FormComponentProps } from 'antd/lib/form'

const { Item } = Form

interface FormProps extends BaseProps, FormComponentProps {
  userId: number
}

interface FormState {
  salaryInfo: any,
  params: any,
  salaryEditedDataInfo: KeyValue
}

class SalaryAdd extends RootComponent<FormProps, FormState> {
  timerId: any = null
  constructor (props: any) {
    super(props)
    this.state = {
      salaryInfo: {}, // 在职/离职人员详情列表
      params: {},
      salaryEditedDataInfo: this.getLocaleStoragedSalaryInfo('SalaryAdd')
    }
  }

  componentDidMount () {
    this.getSalarytUserInfo()
    this.inputOnChange(1)
  }

  getSalarytUserInfo = () => {
    const { userId, month } = HttpUtil.parseUrl(this.props.location.search)
    this.axios.request(this.api.SalaryGetUserInfo, { userId, month }).then(({ data }) => {
      this.setState({ salaryInfo: data })
    })
  }

  componentWillUnmount = () => {
    clearTimeout(this.timerId)
  }

  handleSubmit = () => {
    const { accommodateEdeduct, adminEdeduct, afterEdeduct, afterReissue, attendDeduct,
      beforeEdeduct, beforeReissue, communicateSubsidy, computerSubsidy, fuelSubsidy,
      fullBonus, heatSubsidy, maternityAdjust, newYearRetention, otherBonus, otherBonusFirst,
      otherCommission, otherEdeduct, otherSubsidy, performWages, quitCompensate, recommendBonus, recruitCommission,
      refrigerateSubsidy, salesCommission, sickAdjust, singleBonus, thirteenSalary, transportCommission, senioritySubsidy,
      yearEndBonus, attendanceBonus } = this.props.form.getFieldsValue()
    const { userId, month } = HttpUtil.parseUrl(this.props.location.search)
    const params = {
      userId: Number(userId),
      month: month,
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
    this.axios.request(this.api.SalaryinsertInfo, params).then(() => {
      this.$message.success('新增成功', 2)
      this.clearLocaleStoragedSalaryInfo('SalaryAdd')
      SysUtil.clearSession('SalaryAdd')
      this.cancel()
    })
  }

  // 监听表单
  inputOnChange = (e: any) => {
    setTimeout(() => {
      const fieldsValue = this.props.form.getFieldsValue()
      if ((typeof e) !== 'number') this.setLocaleStoragedSalaryInfo('SalaryAdd', fieldsValue)
    }, 0)
  }

  // 根据 userId 设置 localeStorage 中指定的信息
  setLocaleStoragedSalaryInfo (name: string, info: any) {
    const { userId } = this.props
    let salaryInfo = SysUtil.getLocalStorage(name)
    if (!salaryInfo) salaryInfo = {}
    salaryInfo[userId] = info
    SysUtil.setLocalStorage(name, salaryInfo)
  }

  // 根据 userId 读取 localeStorage 中指定的信息
  getLocaleStoragedSalaryInfo (name: string) {
    const { userId } = this.props
    const salaryInfo = SysUtil.getLocalStorage(name)
    const tempStaffInfo = {
      accommodateEdeduct: undefined,
      adminEdeduct: undefined,
      afterEdeduct: undefined,
      afterReissue: undefined,
      attendDeduct: undefined,
      beforeEdeduct: undefined,
      beforeReissue: undefined,
      communicateSubsidy: undefined,
      computerSubsidy: undefined,
      fuelSubsidy: undefined,
      attendanceBonus: undefined,
      fullBonus: undefined,
      heatSubsidy: undefined,
      maternityAdjust: undefined,
      newYearRetention: undefined,
      otherBonus: undefined,
      otherBonusFirst: undefined,
      otherCommission: undefined,
      otherEdeduct: undefined,
      otherSubsidy: undefined,
      quitCompensate: undefined,
      recommendBonus: undefined,
      recruitCommission: undefined,
      salesCommission: undefined,
      refrigerateSubsidy: undefined,
      sickAdjust: undefined,
      singleBonus: undefined,
      senioritySubsidy: undefined,
      thirteenSalary: undefined,
      transportCommission: undefined,
      yearEndBonus: undefined,
      performWages: undefined
    }
    return (salaryInfo && salaryInfo[userId]) || tempStaffInfo
  }
  // 根据 useId 移除 localeStorage 中指定的信息
  clearLocaleStoragedSalaryInfo (name: string) {
    const { userId } = this.props
    let salaryInfo = SysUtil.getLocalStorage(name)
    if (!salaryInfo) salaryInfo = {}
    delete salaryInfo[userId]
    if (!Object.keys(salaryInfo).length) SysUtil.clearLocalStorage(name)
    else SysUtil.setLocalStorage(name, salaryInfo)
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
      state: {
        salaryInfo,
        salaryEditedDataInfo: {
          accommodateEdeduct, adminEdeduct, afterEdeduct, afterReissue, attendDeduct, beforeEdeduct,
          beforeReissue, communicateSubsidy, computerSubsidy, fuelSubsidy, attendanceBonus, fullBonus,
          heatSubsidy, maternityAdjust, newYearRetention, otherBonus, otherBonusFirst, otherCommission,
          otherEdeduct, otherSubsidy, quitCompensate, recommendBonus, recruitCommission, salesCommission,
          refrigerateSubsidy, sickAdjust, singleBonus, senioritySubsidy, thirteenSalary, transportCommission,
          yearEndBonus, performWages
        }
      },
      props: { form: { getFieldDecorator }, userId }
    } = this
    const { entity, entryTime, idCard, month, organize, position, projectName, projectNumber,
      quitTime, roleType, salaryType, sjNumber, typeName, userName, workCondition, rankValue,
      sequenceValue, officialRankValue
    } = salaryInfo
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
                    initialValue: 1,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(<Input allowClear onChange = {this.inputOnChange}/>)}
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
                  })(<Input allowClear onChange = {this.inputOnChange}/>)}
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
                  })(<Input allowClear onChange = {this.inputOnChange}/>)}
                </Item>
              </Col>
            </Row>
          </Form>
          <Row className="salary-add-label-title">
            <Col><span>提成项</span></Col>
          </Row>
          <Form layout="inline">
            <Row style={{ display: 'flex', background: '#F2F6FC' }}>
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
                  })(<Input allowClear onChange = {this.inputOnChange}/>)}
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
                  })(<Input allowClear onChange = {this.inputOnChange}/>)}
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
                  })(<Input allowClear onChange = {this.inputOnChange}/>)}
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
                  })(<Input allowClear onChange = {this.inputOnChange}/>)}
                </Item>
              </Col>
            </Row>
          </Form>
          <Row className="salary-add-label-title">
            <Col><span>津补贴项目</span></Col>
          </Row>
          <Form layout="inline">
            <Row style={{ display: 'flex', background: '#F2F6FC' }}>
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
                  })(<Input allowClear onChange = {this.inputOnChange}/>)}
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
                  })(<Input allowClear onChange = {this.inputOnChange}/>)}
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
                  })(<Input allowClear onChange = {this.inputOnChange}/>)}
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
                  })(<Input allowClear onChange = {this.inputOnChange}/>)}
                </Item>
              </Col>
            </Row>
            <Row style={{ display: 'flex', background: '#F2F6FC' }}>
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
                  })(<Input allowClear onChange = {this.inputOnChange}/>)}
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
                  })(<Input allowClear onChange = {this.inputOnChange}/>)}
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
                  })(<Input allowClear onChange = {this.inputOnChange}/>)}
                </Item>
              </Col>
            </Row>
          </Form>
          <Row className="salary-add-label-title">
            <Col><span>奖金</span></Col>
          </Row>
          <Form layout="inline">
            <Row style={{ display: 'flex', background: '#F2F6FC' }}>
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
                  })(<Input allowClear onChange = {this.inputOnChange}/>)}
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
                  })(<Input allowClear onChange = {this.inputOnChange}/>)}
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
                  })(<Input allowClear onChange = {this.inputOnChange}/>)}
                </Item>
              </Col>
              <Col span={6}>
                <Item label="出勤奖金:"
                  className="form_item_salary"
                  labelCol={{ span: 10 }}
                  wrapperCol ={{ span: 14 }}>
                  {getFieldDecorator('attendanceBonus', {
                    initialValue: attendanceBonus,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(<Input allowClear onChange = {this.inputOnChange}/>)}
                </Item>
              </Col>
            </Row>
            <Row style={{ display: 'flex', background: '#F2F6FC' }}>
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
                  })(<Input allowClear onChange = {this.inputOnChange}/>)}
                </Item>
              </Col>
            </Row>
          </Form>
          <Row className="salary-add-label-title">
            <Col><span>罚款扣款</span></Col>
          </Row>
          <Form layout="inline">
            <Row style={{ display: 'flex', background: '#F2F6FC' }}>
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
                  })(<Input allowClear onChange = {this.inputOnChange}/>)}
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
                  })(<Input allowClear onChange = {this.inputOnChange}/>)}
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
                  })(<Input allowClear onChange = {this.inputOnChange}/>)}
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
                  })(<Input allowClear onChange = {this.inputOnChange}/>)}
                </Item>
              </Col>
            </Row>
          </Form>
          <Row className="salary-add-label-title">
            <Col><span>补发</span></Col>
          </Row>
          <Form layout="inline">
            <Row style={{ display: 'flex', background: '#F2F6FC' }}>
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
                  })(<Input allowClear onChange = {this.inputOnChange}/>)}
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
                  })(<Input allowClear onChange = {this.inputOnChange}/>)}
                </Item>
              </Col>
            </Row>
          </Form>
          <Row className="salary-add-label-title">
            <Col><span>补扣</span></Col>
          </Row>
          <Form layout="inline">
            <Row style={{ display: 'flex', background: '#F2F6FC' }}>
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
                  })(<Input allowClear onChange = {this.inputOnChange}/>)}
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
                  })(<Input allowClear onChange = {this.inputOnChange}/>)}
                </Item>
              </Col>
            </Row>
          </Form>
          <Row className="salary-add-label-title">
            <Col><span>离职补偿金</span></Col>
          </Row>
          <Form layout="inline">
            <Row style={{ display: 'flex', background: '#F2F6FC' }}>
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
                  })(<Input allowClear onChange = {this.inputOnChange}/>)}
                </Item>
              </Col>
            </Row>
          </Form>
          <Row className="salary-add-label-title">
            <Col><span>年终奖</span></Col>
          </Row>
          <Form layout="inline">
            <Row style={{ display: 'flex', background: '#F2F6FC' }}>
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
                  })(<Input allowClear onChange = {this.inputOnChange}/>)}
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
                  })(<Input allowClear onChange = {this.inputOnChange}/>)}
                </Item>
              </Col>
              <Col span={6}>
                <Item label="春节留人方案："
                  className="form_item_salary"
                  labelCol={{ span: 8 }}
                  wrapperCol ={{ span: 16 }}>
                  {getFieldDecorator('newYearRetention', {
                    initialValue: newYearRetention,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(<Input allowClear onChange = {this.inputOnChange}/>)}
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
                  })(<Input allowClear onChange = {this.inputOnChange}/>)}
                </Item>
              </Col>
            </Row>
          </Form>
        </div>
        <div style={{ padding: '0 0 10px 40px' }}>
          <Button type="primary" className="ant_button_confirm" onClick={ () => this.preventMoreClick(this.handleSubmit)}>确定</Button>
          <Button className="ant_button_cancel" onClick={this.cancel}>取消</Button>
        </div>
        <Prompt when message={`SalaryAdd-${userId}`} />
      </div>
    )
  }
}
export default Form.create<FormProps>()(SalaryAdd)
