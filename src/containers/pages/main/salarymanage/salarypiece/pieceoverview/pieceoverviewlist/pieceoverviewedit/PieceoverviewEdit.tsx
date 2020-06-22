/*
 * @description: 项目-计件凭证详情
 * @author: qiuyang
 * @lastEditors: qiuyang
 * @Date: 2019-09-24 13:52:46
 * @LastEditTime: 2020-05-28 11:43:25
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { FormComponentProps } from 'antd/lib/form'
import { RootComponent } from '@components/index'
import { Button, Form, Row, Input, Icon, Col, Divider } from 'antd'
import { BaseProps, KeyValue } from 'typings/global'
import { IconPer1, IconPer9 } from '@components/icon/BasicIcon'
import Compute from '../../../Compute'
import { FormatInputValue, HttpUtil } from '@utils/index'
import './Index.styl'
import moment from 'moment'

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
  brightBtn: boolean
  dataSet: KeyValue
  piece: KeyValue
  salaryList: KeyValue
  ppDataList: KeyValue[]
}

interface FormProps extends BaseProps, FormComponentProps{}

class PieceoverviewEdit extends RootComponent<FormProps, State> {
  necessary: KeyValue = HttpUtil.parseUrl(this.props.location.search)
  constructor (props: FormProps) {
    super(props)
    this.state = {
      brightBtn: true,
      salaryList: {}, // 存储本月薪资标准与额定出勤天数
      dataSet: {}, // 存储所有详情数据
      piece: {}, // 存储计算好的计件收入，非计件收入，计件奖金
      ppDataList: [] // 存储计件参数-详情
    }
  }

  componentDidMount = () => {
    // 拿到计件参数-详情
    const { necessary: { pvId, piProjectId } } = this
    let ppDataList: any[] = []
    this.axios.request(this.api.PieceoverviewInfo, { pvId }).then(({ data }) => {
      const {
        collectGoods,
        upShelf,
        repairGoods,
        rfLabel,
        rfBox,
        rfRow,
        zeroPick,
        pvHourNum,
        pvNoHourNum,
        pvCoe,
        tryEndTime,
        probationBaseSalary, // 试用期基本工资
        salaryStandard, // 本月薪资标准
        ratedAttend,
        zeroUp,
        zeroDown,
        crossDocking,
        moveLibrary,
        pvTime } = data
      const detailed = {
        reqcollectGoods: collectGoods, // 收货
        requpShelf: upShelf, // 上架
        reqrepairGoods: repairGoods, // 补货
        reqrfLabel: rfLabel, // 整箱拣货-标签拣选
        reqrfBox: rfBox, // 整箱拣货-RF拣选（每箱）
        reqrfRow: rfRow, // 整箱拣货-RF拣选（每行）
        reqzeroPick: zeroPick, // 拆零拣货
        reqpvHourNum: pvHourNum, // 本月计件小时数
        reqpvNoHourNum: pvNoHourNum, // 本月非计件小时数
        reqpvCoe: pvCoe, // 计件系数
        reqzeroUp: zeroUp,
        reqzeroDown: zeroDown,
        reqcrossDocking: crossDocking,
        reqmoveLibrary: moveLibrary
      }
      const originalData = {
        collectGoods,
        upShelf,
        repairGoods,
        rfLabel,
        rfBox,
        rfRow,
        zeroPick,
        pvHourNum,
        pvNoHourNum,
        zeroUp,
        zeroDown,
        crossDocking,
        moveLibrary
      }
      setTimeout(() => {
        let { disabledButton } = this.watchFieldsValues(originalData)
        this.setState({
          brightBtn: disabledButton
        })
      }, 0)
      const salaryList = {
        // 没有薪资试用期直接取baseSalary（基本工资），有则根据月份判断是取试用期基本工资还是基本工资
        salaryStandard: Number(salaryStandard), // 本月薪资标准
        ratedAttend // 额定出勤天数
      }
      this.axios.request(this.api.getParameterHis, { piProjectId, pvTime }).then(({ data }) => {
        ppDataList = data.ppDataList
        const piece = Compute.ComputePiece(ppDataList, detailed, salaryList)
        this.setState({
          piece,
          ppDataList
        })
      })
      this.setState({
        dataSet: data,
        salaryList
      })
    })
  }

  // 表单变化判断保存按钮是否高亮
  inputOnChange = (e: any) => {
    const { salaryList, ppDataList } = this.state
    setTimeout(() => {
      let { disabledButton } = this.watchFieldsValues(this.props.form.getFieldsValue())
      let piece = Compute.ComputePiece(ppDataList, this.props.form.getFieldsValue(), salaryList)
      this.setState({
        brightBtn: disabledButton,
        piece
      })
    }, 0)
  }

  // 取消按钮
  cancel = () => {
    const { necessary: { piProjectId }, state: { dataSet: { pvTime, pipName } } } = this
    this.props.history.push(`/home/salarypiece/SalaryPieceOverview/pieceoverviewlist?piProjectId=${piProjectId}&pvTime=${pvTime}&pipName=${pipName}`)
  }

  // 保存按钮
  conserveBtn = () => {
    const { necessary, state: { dataSet } } = this
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
      pvHourNum: reqpvHourNum,
      pvNoHourNum: reqpvNoHourNum,
      pvCoe: reqpvCoe,
      zeroUp: reqzeroUp,
      zeroDown: reqzeroDown,
      crossDocking: reqcrossDocking,
      moveLibrary: reqmoveLibrary,
      pvId: necessary.pvId,
      piProjectId: dataSet.piProjectId,
      userId: dataSet.userId,
      pvTime: dataSet.pvTime
    }
    if (Number(reqpvCoe) !== 0) {
      this.axios.request(this.api.PieceoverviewEdit, data).then(({ code }) => {
        if (code === 200) {
          const { necessary: { piProjectId }, state: { dataSet: { pvTime, pipName } } } = this
          this.$message.success('保存成功')
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
      piece,
      dataSet: {
        projectName, projectNumber, sjNumber, userName, organize, entity, pvTime, pipName, pipAddress, idCard,
        collectGoods, upShelf, repairGoods, pvCoe, pvHourNum, pvNoHourNum, rfBox, rfLabel, rfRow, zeroPick,
        isClock, salaryType, zeroUp, zeroDown, crossDocking, moveLibrary
      }
    } = this.state
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
            <span className='pieceoverviewInfo-title-text'> 员工计件凭证明细</span>
          </Row>
          <Row>
            <Col span={9}>
              <Item label='收货（每托盘/数量）' className='pieceoverviewInfo-input' labelCol={{ span: 12 }} wrapperCol = {{ span: 9 }}>
                { getFieldDecorator('reqcollectGoods', {
                  initialValue: collectGoods,
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
                  initialValue: upShelf,
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
                  initialValue: repairGoods,
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
                  initialValue: rfLabel,
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
                  initialValue: rfBox,
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
                  initialValue: rfRow,
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
                  initialValue: zeroPick,
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
                  initialValue: zeroUp,
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
                  initialValue: zeroDown,
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
                  initialValue: crossDocking,
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
                  initialValue: moveLibrary,
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
                  initialValue: toFixed(pvHourNum),
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
                  initialValue: Number(pvNoHourNum) ? toFixed(pvNoHourNum) : 0,
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
                })(<Input allowClear onChange={this.inputOnChange} placeholder="请输入数值" disabled = {isClock || salaryType === '计薪制'}></Input>) }
              </Item>
            </Col>
          </Row>
          <Row>
            <Col span={9}>
              <Item label='计件收入' className='pieceoverviewInfo-input' labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                <span>{piece.priceNum}</span>
              </Item>
            </Col>
            <Col span={9}>
              <Item label='非计件收入' className='pieceoverviewInfo-input' labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                <span>{salaryType === '计薪制' ? 0 : piece.priceNumNot}</span>
              </Item>
            </Col>
          </Row>
          <Row>
            <Col span={9}>
              <Item label='计件系数' className='pieceoverviewInfo-input' labelCol={{ span: 12 }} wrapperCol={{ span: 9 }}>
                { getFieldDecorator('reqpvCoe', {
                  initialValue: toFixed(pvCoe) || 1,
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
            <Col span={9}>
              <Item label='计件奖金' className='pieceoverviewInfo-input' labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                <span>{piece.priceBonus}</span>
              </Item>
            </Col>
          </Row>
          <Divider/>
          { this.isAuthenticated(this.AuthorityList.salarypiece[2]) && !isClock && <div><Button onClick={this.conserveBtn} className="contract-page-button" type="primary" disabled={brightBtn}>保存</Button><Button className="cancel-btn" onClick = {this.cancel}>取消</Button></div> }
          { (!this.isAuthenticated(this.AuthorityList.salarypiece[2]) || isClock) && <Button className="contract-page-button" type="primary" onClick = {this.cancel}>返回</Button>}
        </Form>
      </div>
    )
  }
}
export default Form.create()(PieceoverviewEdit)
