/**
 * @author minjie
 * @createTime 2019/04/20
 * @description 行的信息
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent } from '@components/index'
import { Button, Checkbox, Row, Col } from 'antd'
import moment from 'moment'
import { standardRules } from './model'
import '../style/StandardPage.styl'

interface ColumnsContentProps {
  record: any // 展示的数据
  detailFun:Function // 查看
  removeFun: Function // 删除
  checkChange: Function // 选中 check
  keys: any // 全部选中的值
  type:string // 显示
}

interface ColumnsContentState {
  InsuredRuleAry:any
  checked: boolean
}

export default class ColumnsContent extends RootComponent<ColumnsContentProps, ColumnsContentState> {
  constructor (props:any) {
    super(props)
    this.state = {
      InsuredRuleAry: [],
      checked: false
    }
  }

  componentDidMount () {
    this.quueryInsuredRule() // 进来的时候将参保规则查询出来
  }

  /** 查询参保规则 */
  quueryInsuredRule = () => {
    const { axios, api } = this
    axios.request(api.paramsStandardInsuredRule).then((res:any) => {
      this.setState({
        InsuredRuleAry: res.data
      })
    }).catch((err:any) => {
      console.log(err.msg)
    })
  }

  /** 规则筛选 */
  filterRule = (ruleId:number) => {
    const { InsuredRuleAry } = this.state
    let row = InsuredRuleAry.filter((el:any) => {
      return ruleId === el.ruleId
    })
    return row.length > 0 ? <span>{row[0].ruleName}</span> : null
  }

  /** 筛选进位规则 */
  fiveRules = (data:any, key:string) => {
    if (data.ruleId === 5) {
      let col = standardRules.filter((el:any) => {
        return el.value === Number(data[key])
      })
      return col.length > 0 ? col[0].label : '- - -'
    } else if (data.ruleId === 1 || data.ruleId === 3) {
      return data[key] ? data[key] + '%' : data[key] || '- - -'
    } else {
      return data[key] || '- - -'
    }
  }

  /** 复选框设置 */
  checkboxChange = (val:any) => {
    const { checkChange, record, type } = this.props
    if (type === 'stand') {
      if (record.issUse === 1) {
        checkChange(val.target.checked, record.id, record.standardName)
      } else {
        checkChange(val.target.checked, record.id)
      }
    } else {
      if (record.quote) {
        checkChange(val.target.checked, record.icId, record.icName)
      } else {
        checkChange(val.target.checked, record.icId)
      }
    }
  }

  /** 对返回的信息进行排序 */
  sortArray = (data:any):any => {
    return data.sort((a:any, b:any) => {
      if (a.ruleId > b.ruleId) {
        return 1
      } else if (a.ruleId < b.ruleId) {
        return -1
      } else {
        return 0
      }
    })
  }

  render () {
    const { record, detailFun, removeFun, keys, type } = this.props
    const { AuthorityList, isAuthenticated } = this
    let [list, name, key, isUse] = [[], '', 0, 0]
    let { insuredList, standardName, id, createTime, hrsInsuredCityResponseList,
      icName, icId, issUse, quote } = record
    if (type === 'stand') {
      list = this.sortArray(insuredList)
      name = standardName
      key = id
      isUse = issUse
    } else {
      list = this.sortArray(hrsInsuredCityResponseList)
      name = icName
      key = icId
      isUse = quote
    }
    createTime = moment(createTime).format('YYYY-MM-DD HH:mm:ss')
    let check = keys.indexOf(key) >= 0
    return (
      <div className="stand-table">
        <Row className='table-row-header'>
          <Col span={12} className='header-check'>
            <Checkbox checked={check} onChange={this.checkboxChange}></Checkbox>
            <span className="create-time">{`${name}（创建时间：${createTime}）`}</span>
          </Col>
          <Col span={4} offset={8} className='header-btn'>
            {isAuthenticated(AuthorityList.parameters[type === 'city' ? 13 : 5]) && <Button size='small' style={{ float: 'right' }} onClick={() => removeFun(0, key, isUse)}>删除</Button>}
            {isAuthenticated(AuthorityList.parameters[type === 'city' ? 11 : 3]) && <Button size='small' style={{ float: 'right' }} onClick={() => detailFun(key)}>查看</Button>}
          </Col>
        </Row>
        <Row type="flex" justify="space-around" className='table-row-title table-row-title-bg'>
          <Col span={2}></Col>
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
        {list.map((el:any, index:number) => (
          <Row key={index} type="flex" justify="space-around" className='table-row'>
            <Col span={2} className='table-col-title'>{this.filterRule(el.ruleId)}</Col>
            <Col span={2}>{this.fiveRules(el, 'oldInsurance')}</Col>
            <Col span={2}>{this.fiveRules(el, 'medicalCareIns')}</Col>
            <Col span={2}>{this.fiveRules(el, 'unemploymentIns')}</Col>
            <Col span={2}>{this.fiveRules(el, 'injuryIns')}</Col>
            <Col span={2}>{this.fiveRules(el, 'birthIns')}</Col>
            <Col span={2}>{this.fiveRules(el, 'bigCareIns')}</Col>
            <Col span={2}>{this.fiveRules(el, 'supMedicalIns')}</Col>
            <Col span={2}>{this.fiveRules(el, 'residualPremium')}</Col>
            <Col span={2}>{this.fiveRules(el, 'accFund')}</Col>
            <Col span={2}>{this.fiveRules(el, 'supAccFund')}</Col>
          </Row>
        ))}
      </div>
    )
  }
}
