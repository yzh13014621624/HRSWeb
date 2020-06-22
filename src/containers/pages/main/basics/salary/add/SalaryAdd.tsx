/**
 * @author lixinying
 * @createTime 2019/04/08
 * @lastEditTim 2019/04/10
 * @description 新增
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import RootComponent from '@components/root/RootComponent'
import { Prompt } from 'react-router-dom'
import { Form, Input, Divider, Row, Col, Button, Select } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { hot } from 'react-hot-loader'

import { SysUtil, FormatInputValue } from '@utils/index'

import per1 from '@assets/images/share/entry/per1.png'
import per7 from '@assets/images/share/entry/per7.png'

import './SalaryAdd.styl'

import { BaseProps, KeyValue } from 'typings/global'

import { salaryCategory } from '../Enum'

interface FormProps extends BaseProps, FormComponentProps {
  levelList: {
    '薪资等级'?: KeyValue[]
    '薪资档级'?: KeyValue[]
    '薪资层级'?: KeyValue[]
  }
  userId: number
  isSjProject: boolean
  projectName: string
}
interface FormState {
  disabled: boolean
  salaryInfo: KeyValue
  levelList: KeyValue[] // 等级列表
  gradeList: KeyValue[] // 档级列表
  rankList: KeyValue[] // 层级列表
  contractSalary: boolean
}

const toFixed = (n: string) => {
  n = n || '0'
  return parseFloat(n).toFixed(2)
}

class FormComponent extends RootComponent<FormProps, FormState> {
  timerId: any = null

  constructor (props: FormProps) {
    super(props)
    const { levelList } = props
    this.state = {
      disabled: true,
      salaryInfo: (SysUtil.getLocalStorage('SalaryAddInfo') && SysUtil.getLocalStorage('SalaryAddInfo')[this.props.userId]) || {},
      levelList: levelList['薪资等级'] || [],
      gradeList: levelList['薪资档级'] || [],
      rankList: levelList['薪资层级'] || [],
      contractSalary: false
    }
  }
  componentDidMount () {
    this.getFieldsValue(1)
  }

  transformInputValue = (value: string) => {
    return FormatInputValue.toFixed(value)
  }
  // 设定 button 按钮点击状态
  getFieldsValue = (t?: number) => {
    if (this.timerId) clearTimeout(this.timerId)
    this.timerId = setTimeout(() => {
      const { projectName, form: { getFieldsValue, setFieldsValue }, elcCompanys } = this.props
      const isSjProject = projectName === '上嘉'
      const values = getFieldsValue()
      const { salaryType, salaryProbation, baseSalary, overtimeBase, contractProBaseSalary, contractBaseSalary } = values
      let disabled = isSjProject ? !(salaryType && salaryProbation && baseSalary && overtimeBase) : !baseSalary
      // if (isSjProject && !!t) setFieldsValue({ overtimeBase: baseSalary })
      if (salaryProbation === '0') {
        if (elcCompanys && !disabled) {
          disabled = !(contractBaseSalary)
        }
        this.setState({ contractSalary: false })
      } else {
        if (elcCompanys && !disabled) {
          disabled = !(contractProBaseSalary && contractBaseSalary)
        }
        this.setState({ contractSalary: true })
      }
      // 监听薪资试用期控制合同基本工资是否显示
      if (t !== 1) {
        SysUtil.setLocalStorage('SalaryAddInfo', { [this.props.userId]: values })
      }
      this.setState({ disabled })
    }, 50)
  }
  handleSubmit = () => {
    const { projectName, elcCompanys } = this.props
    const { contractSalary } = this.state
    const {
      salaryType, levelId = '', gradeId = '', rankId = '',
      probationBaseSalary = '', probationPerSalary = '', salaryProbation, contractProBaseSalary,
      baseSalary, performanceSalary = '', hierarchySalary = '', performanceBonus = '', otherSalary = '', contractBaseSalary,
      postSalary = '', mealStandard = '', roomStandard = '', forkliftStandard = '', unionFee = '', overtimeBase = '',
      liabilityInsurance = '', manageFee = ''
    } = this.props.form.getFieldsValue()
    const params: KeyValue = {
      projectName,
      salaryType: +salaryType,
      userId: this.props.userId,
      levelId,
      gradeId,
      rankId,
      contractProBaseSalary: toFixed(contractProBaseSalary),
      contractBaseSalary: toFixed(contractBaseSalary),
      probationBaseSalary: toFixed(probationBaseSalary),
      probationPerSalary: toFixed(probationPerSalary),
      salaryProbation: +salaryProbation,
      baseSalary: toFixed(baseSalary),
      performanceSalary: toFixed(performanceSalary),
      hierarchySalary: toFixed(hierarchySalary),
      performanceBonus: toFixed(performanceBonus),
      otherSalary: toFixed(otherSalary),
      postSalary: toFixed(postSalary),
      mealStandard: toFixed(mealStandard),
      roomStandard: toFixed(roomStandard),
      forkliftStandard: toFixed(forkliftStandard),
      unionFee: toFixed(unionFee),
      liabilityInsurance: toFixed(liabilityInsurance),
      manageFee: toFixed(manageFee),
      overtimeBase: toFixed(overtimeBase),
      elcCompanys
    }
    if (!elcCompanys) {
      delete params['contractProBaseSalary']
      delete params['contractBaseSalary']
    }
    if (!contractSalary) {
      delete params['probationBaseSalary']
      delete params['contractProBaseSalary']
      delete params['probationPerSalary']
    }
    for (const key of salaryCategory[projectName]) {
      delete params[key]
    }
    this.axios.request(this.api.salaryInsert, params)
      .then(() => {
        const { userId } = this.props
        this.$message.success('新增成功', 2)
        const SalaryAddInfo = SysUtil.getLocalStorage('SalaryAddInfo')
        delete SalaryAddInfo[userId]
        if (!Object.keys(SalaryAddInfo).length) SysUtil.clearLocalStorage('SalaryAddInfo')
        else SysUtil.setLocalStorage('SalaryAddInfo', SalaryAddInfo)
        SysUtil.clearSession('SalaryAdd')
        this.props.history.replace('/home/salaryPage')
      })
      .catch(({ msg }) => {
        this.$message.error(msg[0])
      })
  }
  cancel = () => {
    this.props.history.replace('/home/salaryPage')
  }
  render () {
    const { levelList, gradeList, rankList, contractSalary } = this.state
    const { userId, form, projectName, elcCompanys, tryMonth } = this.props
    const { getFieldDecorator } = form
    const {
      salaryType = '1', levelId, gradeId, rankId,
      probationBaseSalary, probationPerSalary, salaryProbation = '3', contractProBaseSalary,
      baseSalary, performanceSalary, hierarchySalary, performanceBonus, otherSalary, contractBaseSalary,
      postSalary, mealStandard, roomStandard, forkliftStandard, unionFee, overtimeBase, liabilityInsurance, manageFee
    } = this.state.salaryInfo
    const isSjProject = projectName === '上嘉'
    const isHmProject = projectName === '盒马'
    const isWmProject = projectName === '物美'
    return (
      <div>
        <Row className="salary-add-label-title">
          <Col><img src={per7}/><span>薪资信息</span></Col>
        </Row>
        <Form layout="inline">
          {
            isSjProject &&
            <Row type="flex">
              <Col span={6}>
                <Form.Item label="计薪类型" className="form_item salary_no-necessary">
                  {getFieldDecorator('salaryType', {
                    initialValue: salaryType,
                    rules: [{ required: true }]
                  })(
                    <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" onChange={this.getFieldsValue}>
                      <Select.Option value="1">计薪制</Select.Option>
                      <Select.Option value="2">计件制</Select.Option>
                    </Select>
                  )}
                </Form.Item>
                <Form.Item label="薪资等级" className="form_item salary_no-necessary">
                  {getFieldDecorator('levelId', {
                    initialValue: levelId
                  })(
                    <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" onChange={this.getFieldsValue}>
                      {levelList.map((item: KeyValue) => <Select.Option value={item.levelId} key={item.levelId}>{item.levelName}</Select.Option>)}
                    </Select>
                  )}
                </Form.Item>
                <Form.Item label="薪资档级" className="form_item salary_no-necessary">
                  {getFieldDecorator('gradeId', {
                    initialValue: gradeId
                  })(
                    <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" onChange={this.getFieldsValue}>
                      {gradeList.map((item: KeyValue) => <Select.Option value={item.levelId} key={item.levelId}>{item.levelName}</Select.Option>)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="薪资试用期" className="form_item salary_probation salart_form_label_right">
                  {getFieldDecorator('salaryProbation', {
                    initialValue: tryMonth > 2 ? salaryProbation : undefined,
                    rules: [{ required: true }]
                  })(
                    <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" onChange={this.getFieldsValue}>
                      <Select.Option value="0">无试用期</Select.Option>
                      {tryMonth > 0 && <Select.Option value="1">1个月</Select.Option>}
                      {tryMonth > 1 && <Select.Option value="2">2个月</Select.Option>}
                      {tryMonth > 2 && <Select.Option value="3">3个月</Select.Option>}
                      {tryMonth > 3 && <Select.Option value="4">4个月</Select.Option>}
                      {tryMonth > 4 && <Select.Option value="5">5个月</Select.Option>}
                      {tryMonth > 5 && <Select.Option value="6">6个月</Select.Option>}
                    </Select>
                  )}
                </Form.Item>
                {
                  !!elcCompanys && contractSalary &&
                  <Form.Item label="合同试用期基本工资" className="form_item">
                    {getFieldDecorator('contractProBaseSalary', {
                      initialValue: contractProBaseSalary,
                      rules: [{ required: true }],
                      getValueFromEvent: (e: any) => {
                        e.persist()
                        return this.transformInputValue(e.target.value)
                      }
                    })(
                      <Input placeholder="请输入金额" allowClear onChange={() => this.getFieldsValue()} />
                    )}
                  </Form.Item>
                }
                {
                  contractSalary &&
                  <Form.Item label="试用期基本工资" className="form_item salart_form_label_right">
                    {getFieldDecorator('probationBaseSalary', {
                      initialValue: probationBaseSalary,
                      getValueFromEvent: (e: any) => {
                        e.persist()
                        return this.transformInputValue(e.target.value)
                      }
                    })(
                      <Input placeholder="请输入金额" allowClear onChange={() => this.getFieldsValue()} />
                    )}
                  </Form.Item>
                }
                {
                  contractSalary &&
                  <Form.Item label="试用期绩效工资" className="form_item salart_form_label_right">
                    {getFieldDecorator('probationPerSalary', {
                      initialValue: probationPerSalary,
                      getValueFromEvent: (e: any) => {
                        e.persist()
                        return this.transformInputValue(e.target.value)
                      }
                    })(
                      <Input placeholder="请输入金额" allowClear onChange={() => this.getFieldsValue()} />
                    )}
                  </Form.Item>
                }
              </Col>
              <Col span={6}>
                <Form.Item className="form_item salary_no-necessary" label="基本工资">
                  {getFieldDecorator('baseSalary', {
                    initialValue: baseSalary,
                    rules: [{ required: true }],
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear onChange={() => this.getFieldsValue()} />
                  )}
                </Form.Item>
                { !!elcCompanys &&
                <Form.Item className="form_item salary_no-necessary" label="合同基本工资">
                  {getFieldDecorator('contractBaseSalary', {
                    initialValue: contractBaseSalary,
                    rules: [{ required: true }],
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear onChange={() => this.getFieldsValue()} />
                  )}
                </Form.Item>}
                <Form.Item className="form_item salary_no-necessary" label="绩效工资">
                  {getFieldDecorator('performanceSalary', {
                    initialValue: performanceSalary,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear onChange={() => this.getFieldsValue()} />
                  )}
                </Form.Item>
                <Form.Item className="form_item salary_no-necessary" label="绩效奖金">
                  {getFieldDecorator('performanceBonus', {
                    initialValue: performanceBonus,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear onChange={() => this.getFieldsValue()} />
                  )}
                </Form.Item>
                <Form.Item className="form_item salary_no-necessary" label="其他工资">
                  {getFieldDecorator('otherSalary', {
                    initialValue: otherSalary,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear onChange={() => this.getFieldsValue()} />
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item className="form_item salary_no-necessary" label="岗位津贴">
                  {getFieldDecorator('postSalary', {
                    initialValue: postSalary,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear onChange={() => this.getFieldsValue()} />
                  )}
                </Form.Item>
                <Form.Item className="form_item salary_no-necessary" label="餐补标准">
                  {getFieldDecorator('mealStandard', {
                    initialValue: mealStandard,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear onChange={() => this.getFieldsValue()} />
                  )}
                </Form.Item>
                <Form.Item className="form_item salary_no-necessary" label="房补标准">
                  {getFieldDecorator('roomStandard', {
                    initialValue: roomStandard,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear onChange={() => this.getFieldsValue()} />
                  )}
                </Form.Item>
                <Form.Item className="form_item salary_no-necessary" label="叉车标准">
                  {getFieldDecorator('forkliftStandard', {
                    initialValue: forkliftStandard,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear onChange={() => this.getFieldsValue()} />
                  )}
                </Form.Item>
                <Form.Item className="form_item salary_no-necessary" label="工会费">
                  {getFieldDecorator('unionFee', {
                    initialValue: unionFee || '0.00',
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear onChange={() => this.getFieldsValue()} />
                  )}
                </Form.Item>
                <Form.Item className="form_item salary_no-necessary" label="加班基数">
                  {getFieldDecorator('overtimeBase', {
                    initialValue: overtimeBase || baseSalary,
                    rules: [{ required: true }],
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear onChange={() => this.getFieldsValue()} />
                  )}
                </Form.Item>
                <Form.Item className="form_item salary_no-necessary" label="雇主责任险">
                  {getFieldDecorator('liabilityInsurance', {
                    initialValue: liabilityInsurance || '0.00',
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear onChange={() => this.getFieldsValue()} />
                  )}
                </Form.Item>
                <Form.Item className="form_item salary_no-necessary" label="管理费">
                  {getFieldDecorator('manageFee', {
                    initialValue: manageFee || '0.00',
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear onChange={() => this.getFieldsValue()} />
                  )}
                </Form.Item>
              </Col>
            </Row>
          }
          {
            isHmProject &&
            <Row type="flex">
              <Col span={8}>
                <Form.Item label="薪资层级" className="form_item salary_no-necessary">
                  {getFieldDecorator('rankId', {
                    initialValue: rankId
                  })(
                    <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" onChange={this.getFieldsValue}>
                      {rankList.map((item: KeyValue) => <Select.Option value={item.levelId} key={item.levelId}>{item.levelName}</Select.Option>)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="试用期基本工资" className="form_item">
                  {getFieldDecorator('probationBaseSalary', {
                    initialValue: probationBaseSalary,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear onChange={() => this.getFieldsValue()} />
                  )}
                </Form.Item>
                <Form.Item label="试用期绩效工资" className="form_item">
                  {getFieldDecorator('probationPerSalary', {
                    initialValue: probationPerSalary,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear onChange={() => this.getFieldsValue()} />
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item className="form_item salary_no-necessary" label="基本工资">
                  {getFieldDecorator('baseSalary', {
                    initialValue: baseSalary,
                    rules: [{ required: true }],
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear onChange={() => this.getFieldsValue(1)} />
                  )}
                </Form.Item>
                <Form.Item className="form_item salary_no-necessary" label="绩效工资">
                  {getFieldDecorator('performanceSalary', {
                    initialValue: performanceSalary,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear onChange={() => this.getFieldsValue()} />
                  )}
                </Form.Item>
                <Form.Item className="form_item salary_no-necessary" label="层级工资">
                  {getFieldDecorator('hierarchySalary', {
                    initialValue: hierarchySalary,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear onChange={() => this.getFieldsValue()} />
                  )}
                </Form.Item>
                <Form.Item className="form_item salary_no-necessary" label="绩效奖金">
                  {getFieldDecorator('performanceBonus', {
                    initialValue: performanceBonus,
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear onChange={() => this.getFieldsValue()} />
                  )}
                </Form.Item>
              </Col>
            </Row>
          }
          {
            isWmProject &&
            <Row type="flex">
              <Col span={8}>
                <Form.Item className="form_item salary_no-necessary" label="基本工资">
                  {getFieldDecorator('baseSalary', {
                    initialValue: baseSalary,
                    rules: [{ required: true }],
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear onChange={() => this.getFieldsValue(1)} />
                  )}
                </Form.Item>
              </Col>
            </Row>
          }
        </Form>
        <Divider style={{ height: 1, marginTop: 10, marginBottom: 40 }} />
        <Button type="primary" className="ant_button_confirm" disabled={this.state.disabled} onClick={() => this.preventMoreClick(this.handleSubmit)}>确定</Button>
        <Button className="ant_button_cancel" onClick={this.cancel}>取消</Button>
        <Prompt when message={`SalaryAddInfo-${userId}`} />
      </div>
    )
  }
  componentWillUnmount () {
    clearTimeout(this.timerId)
    this.setState = (state, callback) => {}
  }
}

@hot(module)
export default class EntryAdd extends RootComponent<BaseProps, any> {
  staffBaseInfo: KeyValue = SysUtil.getSessionStorage('SalaryAdd') || {}

  constructor (props: BaseProps) {
    super(props)
    this.state = {
      staffBaseInfo: {},
      levelList: {
        '薪资等级': [],
        '薪资档级': [],
        '薪资层级': []
      }
    }
  }
  componentDidMount () {
    this.getStaffSalaryDetail()
  }
  getStaffSalaryDetail () {
    this.axios.request(this.api.salaryPageInsert, { userId: this.staffBaseInfo.userId })
      .then(({ data }) => {
        this.setState({
          staffBaseInfo: data,
          levelList: data.levelList
        })
      })
      .catch(({ msg }) => {
        this.$message.error(msg[0])
      })
  }
  render () {
    const {
      projectName, projectNumber, sjNumber, userName, organize, entity, roleType, typeName, userId, elcCompanys, tryMonth
    } = this.state.staffBaseInfo
    const isSjProject = projectName === '上嘉'
    const CustomForm = Form.create<FormProps>()(FormComponent)
    return (
      <div id="staff_salary_add">
        <Row className="salary-add-label-title">
          <Col><img src={per1}/><span>个人信息</span></Col>
        </Row>
        <div style={{ marginLeft: 26, marginTop: 22, marginBottom: 30 }}>
          <Row style={{ marginBottom: 22 }}>
            <Col span={6}>项目：{projectName}</Col>
            <Col span={6}>工号：{projectNumber || '---'}</Col>
            <Col span={6}>管理编号：{sjNumber}</Col>
            <Col span={6}>姓名：{userName}</Col>
          </Row>
          <Row>
            <Col span={6}>组织：{organize}</Col>
            <Col span={6}>法人主体：{entity}</Col>
            <Col span={6}>员工类型：{roleType}</Col>
            <Col span={6}>合同类型：{typeName}</Col>
          </Row>
        </div>
        <Divider style={{ height: 1, marginTop: 30, marginBottom: 30 }} />
        <CustomForm {...this.props} levelList={this.state.levelList} userId={userId} elcCompanys={elcCompanys} isSjProject={isSjProject} projectName={projectName} tryMonth={tryMonth} />
      </div>
    )
  }
}
