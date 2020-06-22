/*
 * @description: 参保管理模块 - 个人参保 - 个人补缴信息 详情/编辑
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-04-10 15:54:15
 * @LastEditTime: 2020-05-28 12:06:24
 * @copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import RootComponent from '@components/root/RootComponent'
import BaseModal from '@components/modal/BasicModal'
import { SysUtil, FormatInputValue } from '@utils/index'
import { hot } from 'react-hot-loader'
import { Card, Row, Col, Button, Form, Select, Input, Divider } from 'antd'

import '../style/PersonalSupplementAdd'
import '../style/PersonalSupplementDetail'

import { BaseProps, KeyValue } from 'typings/global'
import { FormComponentProps } from 'antd/lib/form'

interface BaseSupplementFormProps extends BaseProps, FormComponentProps {
  isCloseAccount: boolean
}

interface BaseSupplementFormState {
  disabled: boolean
  staffBaseInfo: KeyValue
  selectData: KeyValue
  yearList: KeyValue[]
  monthList: KeyValue[]
  reasonList: KeyValue[]
  supplementInfo: { company: KeyValue, personal: KeyValue }
  supplementReason: string
  isCloseAccount: boolean
  otherReasons: boolean
}

const toFixed = (n: string) => {
  n = n || '0'
  return parseFloat(n).toFixed(3)
}

class SupplementForm extends RootComponent<BaseSupplementFormProps, BaseSupplementFormState> {
  modal: React.RefObject<BaseModal> = React.createRef()
  staffBaseInfo: KeyValue = SysUtil.getSessionStorage('PersonalSupplementAdd')
  timerId: any = null

  constructor (props: BaseSupplementFormProps) {
    super(props)
    this.state = {
      otherReasons: false,
      disabled: true,
      staffBaseInfo: {},
      selectData: {}, // 补缴年月筛选条件
      supplementInfo: { // 补缴表单信息
        company: {},
        personal: {}
      },
      yearList: [],
      monthList: [],
      reasonList: [],
      supplementReason: '',
      isCloseAccount: false
    }
  }

  componentDidMount () {
    this.getSupplementEditDetail()
  }

  // 获取编辑补缴详情
  getSupplementEditDetail () {
    this.axios.request(this.api.supplementEditQuery, { id: this.staffBaseInfo.id })
      .then(({ data }) => {
        const { makeupYear, makeupMonth, paysDetailsResponses,
          reason, description, yearList, monthList, reasonList, closeAccount } = data
        const selectData = {
          supplementYear: `${makeupYear}年`,
          supplementMonth: `${makeupMonth}月`,
          supplementSelectedReason: reason
        }
        const supplementInfo = {
          company: {},
          personal: {}
        }
        for (const supplementType of paysDetailsResponses) {
          const { type, pension, medical, unemployment, workhurt, fertility, seriousIllness, supplementMedical,
            deformity, housefund, supplementHousefund, serve
          } = supplementType
          let t = 'c'
          if (type > 1) {
            t = 'p'
          }
          const supplementItem = {
            [t + 'PensionInsurance']: pension,
            [t + 'MedicalInsurance']: medical,
            [t + 'UnemploymentInsurance']: unemployment,
            [t + 'InjuryInsurance']: workhurt,
            [t + 'BirthInsurance']: fertility,
            [t + 'SeriousMedicalInsurance']: seriousIllness,
            [t + 'SupplementaryMedicalInsurance']: supplementMedical,
            [t + 'ResidualPremium']: deformity,
            [t + 'PublicReserveFunds']: housefund,
            [t + 'SupplementaryPublicReserveFunds']: supplementHousefund,
            [t + 'Serve']: serve
          }
          if (type > 1) supplementInfo.personal = supplementItem
          else supplementInfo.company = supplementItem
        }
        this.setState({
          staffBaseInfo: data,
          selectData,
          supplementInfo,
          yearList,
          monthList,
          reasonList,
          supplementReason: description,
          isCloseAccount: Number(closeAccount) !== 0
        })
        if (Number(closeAccount) !== 0) this.$message.warn('本月已关账，不能修改', 2)
        this.getFieldsValue(0)
      })
      .catch(({ msg }) => {
        this.$message.error(msg[0])
      })
  }

  // 设定 button 按钮点击状态
  getFieldsValue = (t: number) => {
    if (this.timerId) clearTimeout(this.timerId)
    this.timerId = setTimeout(() => {
      let {
        supplementYear, supplementMonth, supplementSelectedReason,
        cPensionInsurance, cMedicalInsurance, cUnemploymentInsurance, cInjuryInsurance, cBirthInsurance,
        cSeriousMedicalInsurance, cSupplementaryMedicalInsurance, cResidualPremium, cPublicReserveFunds,
        cSupplementaryPublicReserveFunds, cServe, // 公司补缴
        pPensionInsurance, pMedicalInsurance, pUnemploymentInsurance, pInjuryInsurance, pBirthInsurance,
        pSeriousMedicalInsurance, pSupplementaryMedicalInsurance, pPublicReserveFunds,
        pSupplementaryPublicReserveFunds, // 个人补缴
        supplementReason
      } = this.props.form.getFieldsValue()
      let disabled = !(
        supplementYear && supplementMonth && supplementSelectedReason && cBirthInsurance &&
        cPensionInsurance && cMedicalInsurance && cUnemploymentInsurance && cInjuryInsurance && cPublicReserveFunds &&
        pPensionInsurance && pMedicalInsurance && pUnemploymentInsurance && pInjuryInsurance && pPublicReserveFunds &&
        pBirthInsurance
      )
      let otherReasons = false
      if (supplementSelectedReason === '其他原因') {
        otherReasons = true
        disabled = !(supplementReason && !disabled)
      }
      const supplementInfo = {
        company: {
          cPensionInsurance,
          cMedicalInsurance,
          cUnemploymentInsurance,
          cInjuryInsurance,
          cBirthInsurance,
          cSeriousMedicalInsurance,
          cSupplementaryMedicalInsurance,
          cResidualPremium,
          cPublicReserveFunds,
          cSupplementaryPublicReserveFunds,
          cServe
        },
        personal: {
          pPensionInsurance,
          pMedicalInsurance,
          pUnemploymentInsurance,
          pInjuryInsurance,
          pBirthInsurance,
          pSeriousMedicalInsurance,
          pSupplementaryMedicalInsurance,
          pPublicReserveFunds,
          pSupplementaryPublicReserveFunds
        }
      }
      this.setState({
        disabled,
        supplementInfo,
        selectData: {
          supplementYear,
          supplementMonth,
          supplementSelectedReason
        },
        otherReasons
      })
    }, 50)
  }

  transformInputValue = (value: string) => {
    return FormatInputValue.toFixedAndKeepMinus(value, 3)
  }

  confirmAdd = () => {
    const { id } = this.staffBaseInfo
    const { userId } = this.state.staffBaseInfo
    const {
      supplementYear, supplementMonth, supplementSelectedReason,
      cPensionInsurance, cMedicalInsurance, cUnemploymentInsurance, cInjuryInsurance, cBirthInsurance,
      cSeriousMedicalInsurance, cSupplementaryMedicalInsurance, cResidualPremium, cPublicReserveFunds,
      cSupplementaryPublicReserveFunds, cServe, // 公司补缴
      pPensionInsurance, pMedicalInsurance, pUnemploymentInsurance, pInjuryInsurance, pBirthInsurance,
      pSeriousMedicalInsurance, pSupplementaryMedicalInsurance, pPublicReserveFunds,
      pSupplementaryPublicReserveFunds, // 个人补缴
      supplementReason
    } = this.props.form.getFieldsValue()
    const insertInforDetailsRequests = [
      {
        type: 1,
        pension: toFixed(cPensionInsurance),
        medical: toFixed(cMedicalInsurance),
        unemployment: toFixed(cUnemploymentInsurance),
        workhurt: toFixed(cInjuryInsurance),
        fertility: toFixed(cBirthInsurance),
        seriousIllness: toFixed(cSeriousMedicalInsurance),
        supplementMedical: toFixed(cSupplementaryMedicalInsurance),
        deformity: toFixed(cResidualPremium),
        housefund: toFixed(cPublicReserveFunds),
        supplementHousefund: toFixed(cSupplementaryPublicReserveFunds),
        serve: cServe
      },
      {
        type: 2,
        pension: toFixed(pPensionInsurance),
        medical: toFixed(pMedicalInsurance),
        unemployment: toFixed(pUnemploymentInsurance),
        workhurt: toFixed(pInjuryInsurance),
        fertility: toFixed(pBirthInsurance),
        seriousIllness: toFixed(pSeriousMedicalInsurance),
        supplementMedical: toFixed(pSupplementaryMedicalInsurance),
        deformity: '',
        housefund: toFixed(pPublicReserveFunds),
        supplementHousefund: toFixed(pSupplementaryPublicReserveFunds)
      }
    ]
    const params = {
      id,
      userId,
      makeupYear: supplementYear.substr(0, supplementYear.length - 1),
      makeupMonth: supplementMonth.substr(0, supplementMonth.length - 1),
      reason: supplementSelectedReason,
      description: supplementReason.trim(),
      insertInforDetailsRequests
    }
    this.axios.request(this.api.supplementEditSubmit, params)
      .then(() => {
        this.$message.success('保存成功', 2)
        SysUtil.clearSession('PersonalSupplementAdd')
        this.cancelAdd()
      })
      .catch(({ code, msg }) => {
        if (code === 400) this.showModal()
        else this.$message.error(msg[0])
      })
  }

  cancelAdd = () => {
    this.props.history.replace({ pathname: '/home/personalInsured', state: '3' })
  }

  // 显示模态框
  showModal = () => {
    (this.modal.current as BaseModal).handleOk()
  }

  // 隐藏模态框
  hideModal = () => {
    (this.modal.current as BaseModal).handleCancel()
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { staffBaseInfo, selectData, supplementInfo, supplementReason,
      yearList, monthList, reasonList, disabled, isCloseAccount, otherReasons } = this.state
    const {
      projectName, projectNumber, sjNumber, userName,
      idCard, passportCard, organize, entity, roleType,
      type, hourType, taxationType, startTime, endTime,
      entryTime, quitTime, icName, standardName,
      createTime, updateTime
    } = staffBaseInfo
    const {
      cPensionInsurance = 0, cMedicalInsurance = 0, cUnemploymentInsurance = 0, cInjuryInsurance = 0, cBirthInsurance = 0,
      cSeriousMedicalInsurance = 0, cSupplementaryMedicalInsurance = 0, cResidualPremium = 0, cPublicReserveFunds = 0,
      cSupplementaryPublicReserveFunds = 0, cServe = 0
    } = supplementInfo.company
    const {
      pPensionInsurance = 0, pMedicalInsurance = 0, pUnemploymentInsurance = 0, pInjuryInsurance = 0, pBirthInsurance = 0,
      pSeriousMedicalInsurance = 0, pSupplementaryMedicalInsurance = 0, pPublicReserveFunds = 0,
      pSupplementaryPublicReserveFunds = 0
    } = supplementInfo.personal
    const compantTotal = +cPensionInsurance + +cMedicalInsurance + +cUnemploymentInsurance + +cInjuryInsurance + +cBirthInsurance +
    +cSeriousMedicalInsurance + +cSupplementaryMedicalInsurance + +cResidualPremium + +cPublicReserveFunds +
    +cSupplementaryPublicReserveFunds + +cServe
    const personalTotal = +pPensionInsurance + +pMedicalInsurance + +pUnemploymentInsurance + +pInjuryInsurance + +pBirthInsurance +
    +pSeriousMedicalInsurance + +pSupplementaryMedicalInsurance + +pPublicReserveFunds +
    +pSupplementaryPublicReserveFunds
    return (
      <div>
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
        <Row className="detail_title">个人补缴{isCloseAccount && <span>(本月已关账，不能修改)</span>}</Row>
        <Form layout="inline">
          <Form.Item label="补缴年份">
            {getFieldDecorator('supplementYear', {
              initialValue: selectData.supplementYear,
              rules: [{
                required: true, message: '请选择补缴年份'
              }]
            })(
              <Select
                allowClear
                placeholder="请选择"
                style={{ width: '1.15rem' }}
                disabled={isCloseAccount}
                onChange={this.getFieldsValue.bind(this, 1)}>
                {yearList.map(item => <Select.Option value={item.typeName} key={item.id}>{item.typeName}</Select.Option>)}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="补缴月份">
            {getFieldDecorator('supplementMonth', {
              initialValue: selectData.supplementMonth,
              rules: [{
                required: true, message: '请选择补缴月份'
              }]
            })(
              <Select
                allowClear
                placeholder="请选择"
                style={{ width: '1.15rem' }}
                disabled={isCloseAccount}
                onChange={this.getFieldsValue.bind(this, 2)}>
                {monthList.map(item => <Select.Option value={item.typeName} key={item.id}>{item.typeName}</Select.Option>)}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="补缴原因">
            {getFieldDecorator('supplementSelectedReason', {
              initialValue: selectData.supplementSelectedReason,
              rules: [{ required: true }]
            })(
              <Select
                allowClear
                placeholder="请选择"
                style={{ width: '1.15rem' }}
                disabled={isCloseAccount}
                onChange={this.getFieldsValue.bind(this, 2)}>
                {reasonList.map(item => <Select.Option value={item.typeName} key={item.id}>{item.typeName}</Select.Option>)}
              </Select>
            )}
          </Form.Item>
          <Card className="table_content">
            <Row className="table_header" type="flex" justify="space-around">
              <Col span={1}>
                {/*  */}
              </Col>
              <Col span={2}>
                <i className="star">*</i> 养老险
              </Col>
              <Col span={2}>
                <i className="star">*</i> 医疗险
              </Col>
              <Col span={2}>
                <i className="star">*</i> 失业险
              </Col>
              <Col span={2}>
                <i className="star">*</i> 工伤险
              </Col>
              <Col span={2}>
                <i className="star">*</i> 生育险
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
                <i className="star">*</i> 公积金
              </Col>
              <Col span={2}>
                补充公积金
              </Col>
              <Col span={2}>
                服务费
              </Col>
            </Row>
            <Row className="table_row" type="flex" justify="space-around">
              <Col span={1} className="table_title">
                公司
              </Col>
              <Col span={2}>
                <Form.Item>
                  {getFieldDecorator('cPensionInsurance', {
                    initialValue: cPensionInsurance || undefined,
                    rules: [{ required: true }],
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input
                      className="input-110"
                      maxLength={11}
                      placeholder="请输入金额"
                      allowClear={!isCloseAccount}
                      disabled={isCloseAccount}
                      onChange={this.getFieldsValue.bind(this, 3)} />
                  )}
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item>
                  {getFieldDecorator('cMedicalInsurance', {
                    initialValue: cMedicalInsurance || undefined,
                    rules: [{ required: true }],
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input
                      className="input-110"
                      maxLength={11}
                      placeholder="请输入金额"
                      allowClear={!isCloseAccount}
                      disabled={isCloseAccount}
                      onChange={this.getFieldsValue.bind(this, 3)} />
                  )}
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item>
                  {getFieldDecorator('cUnemploymentInsurance', {
                    initialValue: cUnemploymentInsurance || undefined,
                    rules: [{ required: true }],
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input
                      className="input-110"
                      maxLength={11}
                      placeholder="请输入金额"
                      allowClear={!isCloseAccount}
                      disabled={isCloseAccount}
                      onChange={this.getFieldsValue.bind(this, 3)} />
                  )}
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item>
                  {getFieldDecorator('cInjuryInsurance', {
                    initialValue: cInjuryInsurance || undefined,
                    rules: [{ required: true }],
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input
                      className="input-110"
                      maxLength={11}
                      placeholder="请输入金额"
                      allowClear={!isCloseAccount}
                      disabled={isCloseAccount}
                      onChange={this.getFieldsValue.bind(this, 3)} />
                  )}
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item>
                  {getFieldDecorator('cBirthInsurance', {
                    initialValue: cBirthInsurance || undefined,
                    rules: [{ required: true }],
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input
                      className="input-110"
                      maxLength={11}
                      placeholder="请输入金额"
                      allowClear={!isCloseAccount}
                      disabled={isCloseAccount}
                      onChange={this.getFieldsValue.bind(this, 3)} />
                  )}
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item>
                  {getFieldDecorator('cSeriousMedicalInsurance', {
                    initialValue: cSeriousMedicalInsurance || undefined,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input
                      className="input-110"
                      maxLength={11}
                      placeholder="请输入金额"
                      allowClear={!isCloseAccount}
                      disabled={isCloseAccount}
                      onChange={this.getFieldsValue.bind(this, 3)} />
                  )}
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item>
                  {getFieldDecorator('cSupplementaryMedicalInsurance', {
                    initialValue: cSupplementaryMedicalInsurance || undefined,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input
                      className="input-110"
                      maxLength={11}
                      placeholder="请输入金额"
                      allowClear={!isCloseAccount}
                      disabled={isCloseAccount}
                      onChange={this.getFieldsValue.bind(this, 3)} />
                  )}
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item>
                  {getFieldDecorator('cResidualPremium', {
                    initialValue: cResidualPremium || undefined,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input
                      className="input-110"
                      maxLength={11}
                      placeholder="请输入金额"
                      allowClear={!isCloseAccount}
                      disabled={isCloseAccount}
                      onChange={this.getFieldsValue.bind(this, 3)} />
                  )}
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item>
                  {getFieldDecorator('cPublicReserveFunds', {
                    initialValue: cPublicReserveFunds || undefined,
                    rules: [{ required: true }],
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input
                      className="input-110"
                      maxLength={11}
                      placeholder="请输入金额"
                      allowClear={!isCloseAccount}
                      disabled={isCloseAccount}
                      onChange={this.getFieldsValue.bind(this, 3)} />
                  )}
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item>
                  {getFieldDecorator('cSupplementaryPublicReserveFunds', {
                    initialValue: cSupplementaryPublicReserveFunds || undefined,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input
                      className="input-110"
                      maxLength={11}
                      placeholder="请输入金额"
                      allowClear={!isCloseAccount}
                      disabled={isCloseAccount}
                      onChange={this.getFieldsValue.bind(this, 3)} />
                  )}
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item>
                  {getFieldDecorator('cServe', {
                    initialValue: cServe || undefined,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input
                      className="input-110"
                      maxLength={11}
                      placeholder="请输入金额"
                      allowClear={!isCloseAccount}
                      disabled={isCloseAccount}
                      onChange={this.getFieldsValue.bind(this, 3)} />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className="table_row" type="flex" justify="space-around">
              <Col span={1} className="table_title">
                个人
              </Col>
              <Col span={2}>
                <Form.Item>
                  {getFieldDecorator('pPensionInsurance', {
                    initialValue: pPensionInsurance || undefined,
                    rules: [{ required: true }],
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input
                      className="input-110"
                      maxLength={11}
                      placeholder="请输入金额"
                      allowClear={!isCloseAccount}
                      disabled={isCloseAccount}
                      onChange={this.getFieldsValue.bind(this, 3)} />
                  )}
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item>
                  {getFieldDecorator('pMedicalInsurance', {
                    initialValue: pMedicalInsurance || undefined,
                    rules: [{ required: true }],
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input
                      className="input-110"
                      maxLength={11}
                      placeholder="请输入金额"
                      allowClear={!isCloseAccount}
                      disabled={isCloseAccount}
                      onChange={this.getFieldsValue.bind(this, 3)} />
                  )}
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item>
                  {getFieldDecorator('pUnemploymentInsurance', {
                    initialValue: pUnemploymentInsurance || undefined,
                    rules: [{ required: true }],
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input
                      className="input-110"
                      maxLength={11}
                      placeholder="请输入金额"
                      allowClear={!isCloseAccount}
                      disabled={isCloseAccount}
                      onChange={this.getFieldsValue.bind(this, 3)} />
                  )}
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item>
                  {getFieldDecorator('pInjuryInsurance', {
                    initialValue: pInjuryInsurance || undefined,
                    rules: [{ required: true }],
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input
                      className="input-110"
                      maxLength={11}
                      placeholder="请输入金额"
                      allowClear={!isCloseAccount}
                      disabled={isCloseAccount}
                      onChange={this.getFieldsValue.bind(this, 3)} />
                  )}
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item>
                  {getFieldDecorator('pBirthInsurance', {
                    initialValue: pBirthInsurance || undefined,
                    rules: [{ required: true }],
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input
                      className="input-110"
                      maxLength={11}
                      placeholder="请输入金额"
                      allowClear={!isCloseAccount}
                      disabled={isCloseAccount}
                      onChange={this.getFieldsValue.bind(this, 3)} />
                  )}
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item>
                  {getFieldDecorator('pSeriousMedicalInsurance', {
                    initialValue: pSeriousMedicalInsurance || undefined,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input
                      className="input-110"
                      maxLength={11}
                      placeholder="请输入金额"
                      allowClear={!isCloseAccount}
                      disabled={isCloseAccount}
                      onChange={this.getFieldsValue.bind(this, 3)} />
                  )}
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item>
                  {getFieldDecorator('pSupplementaryMedicalInsurance', {
                    initialValue: pSupplementaryMedicalInsurance || undefined,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input
                      className="input-110"
                      maxLength={11}
                      placeholder="请输入金额"
                      allowClear={!isCloseAccount}
                      disabled={isCloseAccount}
                      onChange={this.getFieldsValue.bind(this, 3)} />
                  )}
                </Form.Item>
              </Col>
              <Col span={2} className="flex-start">
                ---
              </Col>
              <Col span={2}>
                <Form.Item>
                  {getFieldDecorator('pPublicReserveFunds', {
                    initialValue: pPublicReserveFunds || undefined,
                    rules: [{ required: true }],
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input
                      className="input-110"
                      maxLength={11}
                      placeholder="请输入金额"
                      allowClear={!isCloseAccount}
                      disabled={isCloseAccount}
                      onChange={this.getFieldsValue.bind(this, 3)} />
                  )}
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item>
                  {getFieldDecorator('pSupplementaryPublicReserveFunds', {
                    initialValue: pSupplementaryPublicReserveFunds || undefined,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input
                      className="input-110"
                      maxLength={11}
                      placeholder="请输入金额"
                      allowClear={!isCloseAccount}
                      disabled={isCloseAccount}
                      onChange={this.getFieldsValue.bind(this, 3)} />
                  )}
                </Form.Item>
              </Col>
              <Col span={2} className="flex-start">
                ---
              </Col>
            </Row>
          </Card>
          <Row className="detail_total">
            <b>小计</b> 公司：<span className="company">￥{compantTotal.toFixed(3)}</span> 个人：<span>￥{personalTotal.toFixed(3)}</span>
          </Row>
          <Row>
            <Form.Item label="补充说明：" className="supplement_reason">
              {getFieldDecorator('supplementReason', {
                initialValue: supplementReason || '',
                rules: [{ required: otherReasons }]
              })(
                <textarea
                  disabled={isCloseAccount}
                  name="textarea"
                  className="ant_textarea"
                  placeholder="最多可输入50字"
                  maxLength={50}
                  onChange={this.getFieldsValue.bind(this, 4)}>
                </textarea>
              )}
            </Form.Item>
          </Row>
        </Form>
        <Divider />
        <Row className="time-record">
          <p>创建时间：{createTime}</p>
          {
            updateTime && <p>上次修改时间：{updateTime}</p>
          }
        </Row>
        {
          /* eslint-disable */
          this.isAuthenticated(this.AuthorityList.personalInsured[7])
            ?
              <Row>
                <Button type="primary" className="ant_button_confirm" disabled={disabled || isCloseAccount} onClick={this.confirmAdd}>保存</Button>
                <Button className="ant_button_cancel" onClick={this.cancelAdd}>取消</Button>
              </Row>
            :
              <Row>
                <Button type="primary" className="ant_button_confirm" onClick={this.cancelAdd}>返回</Button>
              </Row>
        }
        <BaseModal ref={this.modal}>
          <h2 className="tips_text">员工在{selectData.supplementYear}{selectData.supplementMonth}已有补缴记录，不可再补缴。</h2>
          <Row className="remove_button_wrapper">
            <Button type="primary" className="ant_button_confirm" onClick={this.hideModal}>确定</Button>
          </Row>
        </BaseModal>
      </div>
    )
  }

  componentWillUnmount () {
    clearTimeout(this.timerId)
  }
}

@hot(module)
export default class PersonalSupplementDetail extends RootComponent<BaseProps> {
  render () {
    const SupplementFormComponent = Form.create<BaseSupplementFormProps>()(SupplementForm)
    return (
      <div id="personal_supplement_add">
        <SupplementFormComponent {...this.props} />
      </div>
    )
  }
}
