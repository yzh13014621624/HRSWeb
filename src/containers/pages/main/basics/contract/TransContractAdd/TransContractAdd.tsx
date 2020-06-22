/**
 * @author maqian
 * @createTime 2019/04/02
 * @description 初签合同详情
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent } from '@components/index'
import { hot } from 'react-hot-loader'
import { Form, Select, Button, DatePicker, Spin, Row, Col, Icon, Divider } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { SysUtil } from '@utils/index'
import { Prompt } from 'react-router-dom'
import { IconFill } from '@components/icon/BasicIcon'
import date from '@assets/images/date.png'
import moment from 'moment'
import { BaseProps } from 'typings/global'

import BaseScanedFiles from '../components/Contract/ScanedFiles'
import BasePDF from '../components/Contract/PDF'

import './TransContractAdd.styl'

const Option = Select.Option
const itemLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } }
interface ImgItem {
  uid: number
  url: string
  tempUrl: string
  file?: File
}
interface TransContractAddProps extends FormComponentProps, BaseProps {
}
@hot(module) // 热更新（局部刷新界面）
class TransContractAdd extends RootComponent<TransContractAddProps, any> {
  timerId: any
  constructor (props: any) {
    super(props)
    this.timerId = null
    this.state = {
      flags: true,
      loading: false,
      listArr: [], // 添加页面一些显示的数据
      userId: null, // 用户id
      typeList: [], // 合同类型列表,
      list: [],
      disabled: true,
      uploadData: {
        typeName: '',
        hourType: '',
        startTime: '',
        endTime: ''
      }
    }
  }

  routerLink = (path:string) => {
    this.props.history.push(path)
  }

  componentDidMount () {
    let data = SysUtil.getSessionStorage('TransContractData')
    let uploadData = {
      typeName: undefined,
      hourType: undefined,
      times: undefined,
      startTime: undefined,
      endTime: undefined
    }
    const { userId } = data
    let info = SysUtil.getSessionStorage(`TransContractData_${userId}`) // 获取缓存的
    if (info) {
      uploadData = info
      const { typeName, hourType, endTime } = info
      const disabled = !(typeName && hourType && endTime)
      this.setState({
        disabled
      })
    }
    this.setState({
      userId: userId,
      uploadData,
      loading: true
    })
    this.initData(userId, info)
  }
  initData = (userId:any, info:any) => {
    // 获取添加详情
    this.axios.request(this.api.contractAddInfo, {
      userId: userId,
      baseType: 4
    }, true).then((res:any) => {
      const { contractTypeList, endTime } = res.data
      this.setState({
        listArr: res.data,
        typeList: contractTypeList,
        loading: false
      })
    }).catch((err:any) => {
      this.error(err.msg[0])
      this.setState({
        loading: false
      })
    })
  }

  // 处理合同图片
  handleContractPics = async (fileList: ImgItem[], id: string) => {
    const formData = new FormData()
    let imageAry:any = []
    const { insertOssUpload } = this.api
    // 创建对象的信息
    if (fileList) {
      fileList.forEach(item => {
        const { file, tempUrl } = item
        if (file) {
          formData.append('file', file, file.name)
        } else {
          imageAry.push(tempUrl)
        }
      })
    }
    formData.append('userId', id)
    const { data: { code, data, msg } } = await this.axios.upload({
      method: 'post',
      url: insertOssUpload.path,
      data: formData
    })
    return [...imageAry, ...data]
  }

  // 处理合同 pdf 文件
  handleContractPdf = (fileList: ImgItem[]) => {
    if (fileList && fileList.length) return fileList[0].tempUrl
    return ''
  }

  handleSumbit = () => {
    const { userId } = this.state
    this.props.form.validateFields(async (err:any, data:any) => {
      if (!err) {
        this.setState({
          disabled: true,
          flags: false
        })
        let dataParm: any = {
          userId: userId,
          baseType: 4,
          hourType: data.hourType, // 工时
          taxationType: data.taxationType, // 计税,
          type: data.typeName, // 合同
          images: [], // 图片
          startTime: data.startTime.format('YYYY-MM-DD'), // 开始时间
          endTime: data.endTime.format('YYYY-MM-DD') // 结束时间
        }
        const contractPicList = await this.handleContractPics(data.images, userId)
        const contractPdf = this.handleContractPdf(data.pdf)
        dataParm.images = contractPicList
        dataParm.contractPdf = contractPdf
        // 提交发起请求
        this.axios.request(this.api.contractAdd, dataParm).then((res:any) => {
          // 消息提示 路径跳转
          if (res.code === 200) {
            this.$message.success('新增成功')
            this.routerLink('/home/ContractPage?key=1')
            SysUtil.clearSession('TransContractData')
            SysUtil.clearSession(`TransContractData_${userId}`)
          }
        }).catch(() => {
          this.setState({
            disabled: false
          })
        })
      }
    })
  }

  cancelBtn = () => {
    // 跳转到首页，并清楚session
    this.routerLink('/home/ContractPage?key=1')
    SysUtil.clearSession('TransContractData')
  }
  getFieldsValue = () => { // data 传递过来的参数  num 值改变时的参数
    const { listArr, userId } = this.state
    if (this.timerId) {
      clearTimeout(this.timerId)
    }
    this.timerId = setTimeout(() => {
      const filedsValue = this.props.form.getFieldsValue()
      const { typeName, hourType, endTime } = filedsValue
      const disabled = !(typeName && hourType && endTime)
      this.setState({
        disabled
      })
      delete filedsValue.images
      // 表单信息发生改变时，进行session存储
      if (userId) {
        SysUtil.setSessionStorage(`TransContractData_${userId}`, filedsValue)
      }
    }, 0)
  }

  componentWillUnmount () {
    clearTimeout(this.timerId)
  }

  disabledDate = (current: any) => {
    // const dateAry: Array<string> = ['03-31', '06-30', '09-30', '12-31']
    // console.log(!dateAry.includes(currentDate.format('MM-DD')))
    // return !dateAry.includes(currentDate.format('MM-DD'))
    let { startTime } = this.state.listArr
    let data = new Date(startTime)
    let timetimp = data.getTime()
    timetimp = timetimp + 86400000
    let cur = moment(current).format('YYYY-MM-DD')
    let dataAll = this.timeFormart(timetimp)
    return startTime && cur < dataAll
  }

  timeFormart = (data:any) => { // 将时间戳格式化成YYYY-MM-DD日期（日期减去1天）
    let date = new Date(data)
    let Y = date.getFullYear() + '-'
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    let D = (date.getDate() + 1 <= 10 ? '0' + date.getDate() : date.getDate())
    return Y + M + D
  }

  render () {
    let promptFlg = false
    let data = SysUtil.getSessionStorage('TransContractData')
    const { userId } = data
    let obj = SysUtil.getSessionStorage(`TransContractData_${userId}`)
    if (obj) {
      promptFlg = true
    }
    const { getFieldDecorator } = this.props.form
    const { listArr, loading, typeList, btnFont, disabled, uploadData, flags } = this.state
    const { typeName, hourType } = uploadData
    const { projectName, projectNumber, idCard, passportCard, userName, startTime, organize, sjNumber, taxationType, entryTime, entity, roleType, images, endTime, hourType: hourTypes, contractPdf } = listArr
    return (
      <div id="trans-contract-detail-page">
        <Spin tip="Loading..." spinning={loading}>
          <Form layout="inline">
            <Row>
              <Col span={6}>
                <Form.Item label="项目" className="cfrom-item" labelAlign='left' style={{ marginRight: 10 }}>
                  <span>{(listArr ? projectName : undefined) || '- - -'}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="工号" className="cfrom-item" {...itemLayout}>
                  <span>{(listArr ? projectNumber : undefined) || '- - -'}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="管理编号" className="cfrom-item" {...itemLayout}>
                  <span>{(listArr ? sjNumber : undefined) || '- - -'}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="姓名" className="cfrom-item" {...itemLayout}>
                  <span>{(listArr ? userName : undefined) || '- - -'}</span>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <Form.Item label="身份证号码/通行证/护照号" className="cfrom-item" labelAlign='left'>
                  <span>{(listArr ? (idCard || passportCard) : undefined) || '- - -'}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="组织" className="cfrom-item" {...itemLayout}>
                  <span>{(listArr ? organize : undefined) || '- - -'}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="法人主体" className="cfrom-item" {...itemLayout}>
                  <span>{(listArr ? entity : undefined) || '- - -'}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="员工类型" className="cfrom-item" {...itemLayout}>
                  <span>{(listArr ? roleType : undefined) || '- - -'}</span>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <Form.Item label="合 同 类 型" className="cfrom-item" labelAlign='left'>
                  {getFieldDecorator('typeName', {
                    initialValue: uploadData ? typeName : undefined,
                    rules: [{
                      required: true, message: '请选择合同类型'
                    }]
                  })(
                    <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" className="range-width-300" onChange={this.getFieldsValue.bind(this)}>
                      {typeList.map((item:any) => (
                        <Option key={item.id} value={item.id}>
                          {item.typeName}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="工时类型" className="cfrom-item" {...itemLayout}>
                  {getFieldDecorator('hourType', {
                    initialValue: uploadData.hourType ? hourType : hourTypes || undefined,
                    rules: [{
                      required: true, message: '请选择工时类型'
                    }]
                  })(
                    <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" className="select-width-220" onChange={this.getFieldsValue.bind(this)}>
                      <Option key="综合工时" value="综合工时">综合工时</Option>
                      <Option key="不定时工时" value="不定时工时">不定时工时</Option>
                      <Option key="标准工时" value="标准工时">标准工时</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="计税类型" className="cfrom-item" {...itemLayout}>
                  {getFieldDecorator('taxationType', {
                    initialValue: taxationType || undefined,
                    rules: [{
                      required: true, message: '请选择计税类型'
                    }]
                  })(
                    <Select disabled getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" className="select-width-220 date-range-disable">
                      <Option key="居民所得税" value="居民所得税">居民所得税</Option>
                      <Option key="非居民所得税" value="非居民所得税">非居民所得税</Option>
                      <Option key="劳务税" value="劳务税">劳务税</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="入职日期" className="cfrom-item" {...itemLayout}>
                  <span>{(listArr ? entryTime : undefined) || '- - -'}</span>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  label="合同有效时间"
                  style={{ display: 'block' }}
                  labelAlign='left'
                  className="cfrom-item1"
                >
                  <Form.Item >
                    {getFieldDecorator('startTime', {
                      initialValue: (startTime && moment(startTime, 'YYYY-MM-DD')) || null,
                      rules: [{
                        required: true, message: '请选择开始日期'
                      }]
                    })(
                      <DatePicker format='YYYY-MM-DD' allowClear={false} disabled className="date-range-disable" suffixIcon={(<img src={date}/>)}/>
                    )}
                  </Form.Item>
                  <span style={{ textAlign: 'center', margin: ' 0 0.04rem' }}>
                    至
                  </span>
                  <Form.Item >
                    {getFieldDecorator('endTime', {
                      initialValue: (endTime && moment(endTime, 'YYYY-MM-DD')) || null,
                      rules: [{
                        required: true, message: '请选择结束日期'
                      }]
                    })(
                      <DatePicker format='YYYY-MM-DD' disabledDate={this.disabledDate} className="date-range-disable" onChange={this.getFieldsValue.bind(this)} allowClear={false} suffixIcon={(<img src={date}/>)}/>
                    )}
                  </Form.Item>
                  <div className='content-tips'><Icon component={IconFill} className="tips-icon" /><span style={{ marginLeft: '0.03rem' }}>若合同无固定期限，合同有效时间设置必须≥100年，用于电子合同有无固定期限的判断！</span></div>
                </Form.Item>
              </Col>
            </Row>
            <Divider />
            <Form.Item style={{ display: 'block' }} className="upload-img">
              {getFieldDecorator('images', {
                initialValue: images || []
              })(
                <BaseScanedFiles />
              )}
            </Form.Item>
            <Form.Item style={{ display: 'block' }} className="upload-img">
              {getFieldDecorator('pdf', {
                initialValue: contractPdf
              })(
                <BasePDF />
              )}
            </Form.Item>
            <Form.Item className="btn-margin-top">
              <Button onClick={() => this.preventMoreClick(this.handleSumbit)} disabled={disabled} className="sumbit-btn" type="primary">保存</Button>
              <Button onClick={this.cancelBtn} className="cancel-btn">取消</Button>
            </Form.Item>
          </Form>
        </Spin>
        {flags ? <Prompt when={promptFlg} message={`TransContractData_${userId}`}></Prompt> : null}
      </div>
    )
  }
}
const ContractForm = Form.create<TransContractAddProps>()(TransContractAdd)
export default ContractForm
