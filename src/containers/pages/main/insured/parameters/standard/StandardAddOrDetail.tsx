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
import { SysUtil, FormatInputValue, JudgeUtil } from '@utils/index'

import { Prompt } from 'react-router-dom'

import { StandardAry, disableStandNameAry } from '../components/model'

import downPng from '@assets/images/icon/down.png'
import '../style/StandardAdd.styl'
import moment from 'moment'

const Selectary = [
  { label: '四舍五入到分', value: '1' },
  { label: '四舍五入到角', value: '2' },
  { label: '四舍五入到元', value: '3' },
  { label: '见分进角', value: '4' },
  { label: '见分进元', value: '5' },
  { label: '见角进元', value: '6' },
  { label: '取整舍尾', value: '7' },
  { label: '见厘进分', value: '8' },
  { label: '四舍五入到厘', value: '9' }
]

class StandeInfo {
  constructor (num:number) {
    this.type = num
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
  type:number = 0
  id:number = 0
  insuranceStandardsId: number = 0
}

interface StandardAddProps extends FormComponentProps {
  match?: any
  history?:any
}
interface StandardAddState {
  standInfo: any // 保存上次 留下的数据
  InsuredRuleAry: any
  canNameAry: any // 参保的信息
  disableBtn: boolean // 按钮的禁用和显示
  userId: number // 保存 用户的ID，不存在则是 新增 新增的时候为零
  errorMsg:string
  issUse: boolean // 是否被引用
  issClose: boolean // 是否被关联
  historyShow: boolean // 是否显示历史
  // 历史记录
  historyAry: Array<any>
}

@hot(module)
class StandardAdd extends RootComponent<StandardAddProps, StandardAddState> {
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
      let a = SysUtil.getSessionStorage('stand_info')
      if (a) {
        this.initStand(a)
      }
    } else { // 查询详情
      this.queryStandInfo(userId)
      this.queryHistory(userId)
    }
  }

  componentWillUnmount () {
    // 退出组件的时候，将信息清空
    clearTimeout(this.timerId)
    this.setState = (state, callback) => {}
  }

  /** 获取历史记录 */
  queryHistory = (id:number) => {
    this.axios.request(this.api.paramsStandardInsuredLogList, {
      id
    }).then((res:any) => {
      let historyAry:any = []
      res.data.forEach((el:any) => {
        const { iSDetailsLogList, standardName, updateTime, createTime, validDateStart, validDateEnd } = el
        let obj:any = {
          standardName: standardName,
          updateTime,
          createTime,
          validDateStart,
          validDateEnd
        }
        iSDetailsLogList.forEach((el:any) => {
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
    this.axios.request(this.api.paramsStandardDetail, {
      id: id
    }).then((res:any) => {
      const { code, msg, data } = res
      const { list, standardName, updateTime, validDateEnd, validDateStart, createTime, issUse, issClose } = data
      let obj:any = {
        standardName: standardName,
        updateTime: updateTime,
        createTime: createTime,
        validDateEnd,
        validDateStart
      }
      list.forEach((el:any) => {
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
      })
      let { canNameAry } = this.state
      let key = canNameAry.indexOf(standardName)
      canNameAry.splice(key, 1)
      this.setState({
        canNameAry: canNameAry
      })
      // 初始化数据
      this.initStand(obj, issUse, issClose)
    }).catch((err:any) => {
      console.log(err)
    })
  }

  /** 查询所有的参保的名称 */
  queryCanName = () => {
    const { axios, api } = this
    axios.request(api.paramsStandardCheckName).then((res:any) => {
      if (res.code === 200) {
        let ary = res.data.map((el:any) => {
          return el.standardName
        })
        this.setState({
          canNameAry: ary
        })
      }
    }).catch((err:any) => {
      console.log(err.msg)
    })
  }

  /** 初始化数据 issUse: false:未被引用, true:被引用 */
  initStand = (standInfo:any, issUse:boolean = false, issClose: boolean = false) => {
    this.setState({ standInfo, issUse, issClose })
    this.allChange()
    if (issUse && issClose) {
      this.$message.warning('关联该参保标准的法人主体公司中，存在法人公司本月已关账，不可修改！')
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
        if (disableStandNameAry.includes(key)) {
          if (values[key]) {
            num++
          }
        }
      }
      const { issClose, issUse } = this.state
      let disableBtn = (num === disableStandNameAry.length)
      if (issUse && issClose) {
        disableBtn = false
      } else if (issUse && !issClose) {
        disableBtn = (num === disableStandNameAry.length - 1)
      }
      this.setState({ disableBtn })
    }, 50)
  }

  /** 参保名称的验证 */
  validatorName = (rule:any, value:any, callback:any) => {
    let msg = ''
    if (this.state.canNameAry.indexOf(value) >= 0) {
      msg = '参保名称不能重复'
    }
    msg === '' ? callback() : callback(msg)
  }

  /** 参保名称输入验证 */
  transformName = (e:any) => {
    let value = e.target.value
    return value.replace(/(^\s*)|(\s*$)/g, '')
  }

  /** 百分比的数字控制 */
  transformInputValueOfPercentage = (e:any) => {
    let value = e.target.value
    value = FormatInputValue.toFixed(value, 3, 3)
    value = value.replace(/^\d+/, (match: string) => { // 整数位只允许输入 8 未，首位 0 不允许出现 2 次以上
      if (Number(match) >= 100) {
        return 100
      } else {
        return (parseFloat(match) + '').substr(0, 2)
      }
    })
    return value
  }
  /** 对数值进行验证 */
  transformInputValue = (e:any) => {
    let value = e.target.value
    return FormatInputValue.toFixed(value, 2, 8)
  }

  /** 结尾的 */
  numberBlur = (key:any, e:any) => {
    let value = e.target.value
    const { setFields, getFieldError } = this.props.form
    let index = value.indexOf('.')
    if (index === value.length - 1) {
      value = value.substr(0, index)
    }
    if (value >= 100) {
      value = '100.000'
    }
    let obj:any = {}
    let msg:any = getFieldError(key)
    obj[key] = { value: value, errors: getFieldError(key) }
    if (msg) {
      obj[key]['errors'] = [new Error(msg[0])]
    }
    setFields(obj)
  }

  /** 结尾的 两位的 */
  transformInputBlurs = (key:any, e:any) => {
    let value = e.target.value
    const { setFields, getFieldError } = this.props.form
    let index = value.indexOf('.')
    if (index === value.length - 1) value = value.substr(0, index)
    if (!JudgeUtil.isEmpty(value)) {
      value = Number(value).toFixed(2)
    }
    let obj:any = {}
    let msg:any = getFieldError(key)
    obj[key] = { value: value, errors: getFieldError(key) }
    if (msg) {
      obj[key]['errors'] = [new Error(msg[0])]
    }
    setFields(obj)
  }

  /** 基数的上限 */
  validatorTop = (rule:any, value:any, callback:any) => {
    const { field } = rule
    let msg = ''
    const { getFieldValue } = this.props.form
    let [name, num] = field.split('-')
    // 获取下限的值
    let bot = getFieldValue(name + '-' + (Number(num) + 1))
    if (value && Number(value) < Number(bot)) {
      msg = '基数上限不能小于基数下限'
      callback(msg)
    }
    callback()
  }

  /** 基数的下限 */
  validatorBottom = (rule:any, value:any, callback:any) => {
    const { field } = rule
    let msg = ''
    const { getFieldValue } = this.props.form
    let [name, num] = field.split('-')
    // 获取下限的值
    let top = getFieldValue(name + '-' + (Number(num) - 1))
    if (value && Number(value) > Number(top)) {
      msg = '基数下限不能大于基数上限'
      callback(msg)
    }
    callback()
  }

  /** 返回上一页 */
  backOut = () => {
    this.props.history.replace('/home/parameters?type=stand')
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
        let obj = {
          insertInsuredDetailsRequestList: [],
          standardName: values.standardName
        }
        let ary:any = [ new StandeInfo(1), new StandeInfo(2), new StandeInfo(3),
          new StandeInfo(4), new StandeInfo(5), new StandeInfo(6), new StandeInfo(7)]
        for (const key in values) {
          let [name, type] = key.split('-')
          if (type) {
            ary[(Number(type) - 1)][name] = values[key]
          }
        }
        obj.insertInsuredDetailsRequestList = ary
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
      if (this.isChangeUpadte()) { // 未修改
        this.$message.success('保存成功')
        this.props.history.replace('/home/parameters?type=stand')
      } else {
        this.setState({ disableBtn: false })
        if (issUse && !issClose) {
          const { standardName } = this.state.standInfo
          data['standardName'] = standardName
        }
        axios.request(api.paramsStandardUpdate, data).then((res:any) => {
          this.setState({ disableBtn: true })
          if (issUse && !issClose) {
            this.$message.success('保存成功！本月1号开始生效')
          } else {
            this.$message.success('保存成功')
          }
          this.props.history.replace('/home/parameters?type=stand')
        }).catch((err:any) => {
          this.setState({ disableBtn: true })
          const { msg } = err
          this.setState({ errorMsg: msg })
          this.handleModal(1)
        })
      }
    } else {
      this.setState({ disableBtn: false })
      axios.request(api.paramsStandardAdd, data).then((res:any) => {
        this.setState({ disableBtn: true })
        this.$message.success('新增成功')
        SysUtil.clearSession('stand_info')
        this.props.history.replace('/home/parameters?type=stand')
      }).catch((err:any) => {
        this.setState({ disableBtn: true })
        const { msg } = err
        this.setState({ errorMsg: msg })
        this.handleModal(1)
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

  /** 筛选信息 */
  selectInit = (data:any):any => {
    let obj = Selectary.find((v:any) => v.value === data)
    return obj ? obj.label : <span>- - -</span>
  }

  initValue = (value:any) => {
    // if (Number(value) === 0.000 || Number(value) === 0.00) {
    //   return undefined
    // } else {
    // }
    return value
  }

  /** 初始化信息 */
  initId = () => {
    const { getFieldDecorator } = this.props.form
    const { standInfo } = this.state
    for (let index = 1; index <= 7; index++) {
      getFieldDecorator(`id-${index}`, { initialValue: standInfo[`id-${index}`] })
    }
  }

  /** 是否收起 */
  historyShow = () => {
    this.setState({ historyShow: !this.state.historyShow })
  }

  /** 显示 */
  initValueText = (value:any) => {
    const { issUse, issClose } = this.state
  }

  render () {
    const { AuthorityList, isAuthenticated } = this
    const { getFieldDecorator } = this.props.form
    const { standInfo, disableBtn, userId, errorMsg, issUse, issClose, historyAry, historyShow } = this.state
    const { standardName, updateTime, createTime, validDateEnd, validDateStart } = standInfo
    return (
      <div style={{ padding: '0.18rem' }}>
        <Form className="stand-from" onSubmit={this.submitData}>
          <Form.Item className="from-name">
            <p className="lable">参保标准名称</p>
            {issUse ? standardName : getFieldDecorator('standardName', {
              initialValue: standardName,
              rules: [
                { required: true, whitespace: true, message: '请输入参保标准名称' },
                { validator: this.validatorName }
              ],
              getValueFromEvent: this.transformName
            })(<Input allowClear maxLength={40} onChange={this.allChange} placeholder="请输入参保标准名称"></Input>)}
          </Form.Item>
          {userId !== 0 ? <div>
            <span className="update-time">创建时间：{createTime}</span>
            {updateTime && <span className="update-time">上次修改时间：{updateTime}</span>}
            {validDateStart && <span className="update-time">有效时间: {moment(validDateStart).format('YYYY-MM-DD')} ~ {validDateEnd !== null ? validDateEnd : '至今'}</span>}
          </div> : null}
          <p className="lable label-margin">参保参数配置</p>
          <div className="stand-content">
            <Row type="flex" justify="space-around" className="content-header">
              <Col span={2} className="first-span"></Col>
              <Col span={2}><span>*</span>养老险</Col>
              <Col span={2}><span>*</span>医疗险</Col>
              <Col span={2}><span>*</span>失业险</Col>
              <Col span={2}><span>*</span>工伤险</Col>
              <Col span={2}><span>*</span>生育险</Col>
              <Col span={2}>大病医疗险</Col>
              <Col span={2}>补充医疗险</Col>
              <Col span={2}><span>*</span>残保金</Col>
              <Col span={2}><span>*</span>公积金</Col>
              <Col span={2}>补充公积金</Col>
            </Row>
            <Row type="flex" justify="space-around" className="content-row">
              <Col span={2} className="first-span">
                <p>个人比例</p>
                <p>个人定额</p>
                <p>公司比例</p>
                <p>公司定额</p>
                <p>进位规则</p>
                <p>基数上限</p>
                <p>基数下限</p>
              </Col>
              {StandardAry.map((el:any, index:number) => (
                <Col span={2} key={index}>
                  {userId !== 0 ? this.initId() : null}
                  <Form.Item className="from-item-inline input-width">
                    {!((issUse && !issClose) || !issUse) ? standInfo[el.name + '-1'] ? standInfo[el.name + '-1'] : <span>- - -</span>
                      : el.guarantee ? <span>- - -</span> : getFieldDecorator(el.name + '-1', {
                        initialValue: this.initValue(standInfo[el.name + '-1']),
                        rules: [
                          { required: el.required, message: '请输入数值' }
                        ],
                        getValueFromEvent: this.transformInputValueOfPercentage
                      })(<Input allowClear onBlur={this.numberBlur.bind(this, el.name + '-1')}
                        onChange={this.allChange} placeholder="请输入数值"></Input>)}
                    {el.guarantee ? null : <span className="suffer-span">%</span> }
                  </Form.Item>
                  <Form.Item className="from-item-inline input-width">
                    {!((issUse && !issClose) || !issUse) ? standInfo[el.name + '-2'] ? standInfo[el.name + '-2'] : <span>- - -</span>
                      : el.guarantee ? <span>- - -</span> : getFieldDecorator(el.name + '-2', {
                        initialValue: this.initValue(standInfo[el.name + '-2']),
                        rules: [
                          { required: el.required, message: '请输入金额' }
                        ],
                        getValueFromEvent: this.transformInputValue
                      })(
                        <Input allowClear maxLength={11}
                          onBlur={this.transformInputBlurs.bind(this, el.name + '-2')}
                          onChange={this.allChange} placeholder="请输入金额"></Input>
                      )}
                  </Form.Item>
                  <Form.Item className="from-item-inline input-width">
                    {!((issUse && !issClose) || !issUse) ? standInfo[el.name + '-3'] ? standInfo[el.name + '-3'] : <span>- - -</span>
                      : el.guarantee ? <span>- - -</span> : getFieldDecorator(el.name + '-3', {
                        initialValue: this.initValue(standInfo[el.name + '-3']),
                        rules: [
                          { required: el.required, message: '请输入数值' }
                        ],
                        getValueFromEvent: this.transformInputValueOfPercentage
                      })(<Input allowClear onBlur={this.numberBlur.bind(this, el.name + '-3')}
                        onChange={this.allChange} placeholder="请输入数值"></Input>)}
                    {el.guarantee ? null : <span className="suffer-span">%</span> }
                  </Form.Item>
                  <Form.Item className="from-item-inline input-width">
                    {!((issUse && !issClose) || !issUse) ? standInfo[el.name + '-4'] ? standInfo[el.name + '-4'] : <span>- - -</span> : getFieldDecorator(el.name + '-4', {
                      initialValue: this.initValue(standInfo[el.name + '-4']),
                      rules: [
                        { required: el.required, message: '请输入金额' }
                      ],
                      getValueFromEvent: this.transformInputValue
                    })(
                      <Input allowClear maxLength={11}
                        onBlur={this.transformInputBlurs.bind(this, el.name + '-4')}
                        onChange={this.allChange} placeholder="请输入金额"></Input>
                    )}
                  </Form.Item>
                  <Form.Item className="from-item-inline input-width custom-select">
                    {!((issUse && !issClose) || !issUse) ? standInfo[el.name + '-5'] ? this.selectInit(standInfo[el.name + '-5']) : <span>- - -</span> : el.guarantee ? <span>- - -</span> : getFieldDecorator(el.name + '-5', {
                      initialValue: this.initValue(standInfo[el.name + '-5']),
                      rules: [{ required: el.required, message: '请选择进位规则' }]
                    })(
                      <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} allowClear placeholder="请选择" onChange={this.allChange}>
                        {Selectary.map((el:any, index:number) => (
                          <Select.Option key={index} value={el.value}>{el.label}</Select.Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item className="from-item-inline input-width">
                    {!((issUse && !issClose) || !issUse) ? standInfo[el.name + '-6'] ? standInfo[el.name + '-6'] : <span>- - -</span> : el.guarantee ? <span>- - -</span> : getFieldDecorator(el.name + '-6', {
                      initialValue: this.initValue(standInfo[el.name + '-6']),
                      rules: [
                        { required: el.required, message: '请输入金额' },
                        { validator: this.validatorTop }
                      ],
                      getValueFromEvent: this.transformInputValue
                    })(
                      <Input allowClear maxLength={11}
                        onBlur={this.transformInputBlurs.bind(this, el.name + '-6')}
                        onChange={this.allChange} placeholder="请输入金额"></Input>
                    )}
                  </Form.Item>
                  <Form.Item className="from-item-inline input-width">
                    {!((issUse && !issClose) || !issUse) ? standInfo[el.name + '-7'] ? standInfo[el.name + '-7'] : <span>- - -</span> : el.guarantee ? <span>- - -</span> : getFieldDecorator(el.name + '-7', {
                      initialValue: this.initValue(standInfo[el.name + '-7']),
                      rules: [
                        { required: el.required, message: '请输入金额' },
                        { validator: this.validatorBottom }
                      ],
                      getValueFromEvent: this.transformInputValue
                    })(
                      <Input allowClear maxLength={11}
                        onBlur={this.transformInputBlurs.bind(this, el.name + '-7')}
                        onChange={this.allChange} placeholder="请输入金额"></Input>
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
            {isAuthenticated(AuthorityList.parameters[4]) && <Button type="primary" disabled={!disableBtn} htmlType="submit">保存</Button> }
            <Button className={isAuthenticated(AuthorityList.parameters[4]) ? 'ant_button_cancel' : 'ant_button_auth'}
              onClick={this.backOut}>{isAuthenticated(AuthorityList.parameters[4]) ? '取 消' : '返 回'}</Button>
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
              <Form className="stand-from" style={{ marginTop: '0.3rem' }} key={key} >
                <Form.Item className="from-name">
                  <p className="lable">参保标准名称</p>
                  {standardName}
                </Form.Item>
                <div>
                  <p className="update-time">有效时间: {el.validDateStart ? moment(el.validDateStart).format('YYYY-MM-DD') : el.validDateStart} ~ {moment(el.validDateEnd).format('YYYY-MM-DD')}</p>
                </div>
                <p className="lable label-margin">参保参数配置</p>
                <div className="stand-content">
                  <Row type="flex" justify="space-around" className="content-header">
                    <Col span={2} className="first-span"></Col>
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
                    <Col span={2} className="first-span">
                      <p>个人比例</p>
                      <p>个人定额</p>
                      <p>公司比例</p>
                      <p>公司定额</p>
                      <p>进位规则</p>
                      <p>基数上限</p>
                      <p>基数下限</p>
                    </Col>
                    {StandardAry.map((el:any, index:number) => (
                      <Col span={2} key={index}>
                        {userId !== 0 ? this.initId() : null}
                        <Form.Item className="from-item-inline input-width">
                          {standInfo[el.name + '-1'] ? standInfo[el.name + '-1'] : <span>- - -</span>}
                        </Form.Item>
                        <Form.Item className="from-item-inline input-width">
                          {standInfo[el.name + '-2'] ? standInfo[el.name + '-2'] : <span>- - -</span> }
                        </Form.Item>
                        <Form.Item className="from-item-inline input-width">
                          {standInfo[el.name + '-3'] ? standInfo[el.name + '-3'] : <span>- - -</span>}
                        </Form.Item>
                        <Form.Item className="from-item-inline input-width">
                          {standInfo[el.name + '-4'] ? standInfo[el.name + '-4'] : <span>- - -</span>}
                        </Form.Item>
                        <Form.Item className="from-item-inline input-width custom-select">
                          {this.selectInit(standInfo[el.name + '-5'])}
                        </Form.Item>
                        <Form.Item className="from-item-inline input-width">
                          {standInfo[el.name + '-6'] ? standInfo[el.name + '-6'] : <span>- - -</span>}
                        </Form.Item>
                        <Form.Item className="from-item-inline input-width">
                          {standInfo[el.name + '-7'] ? standInfo[el.name + '-7'] : <span>- - -</span>}
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
        {userId === 0 ? <Prompt when={true} message="stand_info"></Prompt> : null}
      </div>
    )
  }
}

const StandardAddFrom = Form.create<StandardAddProps>({
  name: 'stand-add-from-id',
  onValuesChange (props:any, changedValues:any, allValues:any) {
    const { params } = props.match
    // 新增的则记录信息
    if (!params.id) {
      SysUtil.setSessionStorage('stand_info', allValues)
    }
  }
})(StandardAdd)

export default StandardAddFrom
