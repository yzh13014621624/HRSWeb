/**
 * @author maqian
 * @createTime 2019/04/09
 * @description 参保管理-参保核算详情
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent, BasicDowload } from '@components/index'
import { hot } from 'react-hot-loader'
import { Form, DatePicker, Button, Spin, Row, Col } from 'antd'
import './InsuredAccounteDetail.styl'
import { FormComponentProps } from 'antd/lib/form'
import moment from 'moment'
import SysUtil from '@utils/SysUtil'
import InsureExcel from '@assets/images/svg/share/insured/insuredExcel.svg'
import date from '@assets/images/date.png'
import nodate from '@assets/images/svg/share/insured/nodate.svg'

const { MonthPicker } = DatePicker
const itemLayout = { labelCol: { span: 7 }, wrapperCol: { span: 17 } }

interface InsuredAccounteDetailProps extends FormComponentProps {
  location?: any
  history?: any
}
interface InsuredAccounteDetailState {
  InsureData:any
  timeData:any
  loading:boolean
  takeEffectTimeRe:any
  projectId:any
  entityId:any
}
@hot(module) // 热更新（局部刷新界面）
class InsuredAccounteDetail extends RootComponent<InsuredAccounteDetailProps, InsuredAccounteDetailState> {
  constructor (props:any) {
    super(props)
    this.state = {
      takeEffectTimeRe: '', // 生效日期
      loading: false, // 加载动画
      timeData: {}, // 用于存放返回最近核算关账状态
      InsureData: {}, // 用于存放详情的数据
      projectId: null,
      entityId: null
    }
  }
  // 月份选择框改变时的事件
  MonthChange = (date:any, dateString: any) => {
    let data:any
    if (date) {
      data = date.format('YYYY-MM')
      this.setState({
        timeData: date.format('YYYY-MM')
      })
    }
    const { projectId, entityId } = this.state
    // 获取最近关账数据
    this.axios.request(this.api.timeDetail, {
      entityId,
      projectId,
      closeTime: data || ''
    }).then((res:any) => {
      this.setState({
        timeData: res.data
      })
    }).catch((err:any) => {
      this.error(err.msg[0])
    })
  }
  componentDidMount () {
    const { request, axios } = this.axios
    const { insuredetail, timeDetail } = this.api
    let InsureDataDetail = SysUtil.getSessionStorage('InsureDataDetail')
    const { projectId, entityId } = InsureDataDetail
    this.setState({
      loading: true,
      entityId,
      projectId,
      takeEffectTimeRe: InsureDataDetail.takeEffectTimeRe
    })
    // 获取详情和最近核算、关账返回的状态
    axios.all([
      // 详情数据的请求
      request(insuredetail, {
        iaId: InsureDataDetail.iaId
      }),
      request(timeDetail, {
        // 最近核算与关账状态返回
        entityId,
        projectId,
        closeTime: ''
      })
    ]).then(axios.spread((insuredata:any, timedata:any) => {
      this.setState({
        InsureData: insuredata.data, // 详情数据赋值
        timeData: timedata.data, // 时间状态赋值
        loading: false
      })
    })).catch((err:any) => {
      console.log(err.msg[0])
    })
  }
  routerLink = (path:string) => {
    // 点击返回按钮，清除session, 跳转到列表页
    SysUtil.clearSession('InsureDataDetail')
    this.props.history.push(path)
  }
  disabledDate = (current:any) => { // 月份选择器时间禁用
    // 禁用大于当前月份的月份
    return current && current > moment().endOf('day')
  }
  render () {
    const { getFieldDecorator } = this.props.form
    const { InsureData, timeData, loading, takeEffectTimeRe } = this.state
    const { checkCreateTime, closekCreateTime, checkState, closeState, checkIaId, closeIaId } = timeData
    const { projectName, entity, icName, standardName, startRuleTime, endRuleTime, closeAccount } = InsureData
    return (
      <div id="insured-accounte-detail">
        <Spin tip="Loading..." spinning={loading}>
          <Form layout="inline" {...itemLayout} >
            <div style={{ paddingBottom: 15, borderBottom: '1px solid rgba(216,216,216,1)' }}>
              <Row>
                <Col span={6}>
                  <Form.Item label="项目" className="cfrom-item">
                    <span>{ (InsureData ? projectName : undefined) || '- - -'}</span>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="法人主体" className="cfrom-item">
                    <span>{ (InsureData ? entity : undefined) || '- - -' }</span>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="参保城市" className="cfrom-item">
                    <span>{ (InsureData ? icName : undefined) || '- - -' }</span>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="参保标准" className="cfrom-item">
                    <span>{ (InsureData ? standardName : undefined) || '- - -' }</span>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={6}>
                  <Form.Item label="起缴规则" className="cfrom-item">
                    <span>{ (InsureData ? startRuleTime : undefined) || '- - -' }</span>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="停缴规则" className="cfrom-item">
                    <span>{ (InsureData ? endRuleTime : undefined) || '- - -' }</span>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="生效日期" className="cfrom-item">
                    <span>{ takeEffectTimeRe || '- - -' }</span>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="状态" className="cfrom-item">
                    <span>{ (InsureData ? closeAccount === 0 ? '本月未关帐' : '本月已关账' : undefined) || '- - -'}</span>
                  </Form.Item>
                </Col>
              </Row>
            </div>
            <Row className="Row-box">
              <Col className="col-one" span={7} offset={3}>
                <p className="font-tips">最近一次参保核算结果</p>
                { checkState === 1
                  ? <div>
                    <img src={InsureExcel} alt=""/>
                    <p className="name-tips">{projectName + '-' + entity + '-' + checkCreateTime}</p>
                    <BasicDowload action={this.api.dynamicRequest}
                      parmsData={{
                        handleType: 0,
                        iaId: checkIaId
                      }}
                      fileName={projectName + '-' + entity}
                      type="default"
                      dowloadURL="URL"
                      loadDate={checkCreateTime}
                      className="btn-style"
                    >
                      <span>下载</span>
                    </BasicDowload>
                  </div>
                  : <div>
                    <img src={nodate} style={{ marginBottom: '0.08rem' }} alt=""/>
                    <p className="nodatas">暂无记录</p>
                  </div>
                }
              </Col>
              <Col className="col-two" span={7} offset={2}>
                <Form.Item label="关账记录">
                  {getFieldDecorator('closekCreateTime', {
                    initialValue: closekCreateTime ? moment(closekCreateTime, 'YYYY年MM月') : null
                  })(
                    <MonthPicker
                      disabledDate={this.disabledDate}
                      onChange={this.MonthChange}
                      format='YYYY年MM月'
                      suffixIcon={(<img src={date}/>)}
                      style={{ width: 180 }}
                    />
                  )}
                </Form.Item>
                { closeState === 1
                  ? <div>
                    <img className="excel-img" src={InsureExcel} alt=""/>
                    <p className="name-tips">{projectName + '-' + entity + '-' + closekCreateTime}</p>
                    <BasicDowload action={this.api.dynamicRequest}
                      parmsData={{
                        handleType: 1,
                        iaId: closeIaId,
                        closeTime: closekCreateTime
                      }}
                      fileName={projectName + '-' + entity}
                      type="default"
                      dowloadURL="URL"
                      loadDate={closekCreateTime}
                      className="btn-style"
                    >
                      <span>下载</span>
                    </BasicDowload>
                  </div>
                  : <div>
                    <img src={nodate} className="nodatatip" alt=""/>
                    <p className="nodatas">暂无记录</p>
                  </div>
                }
              </Col>
            </Row>
            <Button onClick={() => this.routerLink('/home/InsuredAccounte')} className="return-btn">返回</Button>
          </Form>
        </Spin>
      </div>
    )
  }
}
const InsureForm = Form.create<InsuredAccounteDetailProps>()(InsuredAccounteDetail)
export default InsureForm
