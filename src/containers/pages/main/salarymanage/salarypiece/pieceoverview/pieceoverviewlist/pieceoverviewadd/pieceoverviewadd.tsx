/*
 * @description: 项目-计件凭证新增
 * @author: qiuyang
 * @lastEditors: qiuyang
 * @Date: 2019-09-24 13:52:46
 * @LastEditTime : 2019-12-19 17:50:22
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { FormComponentProps } from 'antd/lib/form'
import { RootComponent } from '@components/index'
import { Prompt } from 'react-router-dom'
import { Button, Form, Row, Input, Icon, Col, Divider } from 'antd'
import { BaseProps, KeyValue } from 'typings/global'
import { IconPer1, IconPer9 } from '@components/icon/BasicIcon'
import { FormatInputValue, HttpUtil, SysUtil } from '@utils/index'
import '../pieceoverviewedit/Index.styl'
import Compute from '../../../Compute'

const { Item } = Form

const labelLayout = {
  labelCol: {
    span: 5
  },
  wrapperCol: {
    span: 19
  }
}
const formLayout = {
  labelCol: {
    span: 10
  },
  wrapperCol: {
    span: 9
  }
}

const toFixed = (n: string) => {
  n = n || '0'
  return parseFloat(n).toFixed(3)
}

interface State {
  projectUserId: string
  brightBtn: boolean
  dataSet: KeyValue
  pieceoverviewAddDataInfo: KeyValue
}

interface FormProps extends BaseProps, FormComponentProps{}

class PieceoverviewAdd extends RootComponent<FormProps, State> {
  necessary: KeyValue = this.props.location.state || JSON.parse(localStorage.getItem('pieceoverviewUserInfo') as string)
  timerId: any = null
  constructor (props: FormProps) {
    super(props)
    this.state = {
      projectUserId: '', // 缓存唯一标识
      brightBtn: true,
      pieceoverviewAddDataInfo: this.getLocaleStoragedPieceoverviewInfo('PieceoverviewAdd'),
      dataSet: {} // 存储所有详情数据
    }
  }

  UNSAFE_componentWillMount = () => {
    // 拿到计件参数-详情
    const { necessary: { userId, piProjectId, pvTime } } = this
    this.setState({
      projectUserId: String(userId) + String(piProjectId)
    }, () => {
      this.axios.request(this.api.GetPieceworkUserInfo, { userId, pvTime }).then(({ data }) => {
        this.inputOnChange(1)
        this.setState({
          dataSet: data
        }, () => {
          setTimeout(() => {
            let { disabledButton } = this.watchFieldsValues(this.getLocaleStoragedPieceoverviewInfo('PieceoverviewAdd'))
            this.setState({
              brightBtn: disabledButton
            })
          }, 0)
        })
      })
    })
  }

  componentWillUnmount () {
    clearTimeout(this.timerId)
  }

  // 表单变化判断保存按钮是否高亮
  inputOnChange = (e: any) => {
    const { dataSet: { salaryType } } = this.state
    if (this.timerId) clearTimeout(this.timerId)
    this.timerId = setTimeout(() => {
      const fieldsValue = this.props.form.getFieldsValue()
      if (salaryType === '计薪制') {
        delete fieldsValue.reqpvNoHourNum
      }
      let { disabledButton } = this.watchFieldsValues(fieldsValue)
      this.setState({
        brightBtn: disabledButton
      })
      if ((typeof e) !== 'number') this.setLocaleStoragedPieceoverviewInfo('PieceoverviewAdd', fieldsValue)
    }, 0)
  }

  // 根据 projectUserId 设置 localeStorage 中指定的信息
  setLocaleStoragedPieceoverviewInfo (name: string, info: any) {
    const { projectUserId } = this.state
    let pieceoverviewInfo = SysUtil.getLocalStorage(name)
    if (!pieceoverviewInfo) pieceoverviewInfo = {}
    pieceoverviewInfo[projectUserId] = info
    SysUtil.setLocalStorage(name, pieceoverviewInfo)
  }

  // 根据 userId + piProjectId(保证唯一性) 读取 localeStorage 中指定的信息
  getLocaleStoragedPieceoverviewInfo (name: string) {
    const { userId, piProjectId } = this.necessary
    const projectUserId = String(userId) + String(piProjectId)
    const pieceoverviewInfo = SysUtil.getLocalStorage(name)
    // 在没有缓存的时候保证默认值不报错
    const tempStaffInfo = {
      reqcollectGoods: undefined,
      requpShelf: undefined,
      reqrepairGoods: undefined,
      reqrfLabel: undefined,
      reqrfBox: undefined,
      reqrfRow: undefined,
      reqzeroPick: undefined,
      reqpvHourNum: undefined,
      reqpvNoHourNum: undefined,
      reqpvCoe: undefined,
      reqzeroUp: undefined,
      reqzeroDown: undefined,
      reqcrossDocking: undefined,
      reqmoveLibrary: undefined
    }
    return (pieceoverviewInfo && pieceoverviewInfo[projectUserId]) || tempStaffInfo
  }

  // 根据 useId 移除 localeStorage 中指定的信息
  clearLocaleStoragedPieceoverviewInfo (name: string) {
    const { projectUserId } = this.state
    let pieceoverviewInfo = SysUtil.getLocalStorage(name)
    if (!pieceoverviewInfo) pieceoverviewInfo = {}
    delete pieceoverviewInfo[projectUserId]
    if (!Object.keys(pieceoverviewInfo).length) SysUtil.clearLocalStorage(name)
    else SysUtil.setLocalStorage(name, pieceoverviewInfo)
  }

  // 取消按钮
  cancel = () => {
    const { necessary: { piProjectId, pvTime, pipName } } = this
    this.props.history.replace({ pathname: `/home/salarypiece/SalaryPieceOverview/pieceoverviewlist?piProjectId=${piProjectId}&pvTime=${pvTime}&pipName=${pipName}`, state: '1' })
  }

  // 保存按钮
  conserveBtn = () => {
    const { necessary: { piProjectId, pvTime, userId, pipName } } = this
    const {
      reqcollectGoods,
      requpShelf,
      reqrepairGoods,
      reqrfLabel,
      reqrfBox,
      reqrfRow,
      reqzeroPick,
      reqpvHourNum,
      reqpvNoHourNum,
      reqpvCoe,
      reqzeroUp,
      reqzeroDown,
      reqcrossDocking,
      reqmoveLibrary } = this.props.form.getFieldsValue()
    const data = {
      collectGoods: reqcollectGoods,
      upShelf: requpShelf,
      repairGoods: reqrepairGoods,
      rfLabel: reqrfLabel,
      rfBox: reqrfBox,
      rfRow: reqrfRow,
      zeroPick: reqzeroPick,
      zeroUp: reqzeroUp,
      zeroDown: reqzeroDown,
      crossDocking: reqcrossDocking,
      moveLibrary: reqmoveLibrary,
      pvHourNum: toFixed(reqpvHourNum),
      pvNoHourNum: toFixed(reqpvNoHourNum),
      pvCoe: toFixed(reqpvCoe),
      userId,
      pvTime,
      piProjectId
    }
    if (Number(reqpvCoe) !== 0) {
      this.axios.request(this.api.PieceoverviewEdit, data).then(({ code }) => {
        if (code === 200) {
          this.clearLocaleStoragedPieceoverviewInfo('PieceoverviewAdd')
          SysUtil.clearSession('PieceoverviewAdd')
          this.$message.success('新增成功')
          this.props.history.replace(`/home/salarypiece/SalaryPieceOverview/pieceoverviewlist?piProjectId=${piProjectId}&pvTime=${pvTime}&pipName=${pipName}`)
        }
      })
    } else {
      this.$message.warn('计件系数不能为零')
    }
  }

  // 控制form表单输入框的值
  transformInputValue = (value: string, type?: boolean) => {
    if (type) {
      return Compute.toFixed(value)
    } else {
      return FormatInputValue.parsetInt(value)
    }
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const {
      brightBtn,
      dataSet: {
        projectName, projectNumber, sjNumber, userName, organize, entity, idCard, salaryType,
        isClock
      },
      pieceoverviewAddDataInfo: {
        reqcollectGoods, requpShelf, reqrepairGoods, reqrfLabel, reqrfBox, reqrfRow, reqzeroPick,
        reqpvHourNum, reqpvNoHourNum, reqpvCoe, reqzeroUp, reqzeroDown, reqcrossDocking, reqmoveLibrary
      }
    } = this.state
    const { necessary: { pvTime, pipName, pipAddress, userId, piProjectId } } = this
    return (
      <div id='pieceoverviewInfo'>
        <Form {...labelLayout}>
          <Row className='pieceoverviewInfo-title-icon'>
            <Icon component={IconPer1}/>
            <span className='pieceoverviewInfo-title-text'> 员工信息</span>
          </Row>
          <Row className = 'pieceoverviewInfo-top-info'>
            <Row>
              <Col span={7}>
                <Form.Item label='项目'>
                  <span className='text-color'>{projectName || '---'}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label='工号'>
                  <span className='text-color'>{projectNumber || '---'}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label='管理编号'>
                  <span className='text-color'>{sjNumber || '---'}</span>
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item label='姓名'>
                  <span className='text-color'>{userName || '---'}</span>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <Item label='组织'>
                  <span className='text-color'>{organize || '---'}</span>
                </Item>
              </Col>
              <Col span={6}>
                <Item label='法人主体'>
                  <span className='text-color'>{entity || '---'}</span>
                </Item>
              </Col>
              <Col span={6}>
                <Item label='月度'>
                  <span className='text-color'>{pvTime || '---'}</span>
                </Item>
              </Col>
              <Col span={5}>
                <Item label='计件项目'>
                  <span className='text-color'>{pipName || '---'}</span>
                </Item>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <Item label='地址' wrapperCol={{ span: 16 }}>
                  <span className='text-color'>{pipAddress || '---'}</span>
                </Item>
              </Col>
              <Col span={6}>
                <Item label='身份证号码'>
                  <span className='text-color'>{idCard || '---'}</span>
                </Item>
              </Col>
              <Col span={6}>
                <Item label='计薪类型'>
                  <span className='text-color'>{salaryType || '---'}</span>
                </Item>
              </Col>
            </Row>
          </Row>
          <Divider/>
        </Form>
        <Form {...formLayout}>
          <Row className='pieceoverviewInfo-title-icon' style={{ margin: '40px 0px 50px' }}>
            <Icon component={IconPer9}/>
            <span className='pieceoverviewInfo-title-text'> 员工计件凭证</span>
          </Row>
          <Row>
            <Col span={9}>
              <Item label='收货（每托盘/数量）' className='pieceoverviewInfo-input' labelCol={{ span: 12 }} wrapperCol = {{ span: 9 }}>
                { getFieldDecorator('reqcollectGoods', {
                  initialValue: reqcollectGoods,
                  rules: [
                    {
                      required: true,
                      validator: (rule, value, callback) => {
                        callback()
                      }
                    }
                  ],
                  getValueFromEvent: (e: any) => {
                    e.persist()
                    return this.transformInputValue(e.target.value)
                  }
                })(<Input allowClear onChange={this.inputOnChange} placeholder="请输入整数" disabled = {isClock}></Input>) }
              </Item>
            </Col>
            <Col span={9}>
              <Item label='上架（每托盘/数量）' className='pieceoverviewInfo-input' labelCol={{ span: 12 }} wrapperCol = {{ span: 9 }}>
                { getFieldDecorator('requpShelf', {
                  initialValue: requpShelf,
                  rules: [
                    {
                      required: true,
                      validator: (rule, value, callback) => {
                        callback()
                      }
                    }
                  ],
                  getValueFromEvent: (e: any) => {
                    e.persist()
                    return this.transformInputValue(e.target.value)
                  }
                })(<Input allowClear onChange={this.inputOnChange} placeholder="请输入整数" disabled = {isClock}></Input>) }
              </Item>
            </Col>
          </Row>
          <Row>
            <Col span={9}>
              <Item label='补货（每托盘/数量）' className='pieceoverviewInfo-input' labelCol={{ span: 12 }} wrapperCol = {{ span: 9 }}>
                { getFieldDecorator('reqrepairGoods', {
                  initialValue: reqrepairGoods,
                  rules: [
                    {
                      required: true,
                      validator: (rule, value, callback) => {
                        callback()
                      }
                    }
                  ],
                  getValueFromEvent: (e: any) => {
                    e.persist()
                    return this.transformInputValue(e.target.value)
                  }
                })(<Input allowClear onChange={this.inputOnChange} placeholder="请输入整数" disabled = {isClock}></Input>) }
              </Item>
            </Col>
            <Col span={9}>
              <Item label='整箱拣货-标签拣选（每箱/数量）' className='pieceoverviewInfo-input' labelCol={{ span: 12 }} wrapperCol = {{ span: 9 }}>
                { getFieldDecorator('reqrfLabel', {
                  initialValue: reqrfLabel,
                  rules: [
                    {
                      required: true,
                      validator: (rule, value, callback) => {
                        callback()
                      }
                    }
                  ],
                  getValueFromEvent: (e: any) => {
                    e.persist()
                    return this.transformInputValue(e.target.value)
                  }
                })(<Input allowClear onChange={this.inputOnChange} placeholder="请输入整数" disabled = {isClock}></Input>) }
              </Item>
            </Col>
          </Row>
          <Row>
            <Col span={9}>
              <Item label='整箱拣货-RF拣选（每箱/数量）' className='pieceoverviewInfo-input' labelCol={{ span: 12 }} wrapperCol = {{ span: 9 }}>
                { getFieldDecorator('reqrfBox', {
                  initialValue: reqrfBox,
                  rules: [
                    {
                      required: true,
                      validator: (rule, value, callback) => {
                        callback()
                      }
                    }
                  ],
                  getValueFromEvent: (e: any) => {
                    e.persist()
                    return this.transformInputValue(e.target.value)
                  }
                })(<Input allowClear onChange={this.inputOnChange} placeholder="请输入整数" disabled = {isClock}></Input>) }
              </Item>
            </Col>
            <Col span={9}>
              <Item label='整箱拣货-RF拣选（每行/数量）' className='pieceoverviewInfo-input' labelCol={{ span: 12 }} wrapperCol = {{ span: 9 }}>
                { getFieldDecorator('reqrfRow', {
                  initialValue: reqrfRow,
                  rules: [
                    {
                      required: true,
                      validator: (rule, value, callback) => {
                        callback()
                      }
                    }
                  ],
                  getValueFromEvent: (e: any) => {
                    e.persist()
                    return this.transformInputValue(e.target.value)
                  }
                })(<Input allowClear onChange={this.inputOnChange} placeholder="请输入整数" disabled = {isClock}></Input>) }
              </Item>
            </Col>
          </Row>
          <Row>
            <Col span={9}>
              <Item label='拆零拣货（数量）' className='pieceoverviewInfo-input' labelCol={{ span: 12 }} wrapperCol = {{ span: 9 }}>
                { getFieldDecorator('reqzeroPick', {
                  initialValue: reqzeroPick,
                  rules: [
                    {
                      required: true,
                      validator: (rule, value, callback) => {
                        callback()
                      }
                    }
                  ],
                  getValueFromEvent: (e: any) => {
                    e.persist()
                    return this.transformInputValue(e.target.value)
                  }
                })(<Input allowClear onChange={this.inputOnChange} placeholder="请输入整数" disabled = {isClock}></Input>) }
              </Item>
            </Col>
            <Col span={9}>
              <Item label='拆零上架（每托盘/数量）' className='pieceoverviewInfo-input' labelCol={{ span: 12 }} wrapperCol = {{ span: 9 }}>
                { getFieldDecorator('reqzeroUp', {
                  initialValue: reqzeroUp,
                  rules: [
                    {
                      required: true,
                      validator: (rule, value, callback) => {
                        callback()
                      }
                    }
                  ],
                  getValueFromEvent: (e: any) => {
                    e.persist()
                    return this.transformInputValue(e.target.value)
                  }
                })(<Input allowClear onChange={this.inputOnChange} placeholder="请输入整数" disabled = {isClock}></Input>) }
              </Item>
            </Col>
          </Row>
          <Row>
            <Col span={9}>
              <Item label='拆零下架（每托盘/数量）' className='pieceoverviewInfo-input' labelCol={{ span: 12 }} wrapperCol = {{ span: 9 }}>
                { getFieldDecorator('reqzeroDown', {
                  initialValue: reqzeroDown,
                  rules: [
                    {
                      required: true,
                      validator: (rule, value, callback) => {
                        callback()
                      }
                    }
                  ],
                  getValueFromEvent: (e: any) => {
                    e.persist()
                    return this.transformInputValue(e.target.value)
                  }
                })(<Input allowClear onChange={this.inputOnChange} placeholder="请输入整数" disabled = {isClock}></Input>) }
              </Item>
            </Col>
            <Col span={9}>
              <Item label='越库（每箱/数量）' className='pieceoverviewInfo-input' labelCol={{ span: 12 }} wrapperCol = {{ span: 9 }}>
                { getFieldDecorator('reqcrossDocking', {
                  initialValue: reqcrossDocking,
                  rules: [
                    {
                      required: true,
                      validator: (rule, value, callback) => {
                        callback()
                      }
                    }
                  ],
                  getValueFromEvent: (e: any) => {
                    e.persist()
                    return this.transformInputValue(e.target.value)
                  }
                })(<Input allowClear onChange={this.inputOnChange} placeholder="请输入整数" disabled = {isClock}></Input>) }
              </Item>
            </Col>
          </Row>
          <Row>
            <Col span={9}>
              <Item label='移库（每托盘/数量）' className='pieceoverviewInfo-input' labelCol={{ span: 12 }} wrapperCol = {{ span: 9 }}>
                { getFieldDecorator('reqmoveLibrary', {
                  initialValue: reqmoveLibrary,
                  rules: [
                    {
                      required: true,
                      validator: (rule, value, callback) => {
                        callback()
                      }
                    }
                  ],
                  getValueFromEvent: (e: any) => {
                    e.persist()
                    return this.transformInputValue(e.target.value)
                  }
                })(<Input allowClear onChange={this.inputOnChange} placeholder="请输入整数" disabled = {isClock}></Input>) }
              </Item>
            </Col>
          </Row>
          <Row>
            <Col span={9}>
              <Item label='本月计件小时数' className='pieceoverviewInfo-input' labelCol={{ span: 12 }} wrapperCol = {{ span: 9 }}>
                { getFieldDecorator('reqpvHourNum', {
                  initialValue: reqpvHourNum,
                  rules: [
                    {
                      required: true,
                      validator: (rule, value, callback) => {
                        callback()
                      }
                    }
                  ],
                  getValueFromEvent: (e: any) => {
                    e.persist()
                    return this.transformInputValue(e.target.value, true)
                  }
                })(<Input allowClear onChange={this.inputOnChange} placeholder="请输入数值" disabled = {isClock}></Input>) }
              </Item>
            </Col>
            <Col span={9}>
              <Item label='本月非计件小时数' className='pieceoverviewInfo-input' labelCol={{ span: 12 }} wrapperCol = {{ span: 9 }}>
                { getFieldDecorator('reqpvNoHourNum', {
                  initialValue: reqpvNoHourNum,
                  rules: [
                    {
                      required: true,
                      validator: (rule, value, callback) => {
                        callback()
                      }
                    }
                  ],
                  getValueFromEvent: (e: any) => {
                    e.persist()
                    return this.transformInputValue(e.target.value, true)
                  }
                })(<Input allowClear onChange={this.inputOnChange} placeholder={ isClock || salaryType === '计薪制' ? '0' : '请输入数值' } disabled = {isClock || salaryType === '计薪制'}></Input>) }
              </Item>
            </Col>
          </Row>
          <Row>
            <Col span={9}>
              <Item label='计件系数' className='pieceoverviewInfo-input' labelCol={{ span: 12 }} wrapperCol={{ span: 9 }}>
                { getFieldDecorator('reqpvCoe', {
                  initialValue: reqpvCoe || 1,
                  rules: [
                    {
                      required: true,
                      validator: (rule, value, callback) => {
                        callback()
                      }
                    }
                  ],
                  getValueFromEvent: (e: any) => {
                    e.persist()
                    return this.transformInputValue(e.target.value, true)
                  }
                })(<Input allowClear onChange={this.inputOnChange} placeholder="请输入数值" disabled={isClock}></Input>) }
              </Item>
            </Col>
          </Row>
          <Divider/>
          { !isClock && <div><Button onClick={this.conserveBtn} className="contract-page-button" type="primary" disabled={brightBtn}>确定</Button><Button className="cancel-btn" onClick = {this.cancel}>取消</Button></div> }
          { !!isClock && <Button className="contract-page-button" type="primary" onClick = {this.cancel}>返回</Button>}
        </Form>
        <Prompt when message={`PieceoverviewAdd-${String(userId) + String(piProjectId)}`}/>
      </div>
    )
  }
}
export default Form.create()(PieceoverviewAdd)
