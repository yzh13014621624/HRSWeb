/**
 * @author minjie
 * @createTime 2019/04/23
 * @description 参保标准-详情
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent, BasicModal } from '@components/index'
import { hot } from 'react-hot-loader'
import { Button, Form, Input, Row, Col, Select } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { SysUtil, FormatInputValue } from '@utils/index'
import moment from 'moment'
import { Prompt } from 'react-router-dom'

import { cityAry, aryTop, aryBottom, ary, disableCityNameAry } from '../components/model'

import downPng from '@assets/images/icon/down.png'

import '../style/StandardAdd.styl'

class StandeInfo {
  constructor (num:number, icId:number) {
    this.ruleId = num
    this.icId = icId
  }
  accFund:string = ''
  bigCareIns:string = ''
  birthIns:string = ''
  injuryIns:string = ''
  medicalCareIns:string = ''
  oldInsurance:string = ''
  residualPremium:string = ''
  supAccFund:string = ''
  supMedicalIns:string = ''
  unemploymentIns:string = ''
  ruleId:number = 0
  icId:number = 0
  id:number = 0
}

interface CityAddOrDetailProps extends FormComponentProps {
  match?: any
  history?:any
}
interface CityAddOrDetailState {
  standInfo: any // 保存上次 留下的数据
  InsuredRuleAry: any
  canNameAry: any // 参保的信息
  disableBtn: boolean // 按钮的禁用和显示
  userId: number // 保存 用户的ID，不存在则是 新增 新增的时候为零
  errorMsg:string
  bjMonthAry: any
  issUse: boolean // 是否被引用
  issClose: boolean // 是否被关联
  historyShow: boolean // 是否显示历史
  // 历史记录
  historyAry: Array<any>
}

@hot(module)
class CityAddOrDetail extends RootComponent<CityAddOrDetailProps, CityAddOrDetailState> {
  basicModal = React.createRef<BasicModal>()
  timerId: any = null
  constructor (props:any) {
    super(props)
    const { params } = this.props.match
    this.state = {
      standInfo: {},
      InsuredRuleAry: [],
      canNameAry: [],
      disableBtn: false,
      userId: params.id || 0,
      errorMsg: '',
      bjMonthAry: {
        bjMonthAry0: ary,
        bjMonthAry1: ary,
        bjMonthAry2: ary,
        bjMonthAry3: ary,
        bjMonthAry4: ary,
        bjMonthAry5: ary,
        bjMonthAry6: ary,
        bjMonthAry7: ary,
        bjMonthAry8: ary,
        bjMonthAry9: ary
      },
      issUse: false,
      issClose: false,
      historyShow: false,
      historyAry: []
    }
  }

  componentDidMount () {
    const { userId } = this.state
    this.queryCanName() // 查询名称
    if (userId === 0) { // 新增
      // 判断上次是否存在值
      let a = SysUtil.getSessionStorage('city_info')
      if (a) {
        this.initStand(a)
      }
    } else {
      this.queryStandInfo(userId) // 查询详情
      this.queryHistory(userId) // 查询历史记录
    }
  }

  componentWillUnmount () {
    // 退出组件的时候，将信息清空
    clearTimeout(this.timerId)
    this.setState = (state, callback) => {}
  }

  /** 获取历史记录 */
  queryHistory = (icId:number) => {
    this.axios.request(this.api.cityInsuredCityDetailLog, {
      icId
    }).then((res:any) => {
      let historyAry:any = []
      res.data.forEach((el:any) => {
        const { icName, updateTime, createTime,
          validDateStart, validDateEnd, hisResponses } = el
        let obj:any = {
          icName: icName,
          updateTime: updateTime,
          createTime: createTime,
          validDateStart: validDateStart,
          validDateEnd: validDateEnd
        }
        hisResponses.forEach((els:any) => {
          const { ruleId, accFund, bigCareIns, birthIns, id, injuryIns,
            medicalCareIns, insuranceStandardsId, oldInsurance,
            residualPremium, supAccFund, supMedicalIns, unemploymentIns } = els
          obj['accFund-' + ruleId] = accFund
          obj['bigCareIns-' + ruleId] = bigCareIns
          obj['birthIns-' + ruleId] = birthIns
          obj['injuryIns-' + ruleId] = injuryIns
          obj['medicalCareIns-' + ruleId] = medicalCareIns
          obj['oldInsurance-' + ruleId] = oldInsurance
          obj['residualPremium-' + ruleId] = residualPremium
          obj['supAccFund-' + ruleId] = supAccFund
          obj['supMedicalIns-' + ruleId] = supMedicalIns
          obj['unemploymentIns-' + ruleId] = unemploymentIns
          obj['insuranceStandardsId-' + ruleId] = insuranceStandardsId
          obj['id-' + ruleId] = id
        })
        historyAry.push(obj)
      })
      this.setState({
        historyAry
      })
    }).catch((err:any) => {
      console.log(err)
    })
  }

  /** 查询用户的详情的信息 */
  queryStandInfo = (id:number) => {
    this.axios.request(this.api.cityDetail, {
      icId: id
    }).then((res:any) => {
      const { code, msg, data } = res
      const { hrsInsuredCityResponseList, validDateEnd, validDateStart, icName, updateTimeRe, createTimeRe, quote, closeAccounts } = data
      let obj:any = {
        icName: icName,
        updateTime: updateTimeRe,
        createTime: createTimeRe,
        validDateEnd,
        validDateStart
      }
      let { canNameAry } = this.state
      hrsInsuredCityResponseList.forEach((el:any, index:number) => {
        const { ruleId, accFund, bigCareIns, birthIns, id, injuryIns,
          medicalCareIns, insuranceStandardsId, oldInsurance,
          residualPremium, supAccFund, supMedicalIns, unemploymentIns } = el
        obj['accFund-' + ruleId] = accFund
        obj['bigCareIns-' + ruleId] = bigCareIns
        obj['birthIns-' + ruleId] = birthIns
        obj['injuryIns-' + ruleId] = injuryIns
        obj['medicalCareIns-' + ruleId] = medicalCareIns
        obj['oldInsurance-' + ruleId] = oldInsurance
        obj['residualPremium-' + ruleId] = residualPremium
        obj['supAccFund-' + ruleId] = supAccFund
        obj['supMedicalIns-' + ruleId] = supMedicalIns
        obj['unemploymentIns-' + ruleId] = unemploymentIns
        obj['insuranceStandardsId-' + ruleId] = insuranceStandardsId
        obj['id-' + ruleId] = id
        if (ruleId === 12) { // 初始化信息
          this.initBjMonthAry(el)
        }
      })
      let key = canNameAry.indexOf(icName)
      canNameAry.splice(key, 1)
      this.setState({
        canNameAry: canNameAry
      })
      // 初始化数据
      this.initStand(obj, quote, closeAccounts)
    }).catch((err:any) => {
      console.log(err)
    })
  }

  /**  根据缴费规则初始化缴费戒指日期 */
  initBjMonthAry = (el:any) => {
    let { bjMonthAry } = this.state
    const { bigCareIns, birthIns, injuryIns, medicalCareIns, oldInsurance,
      residualPremium, supAccFund, supMedicalIns, unemploymentIns } = el
    bjMonthAry['bjMonthAry0'] = oldInsurance === '下月缴当月' ? aryBottom : ary
    bjMonthAry['bjMonthAry1'] = medicalCareIns === '下月缴当月' ? aryBottom : ary
    bjMonthAry['bjMonthAry2'] = unemploymentIns === '下月缴当月' ? aryBottom : ary
    bjMonthAry['bjMonthAry3'] = injuryIns === '下月缴当月' ? aryBottom : ary
    bjMonthAry['bjMonthAry4'] = birthIns === '下月缴当月' ? aryBottom : ary
    bjMonthAry['bjMonthAry5'] = bigCareIns === '下月缴当月' ? aryBottom : ary
    bjMonthAry['bjMonthAry6'] = supMedicalIns === '下月缴当月' ? aryBottom : ary
    bjMonthAry['bjMonthAry7'] = residualPremium === '下月缴当月' ? aryBottom : ary
    bjMonthAry['bjMonthAry9'] = supAccFund === '下月缴当月' ? aryBottom : ary
    this.setState({ bjMonthAry })
  }

  /** 查询所有的参保的名称 */
  queryCanName = () => {
    const { axios, api } = this
    axios.request(api.cityNames).then((res:any) => {
      if (res.code === 200) {
        let ary = res.data.map((el:any) => {
          return el.icName
        })
        this.setState({
          canNameAry: ary
        })
      }
    }).catch((err:any) => {
      console.log(err)
    })
  }

  /** 初始化数据 type: false:add, true:detail */
  initStand = (standInfo:any, issUse:boolean = false, issClose:boolean = false) => {
    this.setState({ standInfo, issUse, issClose })
    this.allChange()
    if (issUse && issClose) {
      this.$message.info('关联该参保标准的法人主体公司中，存在法人公司本月已关账，不可修改！')
    }
  }

  /** 判断按钮是否禁用的 */
  allChange = () => {
    const { getFieldsValue } = this.props.form
    if (this.timerId) clearTimeout(this.timerId)
    this.timerId = setTimeout(() => {
      let values = getFieldsValue()
      let num = 0
      for (const key in values) {
        if (disableCityNameAry.includes(key)) {
          if (values[key]) {
            num++
          }
        }
      }
      const { issClose, issUse } = this.state
      let disableBtn = (num === disableCityNameAry.length)
      if (issUse && issClose) {
        disableBtn = false
      } else if (issUse && !issClose) {
        disableBtn = (num === disableCityNameAry.length - 1)
      }
      this.setState({ disableBtn })
    }, 50)
  }

  /** 参保名称的验证 */
  validatorName = (rule:any, value:any, callback:any) => {
    let msg = ''
    if (this.state.canNameAry.indexOf(value) >= 0) {
      msg = '城市参保名称不能重复'
    }
    msg === '' ? callback() : callback(msg)
  }

  /** 参保名称输入验证 */
  transformName = (e:any) => {
    let value = e.target.value
    return value.replace(/(^\s*)|(\s*$)/g, '')
  }

  /** 增减员开始时间 */
  validatorStartTime = (rule:any, value:any, callback:any) => {
    const { getFieldValue, setFields } = this.props.form
    let key = rule.field
    let msg = ''
    let [int, suffer] = key.split('-')
    key = `${int}-${Number(suffer) + 1}`
    let lastName = getFieldValue(key)
    if (lastName && value) {
      let [ns, ls] = [value.substring(2, value.length - 1), lastName.substring(2, lastName.length - 1)]
      if (Number(ns) > Number(ls)) {
        msg = '增减员结束时间不能前于增减员开始时间'
      }
    }
    let obj:any = {}
    obj[key] = msg === '' ? { value: lastName } : { value: lastName, errors: [new Error(msg)] }
    setFields(obj)
    callback()
  }

  /** 增减员截止时间 */
  validatorEndTime = (rule:any, value:any, callback:any) => {
    const { getFieldValue } = this.props.form
    let key = rule.field
    let msg = ''
    let [int, suffer] = key.split('-')
    key = `${int}-${Number(suffer) - 1}`
    let lastName = getFieldValue(key)
    if (lastName && value) {
      let [ns, ls] = [value.substring(2, value.length - 1), lastName.substring(2, lastName.length - 1)]
      if (Number(ns) < Number(ls)) {
        msg = '增减员结束时间不能前于增减员开始时间'
      }
    }
    msg === '' ? callback() : callback(msg)
  }

  /** 缴费规则的改变 */
  monthChange = (index:number, value:any) => {
    this.allChange()
    let { bjMonthAry } = this.state
    bjMonthAry[`bjMonthAry${index}`] = value === '下月缴当月' ? aryBottom : ary
    this.setState({ bjMonthAry })
  }

  /** 返回上一页 */
  backOut = () => {
    this.props.history.replace('/home/parameters?type=city')
  }

  /** 提交信息 */
  submitData = (e:any) => {
    e.preventDefault()
    const { form } = this.props
    form.validateFieldsAndScroll({
      scroll: {
        offsetTop: 100,
        alignWithTop: true
      }
    }, (err, values) => {
      if (!err) {
        let userId = this.state.userId
        let obj:any = { icName: values.icName }
        let ary:any = [ new StandeInfo(8, userId), new StandeInfo(9, userId),
          new StandeInfo(10, userId), new StandeInfo(11, userId), new StandeInfo(12, userId),
          new StandeInfo(13, userId), new StandeInfo(14, userId), new StandeInfo(15, userId)]
        for (const key in values) {
          let [name, ruleId] = key.split('-')
          if (ruleId) {
            ary[(Number(ruleId) - 8)][name] = values[key]
          }
        }
        if (userId === 0) { // 新增
          obj['hrsInsuredCityRequestList'] = ary
        } else {
          obj['hrsInsuredCityInfoRequestList'] = ary
        }
        this.subMethod(obj)
      }
    })
  }

  /** 提交 */
  subMethod = (data:any) => {
    const { axios, api } = this
    if (this.state.userId !== 0) { // 修改
      const { issClose, issUse } = this.state
      data['id'] = this.state.userId
      if (this.isChangeUpadte()) {
        this.$message.success('保存成功')
        this.props.history.replace('/home/parameters?type=city')
      } else {
        if (issUse && !issClose) {
          const { icName } = this.state.standInfo
          data['icName'] = icName
        }
        this.setState({ disableBtn: false })
        axios.request(api.cityUpadte, data).then((res:any) => {
          if (issUse && !issClose) {
            this.$message.success('保存成功！本月1号开始生效')
          } else {
            this.$message.success('保存成功')
          }
          this.props.history.replace('/home/parameters?type=city')
        }).catch((err:any) => {
          const { msg } = err
          this.setState({ errorMsg: msg })
          this.handleModal(1)
        }).finally(() => {
          this.setState({ disableBtn: true })
        })
      }
    } else {
      this.setState({ disableBtn: false })
      axios.request(api.cityAdd, data).then((res:any) => {
        this.$message.success('新增成功')
        SysUtil.clearSession('city_info')
        this.props.history.replace('/home/parameters?type=city')
      }).catch((err:any) => {
        const { msg } = err
        this.setState({ errorMsg: msg })
        this.handleModal(1)
      }).finally(() => {
        this.setState({ disableBtn: true })
      })
    }
  }

  /** 判断是否 */
  isChangeUpadte = ():boolean => {
    let one = this.state.standInfo
    let two = this.props.form.getFieldsValue()
    let num = 0
    let sum = 0
    for (const key in two) {
      sum++
      if (two[key] === one[key]) {
        num++
      }
    }
    return num === sum
  }

  /** num: 0: 关闭， 1开启 */
  handleModal = (num:number) => {
    const { handleOk, handleCancel } = this.basicModal.current as BasicModal
    num === 0 ? handleCancel() : handleOk()
  }

  /** 修改的时候设置Id */
  initUserId = () => {
    const { getFieldDecorator } = this.props.form
    const { standInfo } = this.state
    getFieldDecorator('id-8', { initialValue: standInfo['id-8'] })
    getFieldDecorator('id-9', { initialValue: standInfo['id-9'] })
    getFieldDecorator('id-10', { initialValue: standInfo['id-10'] })
    getFieldDecorator('id-11', { initialValue: standInfo['id-11'] })
    getFieldDecorator('id-12', { initialValue: standInfo['id-12'] })
    getFieldDecorator('id-13', { initialValue: standInfo['id-13'] })
    getFieldDecorator('id-14', { initialValue: standInfo['id-14'] })
    getFieldDecorator('id-15', { initialValue: standInfo['id-15'] })
  }

  /** 是否收起 */
  historyShow = () => {
    this.setState({ historyShow: !this.state.historyShow })
  }

  render () {
    const { AuthorityList, isAuthenticated } = this
    const { getFieldDecorator } = this.props.form
    const { standInfo, disableBtn, userId, errorMsg, bjMonthAry, issUse, issClose, historyAry, historyShow } = this.state
    const { icName, updateTime, createTime, validDateEnd, validDateStart } = standInfo
    let monthAry = [...ary]
    return (
      <div style={{ padding: '0.208rem' }}>
        <Form className="stand-from" onSubmit={this.submitData}>
          {userId === 0 ? null : this.initUserId()}
          <Form.Item className="from-name">
            <p className="lable">城市参保名称</p>
            {issUse ? icName : getFieldDecorator('icName', {
              initialValue: icName,
              rules: [
                { required: true, whitespace: true, message: '请输入城市参保名称' },
                { validator: this.validatorName }
              ],
              getValueFromEvent: this.transformName
            })(<Input allowClear={true} maxLength={40} onChange={this.allChange} placeholder="请输入城市参保名称"></Input>)}
          </Form.Item>
          {userId !== 0 ? <div>
            <span className="update-time">创建时间：{createTime}</span>
            {updateTime && <span className="update-time">上次修改时间：{updateTime}</span>}
            {validDateStart && <span className="update-time">有效时间: {moment(validDateStart).format('YYYY-MM-DD')} ~ {validDateEnd !== null ? validDateEnd : '至今'}</span>}
          </div> : null}
          <p className="lable label-margin">参保参数配置</p>
          <div className="stand-content">
            <Row type="flex" justify="space-around" className="content-header">
              <Col span={2} className="first-span-city"></Col>
              <Col span={2}><span>*</span>养老险</Col>
              <Col span={2}><span>*</span>医疗险</Col>
              <Col span={2}><span>*</span>失业险</Col>
              <Col span={2}><span>*</span>工伤险</Col>
              <Col span={2}><span>*</span>生育险</Col>
              <Col span={2}>大病医疗险</Col>
              <Col span={2}>补充医疗险</Col>
              <Col span={2}>残保金</Col>
              <Col span={2}><span>*</span>公积金</Col>
              <Col span={2}>补充公积金</Col>
            </Row>
            <Row type="flex" justify="space-around" className="content-row">
              <Col span={2} className="first-span-city">
                <p>增员规则</p>
                <p>减员规则</p>
                <p>增减员开始时间</p>
                <p>增减员截止时间</p>
                <p>缴费规则</p>
                <p>缴费截止时间</p>
                <p>补缴月份</p>
                <p>跨年补缴</p>
              </Col>
              {cityAry.map((el:any, index:number) => (
                <Col span={2} key={index}>
                  <Form.Item className="from-item-inline input-width">
                    {!((issUse && !issClose) || !issUse) ? standInfo[el.name + '-8'] ? standInfo[el.name + '-8'] : <span>- - -</span> : el.guarantee ? <span>- - -</span> : getFieldDecorator(el.name + '-8', {
                      initialValue: standInfo[el.name + '-8'],
                      rules: [
                        { required: el.required, message: '请选择' }
                      ]
                    })(
                      <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} allowClear onChange={this.allChange} placeholder="请选择">
                        <Select.Option value="当月增当月">当月增当月</Select.Option>
                        <Select.Option value="当月增下月">当月增下月</Select.Option>
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item className="from-item-inline input-width">
                    {!((issUse && !issClose) || !issUse) ? standInfo[el.name + '-9'] ? standInfo[el.name + '-9'] : <span>- - -</span> : el.guarantee ? <span>- - -</span> : getFieldDecorator(el.name + '-9', {
                      initialValue: standInfo[el.name + '-9'],
                      rules: [{ required: el.required, message: '请选择' }]
                    })(
                      <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} allowClear onChange={this.allChange} placeholder="请选择">
                        <Select.Option value="当月减当月">当月减当月</Select.Option>
                        <Select.Option value="当月减下月">当月减下月</Select.Option>
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item className="from-item-inline input-width">
                    {!((issUse && !issClose) || !issUse) ? standInfo[el.name + '-10'] ? standInfo[el.name + '-10'] : <span>- - -</span> : el.guarantee ? <span>- - -</span> : getFieldDecorator(el.name + '-10', {
                      initialValue: standInfo[el.name + '-10'],
                      rules: [
                        { required: el.required, message: '请选择' },
                        { validator: this.validatorStartTime }
                      ]
                    })(
                      <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} allowClear onChange={this.allChange} placeholder="请选择">
                        {monthAry.map((el:any, index:number) => (
                          <Select.Option key={index} value={el.value}>{el.lable}</Select.Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item className="from-item-inline input-width">
                    {!((issUse && !issClose) || !issUse) ? standInfo[el.name + '-11'] ? standInfo[el.name + '-11'] : <span>- - -</span> : el.guarantee ? <span>- - -</span> : getFieldDecorator(el.name + '-11', {
                      initialValue: standInfo[el.name + '-11'],
                      rules: [
                        { required: el.required, message: '请选择' },
                        { validator: this.validatorEndTime }
                      ]
                    })(
                      <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} allowClear onChange={this.allChange} placeholder="请选择">
                        {monthAry.map((el:any, index:number) => (
                          <Select.Option key={index} value={el.value}>{el.lable}</Select.Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item className="from-item-inline input-width">
                    {!((issUse && !issClose) || !issUse) ? standInfo[el.name + '-12'] ? standInfo[el.name + '-12'] : <span>- - -</span> : el.guarantee ? <span>- - -</span> : getFieldDecorator(el.name + '-12', {
                      initialValue: standInfo[el.name + '-12'],
                      rules: [
                        { required: el.required, message: '请选择' }
                      ]
                    })(
                      <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} allowClear onChange={this.monthChange.bind(this, index)} placeholder="请选择">
                        <Select.Option value="当月缴当月">当月缴当月</Select.Option>
                        <Select.Option value="下月缴当月">下月缴当月</Select.Option>
                        <Select.Option value="当月缴下月">当月缴下月</Select.Option>
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item className="from-item-inline input-width">
                    {!((issUse && !issClose) || !issUse) ? standInfo[el.name + '-13'] ? standInfo[el.name + '-13'] : <span>- - -</span> : el.guarantee ? <span>- - -</span> : getFieldDecorator(el.name + '-13', {
                      initialValue: standInfo[el.name + '-13'],
                      rules: [{ required: el.required, message: '请选择' }]
                    })(
                      <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} allowClear onChange={this.allChange} placeholder="请选择">
                        {bjMonthAry[`bjMonthAry${index}`].map((el:any, index:number) => (
                          <Select.Option key={index} value={el.value}>{el.lable}</Select.Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item className="from-item-inline input-width">
                    {!((issUse && !issClose) || !issUse) ? standInfo[el.name + '-14'] ? standInfo[el.name + '-14'] : <span>- - -</span> : el.guarantee ? <span>- - -</span> : getFieldDecorator(el.name + '-14', {
                      initialValue: standInfo[el.name + '-14'],
                      rules: [{ required: el.required, message: '请选择' }]
                    })(
                      <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} allowClear onChange={this.allChange} placeholder="请选择">
                        <Select.Option value="1个月">1个月</Select.Option>
                        <Select.Option value="2个月">2个月</Select.Option>
                        <Select.Option value="3个月">3个月</Select.Option>
                        <Select.Option value="4个月">4个月</Select.Option>
                        <Select.Option value="5个月">5个月</Select.Option>
                        <Select.Option value="6个月">6个月</Select.Option>
                        <Select.Option value="7个月">7个月</Select.Option>
                        <Select.Option value="8个月">8个月</Select.Option>
                        <Select.Option value="9个月">9个月</Select.Option>
                        <Select.Option value="10个月">10个月</Select.Option>
                        <Select.Option value="11个月">11个月</Select.Option>
                        <Select.Option value="12个月">12个月</Select.Option>
                        <Select.Option value="不可补缴">不可补缴</Select.Option>
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item className="from-item-inline input-width">
                    {!((issUse && !issClose) || !issUse) ? standInfo[el.name + '-15'] ? standInfo[el.name + '-15'] : <span>- - -</span> : el.guarantee ? <span>- - -</span> : getFieldDecorator(el.name + '-15', {
                      initialValue: standInfo[el.name + '-15'],
                      rules: [{ required: el.required, message: '请选择' }]
                    })(
                      <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} allowClear onChange={this.allChange} placeholder="请选择">
                        <Select.Option value="允许">允许</Select.Option>
                        <Select.Option value="不允许">不允许</Select.Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              ))}
            </Row>
          </div>
          {userId === 0 ? <Form.Item className="label-margin stand-btn">
            <Button type="primary" disabled={!disableBtn} htmlType="submit">确定</Button>
            <Button className="ant_button_cancel" onClick={this.backOut}>取 消</Button>
          </Form.Item> : <Form.Item className="label-margin stand-btn">
            {isAuthenticated(AuthorityList.parameters[12]) && <Button type="primary" disabled={!disableBtn} htmlType="submit">保存</Button> }
            <Button className={isAuthenticated(AuthorityList.parameters[12]) ? 'ant_button_cancel' : 'ant_button_auth'}
              onClick={this.backOut}>{isAuthenticated(AuthorityList.parameters[12]) ? '取 消' : '返 回'}</Button>
          </Form.Item>}
        </Form>
        {userId !== 0 && historyAry.length > 0 && <Row>
          <Col span={24}>
            <div className='stand-history'>
              <div onClick={this.historyShow}>
                <p className='title'>历史配置</p>
                <img className={historyShow ? 'icon-up' : 'icon'} src={downPng} />
              </div>
            </div>
          </Col>
        </Row>}
        {userId !== 0 && historyShow && <Row>
          <Col span={24}>
            {historyAry.map((el:any, key:number) => (
              <Form className="stand-from" style={{ marginTop: '0.3rem' }} key={key}>
                <Form.Item className="from-name">
                  <p className="lable">城市参保名称</p>{el.icName}
                </Form.Item>
                <div>
                  <p className="update-time">有效时间: {el.validDateStart ? moment(el.validDateStart).format('YYYY-MM-DD') : el.validDateStart} ~ {moment(el.validDateEnd).format('YYYY-MM-DD')}</p>
                </div>
                <p className="lable label-margin">参保参数配置</p>
                <div className="stand-content">
                  <Row type="flex" justify="space-around" className="content-header">
                    <Col span={2} className="first-span-city"></Col>
                    <Col span={2}>养老险</Col>
                    <Col span={2}>医疗险</Col>
                    <Col span={2}>失业险</Col>
                    <Col span={2}>工伤险</Col>
                    <Col span={2}>生育险</Col>
                    <Col span={2}>大病医疗险</Col>
                    <Col span={2}>补充医疗险</Col>
                    <Col span={2}>残保金</Col>
                    <Col span={2}>公积金</Col>
                    <Col span={2}>补充公积金</Col>
                  </Row>
                  <Row type="flex" justify="space-around" className="content-row">
                    <Col span={2} className="first-span-city">
                      <p>增员规则</p>
                      <p>减员规则</p>
                      <p>增减员开始时间</p>
                      <p>增减员截止时间</p>
                      <p>缴费规则</p>
                      <p>缴费截止时间</p>
                      <p>补缴月份</p>
                      <p>跨年补缴</p>
                    </Col>
                    {cityAry.map((el:any, index:number) => (
                      <Col span={2} key={index}>
                        <Form.Item className="from-item-inline input-width">
                          {standInfo[el.name + '-8'] ? standInfo[el.name + '-8'] : <span>- - -</span>}
                        </Form.Item>
                        <Form.Item className="from-item-inline input-width">
                          {standInfo[el.name + '-9'] ? standInfo[el.name + '-9'] : <span>- - -</span>}
                        </Form.Item>
                        <Form.Item className="from-item-inline input-width">
                          {standInfo[el.name + '-10'] ? standInfo[el.name + '-10'] : <span>- - -</span>}
                        </Form.Item>
                        <Form.Item className="from-item-inline input-width">
                          {standInfo[el.name + '-11'] ? standInfo[el.name + '-11'] : <span>- - -</span>}
                        </Form.Item>
                        <Form.Item className="from-item-inline input-width">
                          {standInfo[el.name + '-12'] ? standInfo[el.name + '-12'] : <span>- - -</span>}
                        </Form.Item>
                        <Form.Item className="from-item-inline input-width">
                          {standInfo[el.name + '-13'] ? standInfo[el.name + '-13'] : <span>- - -</span>}
                        </Form.Item>
                        <Form.Item className="from-item-inline input-width">
                          {standInfo[el.name + '-14'] ? standInfo[el.name + '-14'] : <span>- - -</span>}
                        </Form.Item>
                        <Form.Item className="from-item-inline input-width">
                          {standInfo[el.name + '-15'] ? standInfo[el.name + '-15'] : <span>- - -</span>}
                        </Form.Item>
                      </Col>
                    ))}
                  </Row>
                </div>
              </Form>
            ))}
          </Col>
        </Row>}
        <BasicModal ref={this.basicModal} title="提示">
          <Row style={{ padding: '0.156rem 0 0.2rem', textAlign: 'center' }}>
            <span>{errorMsg}</span>
          </Row>
          <Row>
            <Button onClick={() => (this.handleModal(0))} type="primary">知道了</Button>
          </Row>
        </BasicModal>
        {userId === 0 ? <Prompt when={true} message="city_info"></Prompt> : null}
      </div>
    )
  }
}

const CityAddOrDetailFrom = Form.create<CityAddOrDetailProps>({
  name: 'stand-add-from-id',
  onValuesChange (props:any, changedValues:any, allValues:any) {
    const { params } = props.match
    // 新增的则记录信息
    if (!params.id) {
      SysUtil.setSessionStorage('city_info', allValues)
    }
  }
})(CityAddOrDetail)

export default CityAddOrDetailFrom
