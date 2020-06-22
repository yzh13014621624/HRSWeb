/*
 * @description: 参数维护---工资标准组件
 * @author: yanzihao
 * @lastEditors: yanzihao
 * @Date: 2019-09-23 14:15:15
 * @LastEditTime: 2020-05-28 10:18:35
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { hot } from 'react-hot-loader'
import { FormComponentProps } from 'antd/lib/form'
import { RootComponent } from '@components/index'
import { Button, Form, Row, Input, Col, Radio, Divider, Modal } from 'antd'
import { BaseProps } from 'typings/global'
import { HttpUtil } from '@utils/index'
import moment from 'moment'
import down from '@assets/images/icon/down.png'
import up from '@assets/images/icon/up.png'
import './index.styl'
import { async } from 'q'

const { Item } = Form
interface FormProps extends BaseProps, FormComponentProps{
  btnStatus: Boolean // 按钮的状态
  downOrupstatus: Boolean // 是展示展开的图标还是收起的图标
  entityId: number // 法人主体id
  status: number // 页面状态
  historyRecord: any // 历史记录
  information: any // 详情信息
  wageStandardId: number // 数据的唯一标识---用于请求详情的id
}

class SalaryStandardFirstSet extends RootComponent<FormProps, any> {
  constructor (props: FormProps) {
    super(props)
    this.state = {
      btnStatus: true,
      downOrupstatus: false,
      entityId: undefined,
      status: undefined,
      wageStandardId: undefined,
      historyRecord: [],
      information: {}
    }
  }

  componentDidMount = () => {
    let { entityId, status, wageStandardId } = HttpUtil.parseUrl(this.props.location.search)
    this.setState({
      entityId: Number(entityId),
      status: Number(status),
      wageStandardId: Number(wageStandardId)
    })
    if (status === '2') {
      this.axios.request(this.api.getHistoryWageStandardList, { entityId: Number(entityId) }).then(({ data }) => {
        this.setState({ historyRecord: data })
      })
      this.axios.request(this.api.getWageStandardInfo, { wageStandardId: Number(wageStandardId) }).then(async ({ data }) => {
        await this.setState({ information: data })
        this.changeBtnStatus()
      })
    }
  }

  // 确定按钮是否可以点击
  changeBtnStatus = () => {
    setTimeout(() => {
      const { disabledButton } = this.watchFieldsValues(this.props.form.getFieldsValue())
      this.setState({ btnStatus: disabledButton })
    }, 0)
  }

  // 切换展开和收起的图标
  switchimg = () => {
    const { downOrupstatus } = this.state
    this.setState({ downOrupstatus: !downOrupstatus })
  }

  // 确定按钮
  confirmBtn = () => {
    const {
      state: { status, entityId, wageStandardId },
      props: { form: { getFieldsValue } }
    } = this
    const { reqfullTimeWages, fullTimeWagesOrnot, reqtraineeMinWages, reqtimeMinWages, reqsocialWages, reqovertimeBase } = getFieldsValue()
    const param = {
      entityId,
      fullTimeWages: reqfullTimeWages,
      fullTimeWagesOrnot,
      traineeMinWages: reqtraineeMinWages,
      timeMinWages: reqtimeMinWages,
      socialWages: reqsocialWages,
      overtimeBase: reqovertimeBase,
      wageStandardId
    }
    this.axios.request(this.api.updateWageStandard, param).then(({ code }) => {
      if (code === 200) {
        this.$message.info('保存成功，本月1号开始生效！')
        this.props.history.push(`/home/salaryparametersetting?tabValue=${2}`)
      }
    })
  }

  // 返回按钮
  cancelOrreturnBtn = () => {
    Modal.confirm({
      title: '您正在编辑信息，是否确认离开?',
      cancelText: '取消',
      okText: '确认',
      onOk: () => (this.props.history.push(`/home/salaryparametersetting?tabValue=${2}`))
    })
  }

  // 处理数据显示
  disposeValue = (value: any) => {
    return value ? Number(value).toFixed(2) : '---'
  }

  // 限制输入框输入---只能输入数字以及保留两位小数
  formatInputValue = (value: any) => {
    value = value.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
    value = value.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
    value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
    value = value.replace(/^(\\-)*(\d+)\.(\d\d).*$/, '$1$2.$3') // 只能输入两个小数
    if (value.indexOf('.') < 0 && value !== '') {
    // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02
      value = parseFloat(value)
    }
    return value
  }

  render () {
    const title = sessionStorage.getItem('salarystandardtitle')
    const { getFieldDecorator } = this.props.form
    const { btnStatus, downOrupstatus, status, historyRecord,
      information: { fullTimeWages, fullTimeWagesOrnot, traineeMinWages, timeMinWages, socialWages, overtimeBase, clock }
    } = this.state
    const fromcol = {
      labelCol: { span: 11 },
      wrapperCol: { span: 13 }
    }
    return (
      <div className='salarystandardfirstset'>
        <p className='title'>{`${title}-工资标准设置`}</p>
        <Form>
          <Row>
            <Col span={8}>
              <Item label='全职最低工资' {...fromcol}>
                {getFieldDecorator('reqfullTimeWages', {
                  rules: [{
                    required: true,
                    validator: (rule, value, callback) => {
                      callback()
                    }
                  }],
                  getValueFromEvent: (e: any) => {
                    e.persist()
                    return this.formatInputValue(e.target.value)
                  },
                  initialValue: fullTimeWages || undefined
                })(<Input placeholder='请输入金额' onChange={this.changeBtnStatus} disabled={clock} allowClear maxLength={9} />)}
              </Item>
            </Col>
            <Col span={8}>
              <Item label='全职最低工资是否含社金' {...fromcol}>
                {getFieldDecorator('fullTimeWagesOrnot', {
                  rules: [{
                    required: true,
                    validator: (rule, value, callback) => {
                      callback()
                    }
                  }],
                  initialValue: fullTimeWagesOrnot || 1
                })(
                  <Radio.Group disabled={clock}>
                    <Radio value={1}>是</Radio>
                    <Radio value={2}>否</Radio>
                  </Radio.Group>
                )}
              </Item>
            </Col>
            <Col span={8}>
              <Item label='实习生最低工资' {...fromcol}>
                {getFieldDecorator('reqtraineeMinWages', {
                  rules: [{
                    required: true,
                    validator: (rule, value, callback) => {
                      callback()
                    }
                  }],
                  getValueFromEvent: (e: any) => {
                    e.persist()
                    return this.formatInputValue(e.target.value)
                  },
                  initialValue: traineeMinWages || undefined
                })(<Input placeholder='请输入金额' onChange={this.changeBtnStatus} disabled={clock} allowClear maxLength={9} />)}
              </Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Item label='小时工最低工资' {...fromcol}>
                {getFieldDecorator('reqtimeMinWages', {
                  rules: [{
                    required: true,
                    validator: (rule, value, callback) => {
                      callback()
                    }
                  }],
                  getValueFromEvent: (e: any) => {
                    e.persist()
                    return this.formatInputValue(e.target.value)
                  },
                  initialValue: timeMinWages || undefined
                })(<Input placeholder='请输入金额' onChange={this.changeBtnStatus} disabled={clock} allowClear maxLength={9} />)}
              </Item>
            </Col>
            <Col span={8}>
              <Item label='社平工资' {...fromcol}>
                {getFieldDecorator('reqsocialWages', {
                  rules: [{
                    required: true,
                    validator: (rule, value, callback) => {
                      callback()
                    }
                  }],
                  getValueFromEvent: (e: any) => {
                    e.persist()
                    return this.formatInputValue(e.target.value)
                  },
                  initialValue: socialWages || undefined
                })(<Input placeholder='请输入金额' onChange={this.changeBtnStatus} disabled={clock} allowClear maxLength={9} />)}
              </Item>
            </Col>
            <Col span={8}>
              <Item label='加班基数' {...fromcol}>
                {getFieldDecorator('reqovertimeBase', {
                  rules: [{
                    required: true,
                    validator: (rule, value, callback) => {
                      callback()
                    }
                  }],
                  getValueFromEvent: (e: any) => {
                    e.persist()
                    return this.formatInputValue(e.target.value)
                  },
                  initialValue: overtimeBase || undefined
                })(<Input placeholder='请输入金额' onChange={this.changeBtnStatus} disabled={clock} allowClear maxLength={9} />)}
              </Item>
            </Col>
          </Row>
          <Divider />
          {
            (status === 1 || clock === false) &&
              <Row className='action'>
                <Col>
                  {
                    this.isAuthenticated(this.AuthorityList.salaryparametersetting[3]) &&
                    <Button className={ !btnStatus ? 'actionbtn confirmbtn' : 'actionbtn distableconfirmbtn' } disabled={btnStatus} onClick={this.confirmBtn}>确定</Button>
                  }
                  <Button className='actionbtn cancelbtn' onClick={this.cancelOrreturnBtn}>{this.isAuthenticated(this.AuthorityList.salaryparametersetting[3]) ? '取消' : '返回'}</Button>
                </Col>
              </Row>
          }
          { status === 2 && clock &&
            <Row className='action'>
              <Col>
                <Button className='actionbtn confirmbtn' onClick={this.cancelOrreturnBtn}>返回</Button>
              </Col>
            </Row>
          }
        </Form>
        { status === 2 &&
          <Row className='historysetisunfold'>
            <p>历史设置</p>
            <p><img src={ downOrupstatus ? up : down } className='downorup' onClick={this.switchimg} /></p>
          </Row>
        }
        { downOrupstatus && historyRecord.map((item: any) => (
          <Row className='cardmessage' key={item.entityId}>
            <Row className='headertitle'>
              <span>{item.entity}</span>
              <span>有效日期：{item.effectiveDateStart}-{item.effectiveDateEnd}</span>
            </Row>
            <Row>
              <Col span={8}>
                <Item label='全职最低工资' {...fromcol}>
                  {getFieldDecorator('fullTimeWages', {
                    rules: [{ required: true }]
                  })(<span>{this.disposeValue(item.fullTimeWages)}</span>)}
                </Item>
              </Col>
              <Col span={8}>
                <Item label='全职最低工资是否含社金' {...fromcol}>
                  {getFieldDecorator('fullTimeWagesOrnot', {
                    rules: [{ required: true }]
                  })(<span>{(item.fullTimeWagesOrnot === 1 && '是') || (item.fullTimeWagesOrnot === 2 && '否') || (item.fullTimeWagesOrnot && '未维护')}</span>)}
                </Item>
              </Col>
              <Col span={8}>
                <Item label='实习生最低工资' {...fromcol}>
                  {getFieldDecorator('traineeMinWages', {
                    rules: [{ required: true }]
                  })(<span>{this.disposeValue(item.traineeMinWages)}</span>)}
                </Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Item label='小时工最低工资' {...fromcol}>
                  {getFieldDecorator('timeMinWages', {
                    rules: [{ required: true }]
                  })(<span>{this.disposeValue(item.timeMinWages)}</span>)}
                </Item>
              </Col>
              <Col span={8}>
                <Item label='社平工资' {...fromcol}>
                  {getFieldDecorator('socialWages', {
                    rules: [{ required: true }]
                  })(<span>{this.disposeValue(item.socialWages)}</span>)}
                </Item>
              </Col>
              <Col span={8}>
                <Item label='加班基数' {...fromcol}>
                  {getFieldDecorator('overtimeBase', {
                    rules: [{ required: true }]
                  })(<span>{this.disposeValue(item.overtimeBase)}</span>)}
                </Item>
              </Col>
            </Row>
          </Row>
        ))}
      </div>
    )
  }
}
export default Form.create<FormProps>()(SalaryStandardFirstSet)
