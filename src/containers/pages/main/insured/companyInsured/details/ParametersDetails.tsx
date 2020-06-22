/**
 * @author lixinying
 * @createTime 2019/04/13
 * @lastEditTim 2019/04/13
 * @description 参保管理 - 公司维护 - 详情
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent } from '@components/index'
import SysUtil from '@utils/SysUtil'
import { Button, Table, Form, Input, Row, Col, Select, DatePicker } from 'antd'
import { hot } from 'react-hot-loader'

import moment from 'moment'

import { dateList } from '../data'

import '../style/ParametersAdd'

import { FormComponentProps } from 'antd/lib/form'
import { BaseProps, KeyValue } from 'typings/global'

interface FormProps extends BaseProps, FormComponentProps {}

interface FormState {
  companyParams: KeyValue
  // initilaTakeEffectTime: string
  disabled: boolean
  projectList: KeyValue[]
  entityList: KeyValue[]
  cityList: KeyValue[]
  standardList: KeyValue[]
}

@hot(module)
class StandardAdd extends RootComponent<FormProps, FormState> {
  timerId: any = null

  constructor (props:any) {
    super(props)
    this.state = {
      companyParams: {},
      // initilaTakeEffectTime: '',
      disabled: true,
      projectList: [],
      entityList: [],
      cityList: [],
      standardList: []
    }
  }

  componentDidMount () {
    this.getInitialList()
  }

  async getInitialList () {
    let projectId = -1
    let entityId = -1
    let companyParams: any = {}
    const { id = '' } = SysUtil.getSessionStorage('ParametersDetail') || {}
    const { companyMaintainInfo, companyInsuredProjectList, companyInsuredEntityList, queryCityList, queryInsuredList } = this.api
    await this.axios.request(companyMaintainInfo, { id })
      .then(({ data }) => {
        // this.setState({
        //   companyParams: data
        //   // initilaTakeEffectTime: data.takeEffectTime
        // })
        companyParams = data
        projectId = data.projectId
        entityId = data.entityId
      })
      .catch(({ msg }) => {
        this.$message.error(msg[0])
      })
    const promise = [companyInsuredProjectList, companyInsuredEntityList, queryCityList, queryInsuredList].map((api, i: number) => {
      if (i === 1) return this.axios.request(api, { projectArr: [projectId] })
      return this.axios.request(api)
    })
    Promise.all(promise)
      .then(async ([projectList, entityList, cityList, standardList]: KeyValue[]) => {
        const projectItem = projectList.data.find((item: any) => item.projectId === projectId) || {}
        const entityItem = entityList.data.find((item: any) => item.entityId === entityId) || {}
        companyParams.projectName = projectItem.projectName
        companyParams.entityName = entityItem.entity
        await this.setState({
          projectList: projectList.data,
          entityList: entityList.data,
          cityList: cityList.data,
          standardList: standardList.data,
          companyParams
        })
        this.getFieldsValue(0)
      })
      .catch(({ msg }) => {
        this.$message.error(msg[0])
      })
  }

  // 根据项目名称获取法人主体列表
  getEntityListByProjectId (projectId: number) {
    this.axios.request(this.api.companyInsuredEntityList, { projectArr: [projectId] })
      .then(async ({ data }) => {
        this.state.companyParams.entityId = undefined
        await this.setState({
          entityList: data,
          companyParams: this.state.companyParams
        })
        this.getFieldsValue(0)
      })
  }

  // 设定 button 按钮点击状态
  getFieldsValue = (t: number) => {
    if (this.timerId) clearTimeout(this.timerId)
    this.timerId = setTimeout(() => {
      const fieldsValue = this.props.form.getFieldsValue()
      const {
        projectId, entityId, insuredCityId, insuranceStandardsId, startRuleTime, takeEffectTime
      } = fieldsValue
      const disabled = !(
        insuredCityId && insuranceStandardsId && startRuleTime
      )
      this.setState({
        disabled
      })
      if (t > 0) {
        if (t === 2) this.getEntityListByProjectId(projectId)
        SysUtil.setLocalStorage('CompanyParamsAdd', fieldsValue)
      } else {
        console.log('初始化表单数据')
      }
    }, 50)
  }

  // 提交事件
  handleSubmit = () => {
    const { id } = SysUtil.getSessionStorage('ParametersDetail')
    const params = this.props.form.getFieldsValue()
    const { companyParams: { projectId, entityId } } = this.state
    // const effectTime = moment(params.takeEffectTime).format('YYYY-MM-DD')
    // const [effectY, effectM, effectD] = effectTime.split('-')
    // if (Number(effectD) > 1) {
    //   this.$message.warn('生效日期仅能选择每月1日', 2)
    //   return
    // }
    // params.takeEffectTime = effectTime
    params.endRuleTime = params.startRuleTime
    params.id = id
    params.projectId = projectId
    params.entityId = entityId
    // params.pastTakeEffectTime = moment(this.state.initilaTakeEffectTime).format('YYYY-MM-DD')
    this.axios.request(this.api.companyMaintainUpdate, params)
      .then(() => {
        this.$message.success('保存成功！本月1号开始生效。')
        SysUtil.clearLocalStorage('ParametersDetail')
        this.props.history.replace('/home/companyInsured')
      })
      .catch(({ msg }) => {
        this.$message.error(msg[0])
      })
  }

  cancelAdd = () => {
    this.props.history.replace('/home/companyInsured')
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { companyParams, disabled, projectList, entityList, cityList, standardList } = this.state
    const {
      isCloseAccount,
      projectId, projectName, entityId, entityName, insuredCityId, insuranceStandardsId,
      startRuleTime, endRuleTime, takeEffectTime, createTime, updateTime
    } = companyParams
    const closed = isCloseAccount > 0
    return (
      <div id="company_add_container">
        <Form layout="inline" className="entry-add-from " onSubmit={this.handleSubmit}>
          <Row className="entry-add-label-title">
            <Col>公司参保维护{closed && <span>(本月已关账，不能修改)</span>}</Col>
          </Row>
          <div>
            <Row className="row_item">
              <Col span={6}>
                <Form.Item label="项目" className="form-item first" labelCol={{ span: 7 }}>
                  {/* {getFieldDecorator('projectId', {
                    initialValue: projectId,
                    rules: [{ required: true }]
                  })(
                    <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" style={{ width: '1.14rem' }} onChange={this.getFieldsValue.bind(this, 2)}>
                      {projectList.map(item => <Select.Option value={item.projectId} key={item.projectId}>{item.projectName}</Select.Option>)}
                    </Select>
                  )} */}
                  <span>{projectName}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="法人主体" className="form-item custom-select-width" labelCol={{ span: 5 }}>
                  {/* {getFieldDecorator('entityId', {
                    initialValue: entityId,
                    rules: [{ required: true }]
                  })(
                    <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" style={{ width: '1.14rem' }} onChange={this.getFieldsValue.bind(this, 1)}>
                      {entityList.map(item => <Select.Option value={item.entityId} key={item.entityId} title={item.entity}>{item.entity}</Select.Option>)}
                    </Select>
                  )} */}
                  <span>{entityName}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="参保城市" className="form-item custom-select-width">
                  {getFieldDecorator('insuredCityId', {
                    initialValue: insuredCityId,
                    rules: [{ required: true }]
                  })(
                    <Select
                      disabled={closed}
                      getPopupContainer={(triggerNode:any) => triggerNode.parentElement}
                      placeholder="请选择"
                      style={{ width: '1.14rem' }}
                      onChange={this.getFieldsValue.bind(this, 1)}>
                      {cityList.map(item => <Select.Option value={item.icId} key={item.icId} title={item.icName}>{item.icName}</Select.Option>)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="参保标准" className="form-item custom-select-width">
                  {getFieldDecorator('insuranceStandardsId', {
                    initialValue: insuranceStandardsId,
                    rules: [{ required: true }]
                  })(
                    <Select
                      disabled={closed}
                      getPopupContainer={(triggerNode:any) => triggerNode.parentElement}
                      placeholder="请选择"
                      style={{ width: '1.14rem' }}
                      onChange={this.getFieldsValue.bind(this, 1)}>
                      {standardList.map(item => <Select.Option value={item.id} key={item.id} title={item.standardName}>{item.standardName}</Select.Option>)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className="row_item">
              <Col span={6}>
                <Form.Item label="起/停缴规则" className="form-item first" labelCol={{ span: 7 }}>
                  {getFieldDecorator('startRuleTime', {
                    initialValue: startRuleTime,
                    rules: [{ required: true }]
                  })(
                    <Select
                      disabled={closed}
                      getPopupContainer={(triggerNode:any) => triggerNode.parentElement}
                      placeholder="请选择"
                      style={{ width: '1.14rem' }}
                      onChange={this.getFieldsValue.bind(this, 1)}>
                      {dateList.map(item => <Select.Option value={item.id} key={item.id} title={item.name}>{item.name}</Select.Option>)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              {/* <Col span={6}>
                <Form.Item label="停缴规则" className="form-item">
                  {getFieldDecorator('endRuleTime', {
                    initialValue: endRuleTime,
                    rules: [{ required: true }]
                  })(
                    <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" style={{ width: '1.14rem' }} onChange={this.getFieldsValue.bind(this, 1)}>
                      {dateList.map(item => <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>)}
                    </Select>
                  )}
                </Form.Item>
              </Col> */}
              {/* <Col span={6}>
                <Form.Item label="生效日期" className="form-item">
                  {getFieldDecorator('takeEffectTime', {
                    initialValue: takeEffectTime ? moment(takeEffectTime) : undefined,
                    rules: [{ required: true }]
                  })(
                    <DatePicker
                      placeholder="请选择日期"
                      style={{ width: '1.14rem' }}
                      // disabledDate={(current: any) => current && current < moment().endOf('day')}
                      onChange={this.getFieldsValue.bind(this, 1)} />
                  )}
                </Form.Item>
              </Col> */}
            </Row>
          </div>
        </Form>
        <Row className="time-record">
          <p>创建时间：{createTime}</p>
          {
            updateTime && <p>上次修改时间：{updateTime}</p>
          }
        </Row>
        {
          /* eslint-disable */
          this.isAuthenticated(this.AuthorityList.companyInsured[3])
            ?
              <Row>
                <Button type="primary" className="ant_button_confirm" disabled={disabled || closed} onClick={this.handleSubmit}>保存</Button>
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
    clearTimeout(this.timerId)
  }
}

export default Form.create<FormProps>({})(StandardAdd)
