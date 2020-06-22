/*
 * @description: 参保管理模块 - 个人参保 - 个人补缴信息 新增
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-04-10 15:54:22
 * @LastEditTime: 2020-05-20 10:05:31
 * @copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import RootComponent from '@components/root/RootComponent'
import BaseModal from '@components/modal/BasicModal'
import { Prompt } from 'react-router-dom'
import { Card, Row, Col, Button, Form, Select, Input } from 'antd'
import { hot } from 'react-hot-loader'

import { SysUtil, FormatInputValue } from '@utils/index'

import '../style/PersonalSupplementAdd'

import { BaseProps, KeyValue } from 'typings/global'
import { FormComponentProps } from 'antd/lib/form'

interface BaseSupplementFormProps extends BaseProps, FormComponentProps {
  userId: number
}

interface BaseSupplementFormState {
  staffBaseInfo: KeyValue
  yearList: KeyValue[]
  monthList: KeyValue[]
  reasonList: KeyValue[]
  selectData: KeyValue
  supplementInfo: { company: KeyValue, personal: KeyValue }
  disabled: boolean
  otherReasons: boolean
  supplementReason: string
}

const toFixed = (n: string) => {
  n = n || '0'
  return parseFloat(n).toFixed(3)
}

class SupplementForm extends RootComponent<BaseSupplementFormProps, BaseSupplementFormState> {
  modal: React.RefObject<BaseModal> = React.createRef()
  timerId: any = null

  constructor (props: BaseSupplementFormProps) {
    super(props)
    this.state = {
      otherReasons: false,
      disabled: true,
      staffBaseInfo: {},
      yearList: [],
      monthList: [],
      reasonList: [],
      selectData: this.getLocaleStoragedStaffInfo('PersonalSupplementSelectData') || {}, // 补缴年月筛选条件
      supplementInfo: this.getLocaleStoragedStaffInfo('PersonalSupplementInfo') || { // 补缴表单信息
        company: {},
        personal: {}
      },
      supplementReason: this.getLocaleStoragedStaffInfo('PersonalSupplementReason') || ''
    }
  }

  componentDidMount () {
    this.getSupplementData()
  }

  getSupplementData () {
    const { userId } = this.props
    this.axios.request(this.api.supplementDetail, { userId })
      .then(({ data }) => {
        const { yearList, monthList, reasonList } = data
        this.setState({
          staffBaseInfo: data,
          yearList,
          monthList,
          reasonList
        })
        this.getFieldsValue(0)
      })
      .catch(({ msg }) => {
        this.$message.error(msg[0])
      })
  }

  // 根据 userId 读取 localeStorage 中指定的信息
  getLocaleStoragedStaffInfo (name: string) {
    const { userId } = this.props
    const staffInfo = SysUtil.getLocalStorage(name)
    return staffInfo && staffInfo[userId]
  }

  // 根据 userId 设置 localeStorage 中指定的信息
  setLocaleStoragedStaffInfo (name: string, info: any) {
    const { userId } = this.props
    let staffInfo = SysUtil.getLocalStorage(name)
    if (!staffInfo) staffInfo = {}
    staffInfo[userId] = info
    SysUtil.setLocalStorage(name, staffInfo)
  }

  // 根据 useId 移除 localeStorage 中指定的信息
  clearLocaleStoragedStaffInfo (name: string) {
    const { userId } = this.props
    let staffInfo = SysUtil.getLocalStorage(name)
    if (!staffInfo) staffInfo = {}
    delete staffInfo[userId]
    if (!Object.keys(staffInfo).length) SysUtil.clearLocalStorage(name)
    else SysUtil.setLocalStorage(name, staffInfo)
  }

  // 设定 button 按钮点击状态
  getFieldsValue = (t: number) => {
    if (this.timerId) clearTimeout(this.timerId)
    this.timerId = setTimeout(() => {
      let {
        supplementYear, supplementMonth, supplementSelectedReason,
        cPensionInsurance, cMedicalInsurance, cUnemploymentInsurance, cInjuryInsurance, cBirthInsurance,
        cSeriousMedicalInsurance, cSupplementaryMedicalInsurance, cResidualPremium, cPublicReserveFunds,
        cSupplementaryPublicReserveFunds, // 公司补缴
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
      const selectData = { supplementYear, supplementMonth, supplementSelectedReason }
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
          cSupplementaryPublicReserveFunds
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
      if (t > 0) {
        this.setState({
          disabled,
          selectData,
          supplementInfo,
          supplementReason,
          otherReasons
        })
      } else {
        this.setState({
          disabled,
          otherReasons
        })
      }
      if (t < 3 && t > 0) this.updateSupplementData(selectData)
      else if (t > 3) this.setLocaleStoragedStaffInfo('PersonalSupplementReason', supplementReason)
      else if (t === 3) this.setLocaleStoragedStaffInfo('PersonalSupplementInfo', supplementInfo)
      else console.log('初始化表单数据')
    }, 50)
  }

  transformInputValue = (value: string) => {
    return FormatInputValue.toFixedAndKeepMinus(value, 3)
  }

  // 通过年月名称来筛选年月名称
  getDateNameById (yearName: string, monthName: string) {
    const { yearList, monthList } = this.state
    let year, month
    for (const yearItem of yearList) {
      if (yearName === yearItem.typeName) {
        year = yearItem.typeName
        break
      }
    }
    for (const monthItem of monthList) {
      if (monthName === monthItem.typeName) {
        month = monthItem.typeName
        break
      }
    }
    return { year, month }
  }

  // 根据年月筛选，清空数据
  updateSupplementData (selectData: KeyValue) {
    this.setLocaleStoragedStaffInfo('PersonalSupplementSelectData', selectData)
  }

  confirmAdd = () => {
    const { icName, standardName } = this.state.staffBaseInfo
    if (!(icName && standardName)) {
      this.$message.warn('该员工所属公司参保参数未维护，不可新增。', 2)
      return
    }
    const { userId } = this.props
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
      userId,
      makeupYear: supplementYear.substr(0, supplementYear.length - 1),
      makeupMonth: supplementMonth.substr(0, supplementMonth.length - 1),
      reason: supplementSelectedReason,
      description: supplementReason.trim(),
      insertInforDetailsRequests
    }
    this.axios.request(this.api.supplementNewAdd, params)
      .then(() => {
        this.$message.success('新增成功', 2)
        this.clearLocaleStoragedStaffInfo('PersonalSupplementSelectData')
        this.clearLocaleStoragedStaffInfo('PersonalSupplementInfo')
        this.clearLocaleStoragedStaffInfo('PersonalSupplementReason')
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
    this.modal.current!.handleOk()
  }

  // 隐藏模态框
  hideModal = () => {
    this.modal.current!.handleCancel()
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const {
      staffBaseInfo, selectData, supplementInfo, supplementReason,
      yearList, monthList, reasonList, otherReasons
    } = this.state
    const {
      projectName, projectNumber, sjNumber, userName,
      idCard, passportCard, organize, entity, roleType,
      type, hourType, taxationType, startTime, endTime,
      entryTime, quitTime, icName, standardName
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
    const { supplementYear, supplementMonth } = selectData
    const { year, month } = this.getDateNameById(supplementYear, supplementMonth)
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
                <Col span={16}>{`${startTime} 至 ${endTime}`}</Col>
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
        <Row className="detail_title">个人补缴</Row>
        <Form layout="inline">
          <Form.Item label="补缴年份">
            {getFieldDecorator('supplementYear', {
              initialValue: selectData.supplementYear,
              rules: [{ required: true }]
            })(
              <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} allowClear placeholder="请选择" style={{ width: '1.15rem' }} onChange={this.getFieldsValue.bind(this, 1)}>
                {yearList.map(item => <Select.Option value={item.typeName} key={item.id}>{item.typeName}</Select.Option>)}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="补缴月份">
            {getFieldDecorator('supplementMonth', {
              initialValue: selectData.supplementMonth,
              rules: [{ required: true }]
            })(
              <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} allowClear placeholder="请选择" style={{ width: '1.15rem' }} onChange={this.getFieldsValue.bind(this, 2)}>
                {monthList.map(item => <Select.Option value={item.typeName} key={item.id}>{item.typeName}</Select.Option>)}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="补缴原因">
            {getFieldDecorator('supplementSelectedReason', {
              initialValue: selectData.supplementSelectedReason,
              rules: [{ required: true }]
            })(
              <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} allowClear placeholder="请选择" style={{ width: '1.15rem' }} onChange={this.getFieldsValue.bind(this, 2)}>
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
                      allowClear
                      className="input-110"
                      placeholder="请输入金额"
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
                      allowClear
                      className="input-110"
                      placeholder="请输入金额"
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
                      allowClear
                      className="input-110"
                      placeholder="请输入金额"
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
                      allowClear
                      className="input-110"
                      placeholder="请输入金额"
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
                      allowClear
                      className="input-110"
                      placeholder="请输入金额"
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
                      allowClear
                      className="input-110"
                      placeholder="请输入金额"
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
                      allowClear
                      className="input-110"
                      placeholder="请输入金额"
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
                      allowClear
                      className="input-110"
                      placeholder="请输入金额"
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
                      allowClear
                      className="input-110"
                      placeholder="请输入金额"
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
                      allowClear
                      className="input-110"
                      placeholder="请输入金额"
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
                      allowClear
                      className="input-110"
                      placeholder="请输入金额"
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
                      allowClear
                      className="input-110"
                      placeholder="请输入金额"
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
                      allowClear
                      className="input-110"
                      placeholder="请输入金额"
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
                      allowClear
                      className="input-110"
                      placeholder="请输入金额"
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
                      allowClear
                      className="input-110"
                      placeholder="请输入金额"
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
                      allowClear
                      className="input-110"
                      placeholder="请输入金额"
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
                      allowClear
                      className="input-110"
                      placeholder="请输入金额"
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
                      allowClear
                      className="input-110"
                      placeholder="请输入金额"
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
                      allowClear
                      className="input-110"
                      placeholder="请输入金额"
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
                      allowClear
                      className="input-110"
                      placeholder="请输入金额"
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
                initialValue: supplementReason,
                rules: [{ required: otherReasons }]
              })(
                <textarea
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
        <Row>
          <Button type="primary" className="ant_button_confirm" disabled={this.state.disabled} onClick={this.confirmAdd}>确定</Button>
          <Button className="ant_button_cancel" onClick={this.cancelAdd}>取消</Button>
        </Row>
        <BaseModal ref={this.modal}>
          <h2 className="tips_text">员工在{year}{month}已有补缴记录，不可再补缴。</h2>
          <Row className="remove_button_wrapper">
            <Button type="primary" className="ant_button_confirm" onClick={this.hideModal}>确定</Button>
          </Row>
        </BaseModal>
        <Prompt when message={`PersonalSupplementInfo-${this.props.userId}`} />
      </div>
    )
  }

  componentWillUnmount () {
    clearTimeout(this.timerId)
  }
}

@hot(module)
export default class PersonalSupplementAdd extends RootComponent<BaseProps> {
  render () {
    const SupplementFormComponent = Form.create<BaseSupplementFormProps>()(SupplementForm)
    const { userId = 1 } = SysUtil.getSessionStorage('PersonalSupplementAdd') || {}
    return (
      <div id="personal_supplement_add">
        <SupplementFormComponent {...this.props} userId={userId} />
      </div>
    )
  }
}
