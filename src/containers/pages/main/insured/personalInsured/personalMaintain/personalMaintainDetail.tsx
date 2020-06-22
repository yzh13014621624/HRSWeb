/*
 * @description: 参保管理模块 - 个人参保 - 个人参保维护 详情/编辑
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-04-10 16:06:22
 * @LastEditTime: 2019-08-07 09:40:51
 * @copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import RootComponent from '@components/root/RootComponent'
import { SysUtil, FormatInputValue } from '@utils/index'
import { hot } from 'react-hot-loader'
import { Card, Row, Col, Button, Form, Select, Input, Divider } from 'antd'

import '../style/PersonalMaintainAdd'

import { BaseProps, KeyValue } from 'typings/global'
import { FormComponentProps } from 'antd/lib/form'

const { Item } = Form
const { Option } = Select

const toFixed = (n: string) => {
  n = n || '0'
  return parseFloat(n).toFixed(2)
}

interface BaseSupplementFormProps extends BaseProps, FormComponentProps {
  isSetInsuranceParams: boolean
}

interface BaseSupplementFormState {
  staffBaseInfo: KeyValue
  staffEditedDataInfo: KeyValue
  yearList: KeyValue[]
  monthList: KeyValue[]
  disabled: boolean
  isCloseAccount: boolean
}

class MaintainForm extends RootComponent<BaseSupplementFormProps, BaseSupplementFormState> {
  sessionStoragedStaffInfo: KeyValue = SysUtil.getSessionStorage('PersonalMaintainEdit') || {}
  maintainTimerId: any = null

  constructor (props: BaseSupplementFormProps) {
    super(props)
    this.state = {
      disabled: true,
      staffBaseInfo: {},
      staffEditedDataInfo: {},
      yearList: [],
      monthList: [],
      isCloseAccount: false
    }
  }

  componentDidMount () {
    this.getSupplementEditData()
  }

  getSupplementEditData () {
    const { id } = this.sessionStoragedStaffInfo
    this.axios.request(this.api.maintainEditQuery, { id })
      .then(async ({ data }) => {
        const {
          icId, standardId,
          insurancStartYear, insuranceStartMonth,
          housefundStartYear, housefundStarMonth,
          pension, medical, unemployment, workhurt,
          fertility, seriousillnessMedical, supplementMedical, providentfund,
          supplementHouse, serve,
          yearlist, monthList, closeAccount
        } = data
        const staffEditedDataInfo = {
          icId,
          standardId,
          socialSecurityPayStartYear: insurancStartYear + '年',
          socialSecurityPayStartMonth: insuranceStartMonth + '月',
          publicReserveFundsStartYear: housefundStartYear + '年',
          publicReserveFundsStartMonth: housefundStarMonth + '月',
          pensionInsurance: pension,
          medicalInsurance: medical,
          unemploymentInsurance: unemployment,
          injuryInsurance: workhurt,
          birthInsurance: fertility,
          seriousMedicalInsurance: seriousillnessMedical,
          supplementaryMedicalInsurance: supplementMedical,
          publicReserveFunds: providentfund,
          supplementaryPublicReserveFunds: supplementHouse,
          serve
        }
        await this.setState({
          staffBaseInfo: data,
          staffEditedDataInfo,
          yearList: yearlist,
          monthList,
          isCloseAccount: Number(closeAccount) !== 0
        })
        if (Number(closeAccount) !== 0) this.$message.warn('本月已关账，不能修改', 2)
        this.getFieldsValue(0)
      })
      .catch(({ msg }) => {
        this.$message.error(msg[0])
      })
  }

  // 根据 userId 读取 localeStorage 中指定的信息
  getLocaleStoragedStaffInfo (name: string) {
    const { userId } = this.sessionStoragedStaffInfo
    const staffInfo = SysUtil.getLocalStorage(name)
    const tempStaffInfo = {
      socialSecurityPayStartYear: undefined,
      socialSecurityPayStartMonth: undefined,
      socialSecurityPayEndYear: undefined,
      socialSecurityPayEndMonth: undefined,
      publicReserveFundsStartYear: undefined,
      publicReserveFundsStartMonth: undefined,
      publicReserveFundsEndYear: undefined,
      publicReserveFundsEndMonth: undefined,
      pensionInsurance: undefined, // 养老
      medicalInsurance: undefined, // 医疗
      unemploymentInsurance: undefined, // 失业
      injuryInsurance: undefined, // 工伤
      birthInsurance: undefined, // 生育
      seriousMedicalInsurance: undefined, // 大病医疗
      supplementaryMedicalInsurance: undefined, // 补充医疗
      publicReserveFunds: undefined, // 公积金
      supplementaryPublicReserveFunds: undefined, // 补充公积金
      serve: undefined // 服务费
    }
    return (staffInfo && staffInfo[userId]) || tempStaffInfo
  }

  // 根据 userId 设置 localeStorage 中指定的信息
  setLocaleStoragedStaffInfo (name: string, info: any) {
    const { userId } = this.sessionStoragedStaffInfo
    let staffInfo = SysUtil.getLocalStorage(name)
    if (!staffInfo) staffInfo = {}
    staffInfo[userId] = info
    SysUtil.setLocalStorage(name, staffInfo)
  }

  // 根据 useId 移除 localeStorage 中指定的信息
  clearLocaleStoragedStaffInfo (name: string) {
    const { userId } = this.sessionStoragedStaffInfo
    let staffInfo = SysUtil.getLocalStorage(name)
    if (!staffInfo) staffInfo = {}
    delete staffInfo[userId]
    if (!Object.keys(staffInfo).length) SysUtil.clearLocalStorage(name)
    else SysUtil.setLocalStorage(name, staffInfo)
  }

  // 设定 button 按钮点击状态
  getFieldsValue = (t: number) => {
    const isCity = this.state.staffBaseInfo.isCity < 2
    if (this.maintainTimerId) clearTimeout(this.maintainTimerId)
    this.maintainTimerId = setTimeout(() => {
      const fieldsValue = this.props.form.getFieldsValue()
      const {
        icId, standardId,
        // socialSecurityPayStartYear, socialSecurityPayStartMonth,
        // publicReserveFundsStartYear, publicReserveFundsStartMonth,
        pensionInsurance, medicalInsurance, unemploymentInsurance, injuryInsurance,
        birthInsurance,
        publicReserveFunds
      } = fieldsValue
      const disabled1 = !(
        icId && standardId &&
        pensionInsurance && medicalInsurance && unemploymentInsurance && injuryInsurance &&
        birthInsurance &&
        publicReserveFunds
      )
      const disabled2 = !(
        // socialSecurityPayStartYear && socialSecurityPayStartMonth &&
        // publicReserveFundsStartYear && publicReserveFundsStartMonth &&
        pensionInsurance && medicalInsurance && unemploymentInsurance && injuryInsurance &&
        birthInsurance &&
        publicReserveFunds
      )
      this.setState({
        disabled: isCity ? disabled1 : disabled2
      })
    }, 50)
  }

  transformInputValue = (value: string) => {
    return FormatInputValue.toFixed(value)
  }

  confirmAdd = () => {
    const { isCity } = this.state.staffBaseInfo
    const { id, userId } = this.sessionStoragedStaffInfo
    const {
      icId, standardId,
      // socialSecurityPayStartYear = '', socialSecurityPayStartMonth = '',
      // publicReserveFundsStartYear = '', publicReserveFundsStartMonth = '',
      pensionInsurance, medicalInsurance, unemploymentInsurance, injuryInsurance,
      birthInsurance, seriousMedicalInsurance, supplementaryMedicalInsurance, publicReserveFunds,
      supplementaryPublicReserveFunds, serve
    } = this.props.form.getFieldsValue()
    const params = {
      id,
      userId,
      icId,
      standardId,
      // insurancStartYear: socialSecurityPayStartYear.substr(0, socialSecurityPayStartYear.length - 1),
      // insuranceStartMonth: socialSecurityPayStartMonth.substr(0, socialSecurityPayStartMonth.length - 1),
      // housefundStartYear: publicReserveFundsStartYear.substr(0, publicReserveFundsStartYear.length - 1),
      // housefundStarMonth: publicReserveFundsStartMonth.substr(0, publicReserveFundsStartMonth.length - 1),
      pension: toFixed(pensionInsurance),
      medical: toFixed(medicalInsurance),
      unemployment: toFixed(unemploymentInsurance),
      workhurt: toFixed(injuryInsurance),
      fertility: toFixed(birthInsurance),
      seriousillnessMedical: toFixed(seriousMedicalInsurance),
      supplementMedical: toFixed(supplementaryMedicalInsurance),
      providentfund: toFixed(publicReserveFunds),
      supplementHouse: toFixed(supplementaryPublicReserveFunds),
      serve: toFixed(serve)
    }
    if (isCity > 1) {
      delete params.icId
      delete params.standardId
    }
    this.axios.request(this.api.maintainEdit, params)
      .then(() => {
        this.$message.success('保存成功', 2)
        SysUtil.clearSession('PersonalMaintainEdit')
        this.cancelAdd()
      })
      .catch(({ msg }) => {
        this.$message.error(msg[0])
      })
  }

  cancelAdd = () => {
    this.props.history.replace({ pathname: '/home/personalInsured', state: '1' })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { staffBaseInfo, staffEditedDataInfo, yearList, monthList, disabled, isCloseAccount } = this.state
    const {
      projectName, projectNumber, sjNumber, userName,
      idCard, passportCard, organize, entity, roleType,
      type, hourType, taxationType, startTime, endTime,
      entryTime, quitTime, icName, standardName, createTime, updateTime,
      icId, standardId,
      insurancStartYear, insuranceStartMonth, insurancEndYear, insuranceEndMonth,
      housefundStartYear, housefundStarMonth, housefundEndYear, housefundEndMonth,
      cityList = [], standardList = [], isCity
    } = staffBaseInfo
    const {
      socialSecurityPayStartYear, socialSecurityPayStartMonth,
      publicReserveFundsStartYear, publicReserveFundsStartMonth,
      pensionInsurance, medicalInsurance, unemploymentInsurance, injuryInsurance,
      birthInsurance, seriousMedicalInsurance, supplementaryMedicalInsurance, publicReserveFunds,
      supplementaryPublicReserveFunds, serve
    } = staffEditedDataInfo
    const showSelect = isCity < 2
    let startPayYear: string = ''
    let startPayMonth: string = ''
    if (quitTime) [startPayYear, startPayMonth] = quitTime.split('-')
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
            {
              !showSelect &&
              <Col span={6}>
                <Row className={`detail_item ${icName ? null : 'todo'}`}>
                  <Col span={6}>参保城市：</Col>
                  <Col span={18}>{icName || '待维护'}</Col>
                </Row>
              </Col>
            }
            {
              showSelect &&
              <Col span={6}>
                <Item label="参保城市" labelCol={{ span: 6 }}>
                  {getFieldDecorator('icId', {
                    initialValue: icId,
                    rules: [{ required: true }]
                  })(
                    <Select allowClear disabled={isCloseAccount} placeholder="请选择" onChange={this.getFieldsValue.bind(this, 1)}>
                      {cityList.map(({ id, typeName }: any) => <Option key={id} value={id} title={typeName}>{typeName}</Option>)}
                    </Select>
                  )}
                </Item>
              </Col>
            }
            {
              !showSelect &&
              <Col span={6}>
                <Row className={`detail_item ${standardName ? null : 'todo'}`}>
                  <Col span={8}>参保标准：</Col>
                  <Col span={16}>{standardName || '待维护'}</Col>
                </Row>
              </Col>
            }
            {
              showSelect &&
              <Col span={6}>
                <Item label="参保标准" labelCol={{ span: 6 }}>
                  {getFieldDecorator('standardId', {
                    initialValue: standardId,
                    rules: [{ required: true }]
                  })(
                    <Select allowClear disabled={isCloseAccount} placeholder="请选择" onChange={this.getFieldsValue.bind(this, 1)}>
                      {standardList.map(({ id, typeName }: any) => <Option key={id} value={id} title={typeName}>{typeName}</Option>)}
                    </Select>
                  )}
                </Item>
              </Col>
            }
          </Row>
        </Card>
        <Row className="detail_title">参保维护{isCloseAccount && <span>(本月已关账，不能修改)</span>}</Row>
        <Form layout="inline">
          <Row className="form_row">
            <Col span={6}>
              <Item label="社保起缴年度">
                {/* {getFieldDecorator('socialSecurityPayStartYear', {
                  initialValue: socialSecurityPayStartYear
                })(
                  <Select
                    placeholder="请选择"
                    disabled={isCloseAccount}
                    onChange={this.getFieldsValue.bind(this, 1)}>
                    {yearList.map(item => <Select.Option value={item.typeName} key={item.id}>{item.typeName}</Select.Option>)}
                  </Select>
                )} */}
                {insurancStartYear || '- - - '}
              </Item>
            </Col>
            <Col span={6}>
              <Item label="社保起缴月度">
                {/* {getFieldDecorator('socialSecurityPayStartMonth', {
                  initialValue: socialSecurityPayStartMonth
                })(
                  <Select
                    placeholder="请选择"
                    disabled={isCloseAccount}
                    onChange={this.getFieldsValue.bind(this, 1)}>
                    {monthList.map(item => <Select.Option value={item.typeName} key={item.id}>{item.typeName}</Select.Option>)}
                  </Select>
                )} */}
                {insuranceStartMonth || '- - - '}
              </Item>
            </Col>
            <Col span={6}>
              <Item label="社保停缴年度">
                {getFieldDecorator('socialSecurityPayEndYear')(
                  <div>{insurancEndYear || '- - -' }</div>
                )}
              </Item>
            </Col>
            <Col span={6}>
              <Item label="社保停缴月度">
                {getFieldDecorator('socialSecurityPayEndMonth')(
                  <div>{insuranceEndMonth || '- - -' }</div>
                )}
              </Item>
            </Col>
          </Row>
          <Row className="form_row">
            <Col span={6}>
              <Item label="公积金起缴年度">
                {/* {getFieldDecorator('publicReserveFundsStartYear', {
                  initialValue: publicReserveFundsStartYear
                })(
                  <Select
                    placeholder="请选择"
                    disabled={isCloseAccount}
                    onChange={this.getFieldsValue.bind(this, 2)}>
                    {yearList.map(item => <Select.Option value={item.typeName} key={item.id}>{item.typeName}</Select.Option>)}
                  </Select>
                )} */}
                {housefundStartYear || '- - - '}
              </Item>
            </Col>
            <Col span={6}>
              <Item label="公积金起缴月度">
                {/* {getFieldDecorator('publicReserveFundsStartMonth', {
                  initialValue: publicReserveFundsStartMonth
                })(
                  <Select
                    placeholder="请选择"
                    disabled={isCloseAccount}
                    onChange={this.getFieldsValue.bind(this, 2)}>
                    {monthList.map(item => <Select.Option value={item.typeName} key={item.id}>{item.typeName}</Select.Option>)}
                  </Select>
                )} */}
                {housefundStarMonth || '- - - '}
              </Item>
            </Col>
            <Col span={6}>
              <Item label="公积金停缴年度">
                {getFieldDecorator('publicReserveFundsEndYear')(
                  <div>{housefundEndYear || '- - -' }</div>
                )}
              </Item>
            </Col>
            <Col span={6}>
              <Item label="公积金停缴月度">
                {getFieldDecorator('publicReserveFundsEndMonth')(
                  <div>{housefundEndMonth || '- - -' }</div>
                )}
              </Item>
            </Col>
          </Row>
          <Row className="form_row">
            <Col span={6}>
              <Item label="养老险基数">
                {getFieldDecorator('pensionInsurance', {
                  initialValue: pensionInsurance,
                  rules: [{ required: true }],
                  getValueFromEvent: (e: any) => {
                    e.persist()
                    return this.transformInputValue(e.target.value)
                  }
                })(
                  <Input
                    placeholder="请输入金额"
                    allowClear={!isCloseAccount}
                    disabled={isCloseAccount}
                    onChange={this.getFieldsValue.bind(this, 3)} />
                )}
              </Item>
            </Col>
            <Col span={6}>
              <Item label="医疗险基数">
                {getFieldDecorator('medicalInsurance', {
                  initialValue: medicalInsurance,
                  rules: [{ required: true }],
                  getValueFromEvent: (e: any) => {
                    e.persist()
                    return this.transformInputValue(e.target.value)
                  }
                })(
                  <Input
                    placeholder="请输入金额"
                    allowClear={!isCloseAccount}
                    disabled={isCloseAccount}
                    onChange={this.getFieldsValue.bind(this, 3)} />
                )}
              </Item>
            </Col>
            <Col span={6}>
              <Item label="失业险基数">
                {getFieldDecorator('unemploymentInsurance', {
                  initialValue: unemploymentInsurance,
                  rules: [{ required: true }],
                  getValueFromEvent: (e: any) => {
                    e.persist()
                    return this.transformInputValue(e.target.value)
                  }
                })(
                  <Input
                    placeholder="请输入金额"
                    allowClear={!isCloseAccount}
                    disabled={isCloseAccount}
                    onChange={this.getFieldsValue.bind(this, 3)} />
                )}
              </Item>
            </Col>
            <Col span={6}>
              <Item label="工伤基数">
                {getFieldDecorator('injuryInsurance', {
                  initialValue: injuryInsurance,
                  rules: [{ required: true }],
                  getValueFromEvent: (e: any) => {
                    e.persist()
                    return this.transformInputValue(e.target.value)
                  }
                })(
                  <Input
                    placeholder="请输入金额"
                    allowClear={!isCloseAccount}
                    disabled={isCloseAccount}
                    onChange={this.getFieldsValue.bind(this, 3)} />
                )}
              </Item>
            </Col>
          </Row>
          <Row className="form_row">
            <Col span={6}>
              <Item label="生育险基数">
                {getFieldDecorator('birthInsurance', {
                  initialValue: birthInsurance,
                  rules: [{ required: true }],
                  getValueFromEvent: (e: any) => {
                    e.persist()
                    return this.transformInputValue(e.target.value)
                  }
                })(
                  <Input
                    placeholder="请输入金额"
                    allowClear={!isCloseAccount}
                    disabled={isCloseAccount}
                    onChange={this.getFieldsValue.bind(this, 4)} />
                )}
              </Item>
            </Col>
            <Col span={6}>
              <Item label="大病医疗险基数">
                {getFieldDecorator('seriousMedicalInsurance', {
                  initialValue: seriousMedicalInsurance,
                  getValueFromEvent: (e: any) => {
                    e.persist()
                    return this.transformInputValue(e.target.value)
                  }
                })(
                  <Input
                    placeholder="请输入金额"
                    allowClear={!isCloseAccount}
                    disabled={isCloseAccount}
                    onChange={this.getFieldsValue.bind(this, 4)} />
                )}
              </Item>
            </Col>
            <Col span={6}>
              <Item label="补充医疗险基数">
                {getFieldDecorator('supplementaryMedicalInsurance', {
                  initialValue: supplementaryMedicalInsurance,
                  getValueFromEvent: (e: any) => {
                    e.persist()
                    return this.transformInputValue(e.target.value)
                  }
                })(
                  <Input
                    placeholder="请输入金额"
                    allowClear={!isCloseAccount}
                    disabled={isCloseAccount}
                    onChange={this.getFieldsValue.bind(this, 4)} />
                )}
              </Item>
            </Col>
            <Col span={6}>
              <Item label="公积金基数">
                {getFieldDecorator('publicReserveFunds', {
                  initialValue: publicReserveFunds,
                  rules: [{ required: true }],
                  getValueFromEvent: (e: any) => {
                    e.persist()
                    return this.transformInputValue(e.target.value)
                  }
                })(
                  <Input
                    placeholder="请输入金额"
                    allowClear={!isCloseAccount}
                    disabled={isCloseAccount}
                    onChange={this.getFieldsValue.bind(this, 4)} />
                )}
              </Item>
            </Col>
          </Row>
          <Row className="form_row">
            <Col span={6}>
              <Item label="补充公积金基数">
                {getFieldDecorator('supplementaryPublicReserveFunds', {
                  initialValue: supplementaryPublicReserveFunds,
                  getValueFromEvent: (e: any) => {
                    e.persist()
                    return this.transformInputValue(e.target.value)
                  }
                })(
                  <Input
                    placeholder="请输入金额"
                    allowClear={!isCloseAccount}
                    disabled={isCloseAccount}
                    onChange={this.getFieldsValue.bind(this, 5)} />
                )}
              </Item>
            </Col>
            <Col span={6}>
              <Item label="服务费">
                {getFieldDecorator('serve', {
                  initialValue: serve,
                  getValueFromEvent: (e: any) => {
                    e.persist()
                    return this.transformInputValue(e.target.value)
                  }
                })(
                  <Input
                    placeholder="请输入金额"
                    allowClear={!isCloseAccount}
                    disabled={isCloseAccount}
                    onChange={this.getFieldsValue.bind(this, 5)} />
                )}
              </Item>
            </Col>
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
          this.isAuthenticated(this.AuthorityList.personalInsured[15])
            ?
              <Row>
                <Button type="primary" className="ant_button_confirm" disabled={disabled || isCloseAccount} onClick={this.confirmAdd}>确定</Button>
                <Button className="ant_button_cancel" onClick={this.cancelAdd}>取消</Button>
              </Row>
            :
              <Row>
                <Button type="primary" className="ant_button_confirm" onClick={this.cancelAdd}>返回</Button>
              </Row>
        }
      </div>
    )
  }

  componentWillUnmount () {
    clearTimeout(this.maintainTimerId)
  }
}

const MaintainFormComponent = Form.create<BaseSupplementFormProps>()(MaintainForm)

// @hot(module)
export default class PersonalMaintainDetail extends RootComponent<BaseProps> {
  render () {
    return (
      <div id="personal_maintain_add">
        <MaintainFormComponent {...this.props} isSetInsuranceParams={false} />
      </div>
    )
  }
}
