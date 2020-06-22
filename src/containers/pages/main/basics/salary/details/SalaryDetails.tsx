/**
 * @author lixinying
 * @createTime 2019/04/09
 * @description 新增薪资
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import RootComponent from '@components/root/RootComponent'
import { SysUtil, FormatInputValue } from '@utils/index'
import { Form, Input, Divider, Row, Col, Button, Select, Collapse, Card } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { salaryCategory, Period } from '../Enum'
import { hot } from 'react-hot-loader'
import moment from 'moment'

import per1 from '@assets/images/share/entry/per1.png'
import per7 from '@assets/images/share/entry/per7.png'
import up from '@assets/images/main/salary/up_arrow.png'
import down from '@assets/images/main/salary/down_arrow.png'

import './SalaryDetails.styl'

import { BaseProps, KeyValue } from 'typings/global'

interface FormProps extends BaseProps, FormComponentProps {}
interface FormState {
  staffBaseInfo: { userInfo: KeyValue, [key: string]: any }
  levelList: KeyValue[] // 等级列表
  gradeList: KeyValue[] // 档级列表
  rankList: KeyValue[] // 层级列表
  historyList: KeyValue[] // 层级列表
  disabled: boolean
  collapsed: boolean
}

const toFixed = (n: string) => {
  n = n || '0'
  return parseFloat(n).toFixed(2)
}

const { Panel } = Collapse

const PanelHeader = (p: any) => {
  return (
    <div style={{ color: '#40A9FF', fontSize: '16Px', textAlign: 'center' }}>
      <p>历史设置</p>
      <img src={p.collapsed ? down : up} style={{ width: '17px', height: '14px', marginTop: '-12px' }} />
    </div>
  )
}

class FormComponent extends RootComponent<FormProps, FormState> {
  timerId: any = null
  staffBaseInfo: KeyValue = SysUtil.getSessionStorage('SalaryEdit') || {}
  isSjProject: boolean = true

  constructor (props: FormProps) {
    super(props)
    this.state = {
      staffBaseInfo: {
        userInfo: {}
      },
      levelList: [],
      gradeList: [],
      rankList: [],
      historyList: [],
      disabled: true,
      collapsed: true
    }
  }
  componentDidMount () {
    this.getStaffSalaryDetail()
  }
  getStaffSalaryDetail () {
    this.axios.request(this.api.salaryDetail, { id: this.staffBaseInfo.id })
      .then(({ data }) => {
        const { salaryInfo, hisInfoList } = data
        const list = data.levelList
        hisInfoList.forEach((item: any, i: number, arr: any) => {
          if (i > 0) item.peroid = `${moment(item.createTime).format('YYYYMM')}-${moment(arr[i - 1].createTime).format('YYYYMM')}`
        })
        hisInfoList.splice(0, 1)
        this.setState({
          // historyList: hisInfoList,
          staffBaseInfo: salaryInfo,
          levelList: list['薪资等级'] || [],
          gradeList: list['薪资档级'] || [],
          rankList: list['薪资层级'] || []
        })
        this.isSjProject = salaryInfo.userInfo.projectName === '上嘉'
        this.getFieldsValue()
      })
      .catch(({ msg }) => {
        this.$message.error(msg[0])
      })
  }
  transformInputValue = (value: string) => {
    return FormatInputValue.toFixed(value)
  }
  // 设定 button 按钮点击状态
  getFieldsValue = () => {
    if (this.timerId) clearTimeout(this.timerId)
    const { isSjProject } = this
    this.timerId = setTimeout(() => {
      const values = this.props.form.getFieldsValue()
      const { salaryType, salaryProbation, baseSalary, overtimeBase } = values
      const disabled = isSjProject ? !(salaryType && salaryProbation && baseSalary && overtimeBase) : !baseSalary
      this.setState({ disabled })
    }, 50)
  }
  handleSubmit = () => {
    const { userInfo: { projectName } } = this.staffBaseInfo
    const {
      salaryType, levelId = '', gradeId = '', rankId = '',
      probationBaseSalary = '', probationPerSalary = '', salaryProbation,
      baseSalary, performanceSalary = '', hierarchySalary = '', performanceBonus = '', otherSalary = '',
      postSalary = '', mealStandard = '', roomStandard = '', forkliftStandard = '', unionFee = '', overtimeBase = '',
      liabilityInsurance = '', manageFee = ''
    } = this.props.form.getFieldsValue()
    const params: KeyValue = {
      id: this.state.staffBaseInfo.id,
      projectName,
      salaryType: +salaryType,
      levelId,
      gradeId,
      rankId,
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
      overtimeBase: toFixed(overtimeBase)
    }
    for (const key of salaryCategory[projectName]) {
      delete params[key]
    }
    this.axios.request(this.api.salaryInfo, params)
      .then(() => {
        this.$message.success('保存成功，本月1号开始生效！', 2)
        SysUtil.clearSession('SalaryEdit')
        this.props.history.replace('/home/salaryPage')
      })
      .catch(({ msg }) => {
        this.$message.error(msg[0])
      })
  }
  collapsePanle = (k: any) => {
    this.setState({
      collapsed: !k.length
    })
  }
  cancel = () => {
    this.props.history.replace('/home/salaryPage')
  }
  render () {
    const { levelList, gradeList, rankList, staffBaseInfo, historyList, collapsed } = this.state
    const {
      salaryType, levelId, gradeId, rankId,
      probationBaseSalary, probationPerSalary, salaryProbation,
      baseSalary, performanceSalary, hierarchySalary, performanceBonus, otherSalary,
      postSalary, mealStandard, roomStandard, forkliftStandard, unionFee, overtimeBase, manageFee, liabilityInsurance,
      contractBaseSalary, contractProBaseSalary, tryMonth
    } = staffBaseInfo
    const { projectName, projectNumber, sjNumber, userName, organize, entity, roleType, typeName } = staffBaseInfo.userInfo
    const { form } = this.props
    const { getFieldDecorator } = form
    const isSjProject = projectName === '上嘉'
    const isHmProject = projectName === '盒马'
    const isWmProject = projectName === '物美'
    const gutter = isSjProject ? 6 : 8
    return (
      <div>
        <Row className="salary-add-label-title">
          <Col><img src={per1}/><span>个人信息</span></Col>
        </Row>
        <div style={{ marginLeft: 26 }}>
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
                    initialValue: (salaryType && (salaryType + '')) || '1',
                    rules: [{ required: true }]
                  })(
                    <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} disabled placeholder="请选择" onChange={this.getFieldsValue}>
                      <Select.Option value="1">计薪制</Select.Option>
                      <Select.Option value="2">计件制</Select.Option>
                    </Select>
                  )}
                </Form.Item>
                <Form.Item label="薪资等级" className="form_item salary_no-necessary">
                  {getFieldDecorator('levelId', {
                    initialValue: levelId
                  })(
                    <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} disabled placeholder="请选择" onChange={this.getFieldsValue}>
                      {levelList.map((item: KeyValue) => <Select.Option value={item.levelId} key={item.levelId}>{item.levelName}</Select.Option>)}
                    </Select>
                  )}
                </Form.Item>
                <Form.Item label="薪资档级" className="form_item salary_no-necessary">
                  {getFieldDecorator('gradeId', {
                    initialValue: gradeId
                  })(
                    <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} disabled placeholder="请选择" onChange={this.getFieldsValue}>
                      {gradeList.map((item: KeyValue) => <Select.Option value={item.levelId} key={item.levelId}>{item.levelName}</Select.Option>)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="薪资试用期" className="form_item salary_probation salart_form_label_right">
                  {getFieldDecorator('salaryProbation', {
                    initialValue: Period[salaryProbation] || '3'
                  })(
                    <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} disabled placeholder="请选择" onChange={this.getFieldsValue}>
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
                  contractProBaseSalary && !!salaryProbation &&
                  <Form.Item label="合同试用期基本工资" className="form_item">
                    {getFieldDecorator('contractProBaseSalary', {
                      initialValue: contractProBaseSalary,
                      rules: [{ required: true }],
                      getValueFromEvent: (e: any) => {
                        e.persist()
                        return this.transformInputValue(e.target.value)
                      }
                    })(
                      <Input placeholder="请输入金额" allowClear disabled onChange={() => this.getFieldsValue()} />
                    )}
                  </Form.Item>
                }
                {
                  probationBaseSalary && !!salaryProbation &&
                  <Form.Item label="试用期基本工资" className="form_item salart_form_label_right">
                    {getFieldDecorator('probationBaseSalary', {
                      initialValue: probationBaseSalary,
                      getValueFromEvent: (e: any) => {
                        e.persist()
                        return this.transformInputValue(e.target.value)
                      }
                    })(
                      <Input placeholder="请输入金额" allowClear onChange={this.getFieldsValue} disabled />
                    )}
                  </Form.Item>
                }
                {
                  probationPerSalary && !!salaryProbation &&
                  <Form.Item label="试用期绩效工资" className="form_item salart_form_label_right">
                    {getFieldDecorator('probationPerSalary', {
                      initialValue: probationPerSalary,
                      getValueFromEvent: (e: any) => {
                        e.persist()
                        return this.transformInputValue(e.target.value)
                      }
                    })(
                      <Input placeholder="请输入金额" allowClear disabled onChange={this.getFieldsValue} />
                    )}
                  </Form.Item>
                }
              </Col>
              <Col span={6}>
                <Form.Item className="form_item salary_no-necessary" label="基本工资">
                  {getFieldDecorator('baseSalary', {
                    initialValue: baseSalary || '0.00',
                    rules: [{ required: true }],
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear onChange={this.getFieldsValue} disabled />
                  )}
                </Form.Item>
                {
                  contractBaseSalary &&
                  <Form.Item className="form_item salary_no-necessary" label="合同基本工资">
                    {getFieldDecorator('contractBaseSalary', {
                      initialValue: contractBaseSalary,
                      rules: [{ required: true }],
                      getValueFromEvent: (e: any) => {
                        e.persist()
                        return this.transformInputValue(e.target.value)
                      }
                    })(
                      <Input placeholder="请输入金额" allowClear disabled onChange={() => this.getFieldsValue()} />
                    )}
                  </Form.Item>
                }
                <Form.Item className="form_item salary_no-necessary" label="绩效工资">
                  {getFieldDecorator('performanceSalary', {
                    initialValue: performanceSalary || '0.00',
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear disabled onChange={this.getFieldsValue} />
                  )}
                </Form.Item>
                <Form.Item className="form_item salary_no-necessary" label="绩效奖金">
                  {getFieldDecorator('performanceBonus', {
                    initialValue: performanceBonus || '0.00',
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear disabled onChange={this.getFieldsValue} />
                  )}
                </Form.Item>
                <Form.Item className="form_item salary_no-necessary" label="其他工资">
                  {getFieldDecorator('otherSalary', {
                    initialValue: otherSalary || '0.00',
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear disabled onChange={this.getFieldsValue} />
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item className="form_item salary_no-necessary" label="岗位津贴">
                  {getFieldDecorator('postSalary', {
                    initialValue: postSalary || '0.00',
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear disabled onChange={this.getFieldsValue} />
                  )}
                </Form.Item>
                <Form.Item className="form_item salary_no-necessary" label="餐补标准">
                  {getFieldDecorator('mealStandard', {
                    initialValue: mealStandard || '0.00',
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear disabled onChange={this.getFieldsValue} />
                  )}
                </Form.Item>
                <Form.Item className="form_item salary_no-necessary" label="房补标准">
                  {getFieldDecorator('roomStandard', {
                    initialValue: roomStandard || '0.00',
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear disabled onChange={this.getFieldsValue} />
                  )}
                </Form.Item>
                <Form.Item className="form_item salary_no-necessary" label="叉车标准">
                  {getFieldDecorator('forkliftStandard', {
                    initialValue: forkliftStandard || '0.00',
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear disabled onChange={this.getFieldsValue} />
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
                    <Input placeholder="请输入金额" allowClear disabled onChange={this.getFieldsValue} />
                  )}
                </Form.Item>
                <Form.Item className="form_item salary_no-necessary" label="加班基数">
                  {getFieldDecorator('overtimeBase', {
                    initialValue: overtimeBase || baseSalary || '0.00',
                    rules: [{ required: true }],
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear disabled onChange={this.getFieldsValue} />
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
                    <Input placeholder="请输入金额" allowClear disabled onChange={this.getFieldsValue} />
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
                    <Input placeholder="请输入金额" allowClear disabled onChange={this.getFieldsValue} />
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
                    <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} disabled placeholder="请选择" onChange={this.getFieldsValue}>
                      {rankList.map((item: KeyValue) => <Select.Option value={item.levelId} key={item.levelId}>{item.levelName}</Select.Option>)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="试用期基本工资" className="form_item">
                  {getFieldDecorator('probationBaseSalary', {
                    initialValue: probationBaseSalary || '0.00',
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear disabled onChange={this.getFieldsValue} />
                  )}
                </Form.Item>
                <Form.Item label="试用期绩效工资" className="form_item">
                  {getFieldDecorator('probationPerSalary', {
                    initialValue: probationPerSalary || '0.00',
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear disabled onChange={this.getFieldsValue} />
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item className="form_item salary_no-necessary" label="基本工资">
                  {getFieldDecorator('baseSalary', {
                    initialValue: baseSalary || '0.00',
                    rules: [{ required: true }],
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear disabled onChange={this.getFieldsValue} />
                  )}
                </Form.Item>
                <Form.Item className="form_item salary_no-necessary" label="绩效工资">
                  {getFieldDecorator('performanceSalary', {
                    initialValue: performanceSalary || '0.00',
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear disabled onChange={this.getFieldsValue} />
                  )}
                </Form.Item>
                <Form.Item className="form_item salary_no-necessary" label="层级工资">
                  {getFieldDecorator('hierarchySalary', {
                    initialValue: hierarchySalary || '0.00',
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear disabled onChange={this.getFieldsValue} />
                  )}
                </Form.Item>
                <Form.Item className="form_item salary_no-necessary" label="绩效奖金">
                  {getFieldDecorator('performanceBonus', {
                    initialValue: performanceBonus || '0.00',
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear disabled onChange={this.getFieldsValue} />
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
                    initialValue: baseSalary || '0.00',
                    rules: [{ required: true }],
                    getValueFromEvent: (e: any) => {
                      e.persist()
                      return this.transformInputValue(e.target.value)
                    }
                  })(
                    <Input placeholder="请输入金额" allowClear disabled onChange={this.getFieldsValue} />
                  )}
                </Form.Item>
              </Col>
            </Row>
          }
        </Form>
        <Divider style={{ height: 1, marginTop: 10, marginBottom: 40 }} />
        {
          /* eslint-disable */
          // this.isAuthenticated(this.AuthorityList.salary[3])
          //   ?
          //     <div>
          //       <Button type="primary" className="ant_button_confirm" disabled={this.state.disabled} onClick={() => this.preventMoreClick(this.handleSubmit)}>保存</Button>
          //       <Button className="ant_button_cancel" onClick={this.cancel}>取消</Button>
          //     </div>
          //   :
              <Button type="primary" className="ant_button_confirm" onClick={this.cancel}>返回</Button>
        }
        {
          !!historyList.length &&
          <Collapse bordered={false} onChange={this.collapsePanle}>
            <Panel key="1" showArrow={false} header={<PanelHeader collapsed={collapsed} />}>
              {
                historyList.map((item: any, i: number) => {
                  const {
                    peroid,
                    salaryType, levelId, gradeId, rankId,
                    probationBaseSalary, probationPerSalary, salaryProbation,
                    baseSalary, performanceSalary, hierarchySalary, performanceBonus, otherSalary,
                    mealStandard, roomStandard, forkliftStandard, unionFee, overtimeBase, postSalary, liabilityInsurance, manageFee
                  } = item
                  const tilte = `有效日期 ${peroid}`
                  return (
                    <Card title={tilte} key={i}>
                      <Row>
                        {
                          (isSjProject || isHmProject) &&
                          <Col span={gutter}>
                            {
                              isSjProject &&
                              <Row type="flex" align="middle">
                                <Col>计薪类型：</Col>
                                <Col>{(salaryType === 1 ? '计薪制' : '计件制') || '计薪制'}</Col>
                              </Row>
                            }
                            {
                              isSjProject &&
                              <Row type="flex" align="middle">
                                <Col>薪资等级：</Col>
                                <Col>{levelId || '- - -'}</Col>
                              </Row>
                            }
                            {
                              isSjProject &&
                              <Row type="flex" align="middle">
                                <Col>薪资档级：</Col>
                                <Col>{gradeId || '- - -'}</Col>
                              </Row>
                            }
                            {
                              isHmProject &&
                              <Row type="flex" align="middle">
                                <Col>薪资层级：</Col>
                                <Col>{rankId || '- - -'}</Col>
                              </Row>
                            }
                          </Col>
                        }
                        {
                          (isSjProject || isHmProject) &&
                          <Col span={gutter}>
                            {
                              (isSjProject || isHmProject) &&
                              <Row type="flex" align="middle">
                                <Col style={{ minWidth: '120px', textAlign: 'right' }}>试用期基本薪资：</Col>
                                <Col>{probationBaseSalary || '0.00'}</Col>
                              </Row>
                            }
                            {
                              (isSjProject || isHmProject) &&
                              <Row type="flex" align="middle">
                                <Col style={{ minWidth: '120px', textAlign: 'right' }}>试用期绩效工资：</Col>
                                <Col>{probationPerSalary || '0.00'}</Col>
                              </Row>
                            }
                            {
                              isSjProject &&
                              <Row type="flex" align="middle">
                                <Col style={{ minWidth: '120px', textAlign: 'right' }}>薪资试用期：</Col>
                                <Col>{(salaryProbation && Period[salaryProbation]) || '3个月'}</Col>
                              </Row>
                            }
                          </Col>
                        }
                        <Col span={gutter}>
                          <Row type="flex" align="middle">
                            <Col>基本工资：</Col>
                            <Col>{baseSalary || '0.00'}</Col>
                          </Row>
                          {
                            (isSjProject || isHmProject) &&
                            <Row type="flex" align="middle">
                              <Col>绩效工资：</Col>
                              <Col>{performanceSalary || '0.00'}</Col>
                            </Row>
                          }
                          {
                            isHmProject &&
                            <Row type="flex" align="middle">
                              <Col>层级工资：</Col>
                              <Col>{hierarchySalary || '0.00'}</Col>
                            </Row>
                          }
                          {
                            (isSjProject || isHmProject) &&
                            <Row type="flex" align="middle">
                              <Col>绩效奖金：</Col>
                              <Col>{performanceBonus || '0.00'}</Col>
                            </Row>
                          }
                          {
                            isSjProject &&
                            <Row type="flex" align="middle">
                              <Col>其他工资：</Col>
                              <Col>{otherSalary || '0.00'}</Col>
                            </Row>
                          }
                        </Col>
                        {
                          isSjProject &&
                          <Col span={6}>
                            <Row type="flex" align="middle">
                              <Col style={{ minWidth: '75px', textAlign: 'right' }}>餐补标准：</Col>
                            <Col>{mealStandard || '0.00'}</Col>
                            </Row>
                            <Row type="flex" align="middle">
                              <Col style={{ minWidth: '75px', textAlign: 'right' }}>房补标准：</Col>
                            <Col>{roomStandard || '0.00'}</Col>
                            </Row>
                            <Row type="flex" align="middle">
                              <Col style={{ minWidth: '75px', textAlign: 'right' }}>叉车标准：</Col>
                            <Col>{forkliftStandard || '0.00'}</Col>
                            </Row>
                            <Row type="flex" align="middle">
                              <Col style={{ minWidth: '75px', textAlign: 'right' }}>工会费：</Col>
                            <Col>{unionFee || '0.00'}</Col>
                            </Row>
                            <Row type="flex" align="middle">
                              <Col style={{ minWidth: '75px', textAlign: 'right' }}>加班基数：</Col>
                            <Col>{overtimeBase || '0.00'}</Col>
                            </Row>
                            <Row type="flex" align="middle">
                              <Col style={{ minWidth: '75px', textAlign: 'right' }}>雇主责任险：</Col>
                            <Col>{liabilityInsurance || '0.00'}</Col>
                            </Row>
                            <Row type="flex" align="middle">
                              <Col style={{ minWidth: '75px', textAlign: 'right' }}>管理费：</Col>
                            <Col>{manageFee || '0.00'}</Col>
                            </Row>
                            <Row type="flex" align="middle">
                              <Col style={{ minWidth: '75px', textAlign: 'right' }}>岗位津贴：</Col>
                            <Col>{postSalary || '0.00'}</Col>
                            </Row>
                          </Col>
                        }
                      </Row>
                    </Card>
                  )
                })
              }
            </Panel>
          </Collapse>
        }
      </div>
    )
  }
  componentWillUnmount () {
    clearTimeout(this.timerId)
    this.setState = (state, callback) => {}
  }
}

@hot(module)
export default class EntryAdd extends RootComponent<BaseProps> {
  render () {
    const CustomForm = Form.create<FormProps>()(FormComponent)
    return (
      <div id="staff_salary_add">
        <CustomForm {...this.props} />
      </div>
    )
  }
}
