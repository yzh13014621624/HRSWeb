/**
 * @author maqian
 * @createTime 2019/03/28
 * @description 新增合同
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent, BasicModal } from '@components/index'
import { hot } from 'react-hot-loader'
import { Form, Select, Button, DatePicker, Spin, Row, Col, Icon, Divider } from 'antd'
import { Prompt } from 'react-router-dom'
import { IconFill } from '@components/icon/BasicIcon'
import { FormComponentProps } from 'antd/lib/form'
import date from '@assets/images/date.png'
import { SysUtil } from '@utils/index'
import moment from 'moment'

import BaseScanedFiles from '../../components/Contract/ScanedFiles'
import BasePDF from '../../components/Contract/PDF'

import './InitialSignatureAddPage.styl'

const Option = Select.Option
const itemLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } }

interface ImgItem {
  uid: number
  url: string
  tempUrl: string
  file?: File
}

interface InitialSignatureAddPageProps extends FormComponentProps {
  // Contract: any
  location?: any
  history?: any
}

@hot(module) // 热更新（局部刷新界面
class InitialSignatureAddPage extends RootComponent<InitialSignatureAddPageProps, any> {
  timerId: any
  timerId1: any
  BasicModal = React.createRef<BasicModal>()
  constructor (props: any) {
    super(props)
    this.timerId = null
    this.timerId1 = null
    this.state = {
      flags: true,
      loading: false,
      listArr: {}, // 添加页面一些显示的数据
      userId: null, // 用户id
      typeList: [], // 合同类型列表,
      list: [],
      disabled: true,
      defaultEndTime: '',
      defaultStartTime: '',
      uploadData: {
        typeName: '',
        hourType: '',
        taxationType: '',
        startTime: '',
        endTime: '',
        probation: ''
      },
      probationList: [], // 试用期列表
      errorMsg: null,
      projectName: null
    }
  }
  componentDidMount () {
    let data = SysUtil.getSessionStorage('InitiaData')
    let uploadData = {
      typeName: undefined,
      hourType: undefined,
      taxationType: undefined,
      startTime: undefined,
      endTime: undefined,
      probation: undefined
      // images: undefined
    }
    const { userId } = data
    let info = SysUtil.getSessionStorage(`InitialSignatureInfo_${userId}`) // 获取缓存的
    if (info) {
      // if (info.images) { // 图片回显
      //   info.images.map((el:any) => {
      //     el.file = FileUtil.dataURLtoBlob(el.bufferURl)
      //     return el
      //   })
      // }
      uploadData = info
      const { typeName, hourType, taxationType, probation, startTime, endTime } = info
      // 如果字段都有，disable则为false，按钮可点击
      const disabled = !(typeName && hourType && taxationType && startTime && endTime && probation)
      this.setState({
        disabled
      })
    }
    // 有数据并且有开始或结束时间
    if (info && (info.startTime || info.endTime)) { // 获取session，回显合同日期
      if (info.startTime) {
        let date1 = new Date(info.startTime)
        let timetimp1 = date1.getTime() // 获取合同开始日期的时间戳
        let defaultStartTime1 = this.timeFormart(timetimp1) // 将时间戳转成YYYY-MM-DD日期格式
        this.setState({
          defaultStartTime: moment(defaultStartTime1, 'YYYY-MM-DD')
        })
      }
      if (info.endTime) {
        let date2 = new Date(info.endTime)
        let timetimp2 = date2.getTime() // 获取合同结束日期的时间戳
        let defaultStartTime2 = this.timeFormart(timetimp2) // 将时间戳转成YYYY-MM-DD日期格式
        this.setState({
          defaultEndTime: moment(defaultStartTime2, 'YYYY-MM-DD')
        })
        this.onConTimeChange(0, info.startTime, info.endTime)
      }
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
    this.axios.request(this.api.contractAddInfo, { // 获取用户信息详情请求
      userId: userId,
      baseType: 1
    }, true).then((res:any) => {
      const { contractTypeList, entryTime, projectName } = res.data
      this.setState({
        projectName,
        listArr: res.data,
        typeList: contractTypeList, // 合同类型
        loading: false
      })
      // if (info && (info.typeName === 1 || info.typeName === 2)) { // 如果合同类型为上嘉（1）或盒马（2）时，合同日期赋值
      // }
      this.getTimes(entryTime)
    }).catch((err:any) => {
      this.error(err.msg[0])
      this.setState({
        loading: false
      })
    })
  }
  getTimes = (time:any, types?:any) => { // 一进入页面时，默认设置合同的开始时间与结束时间
    let data = new Date(time)
    let timetimp = data.getTime() // 获取指定日期的时间戳
    let defaultStartTimes = this.timeFormart(timetimp) // 将时间戳进行YYYY-MM-DD格式化
    let defaultStartTime = moment(defaultStartTimes, 'YYYY-MM-DD')
    this.setState({
      defaultStartTime
    })
    this.props.form.setFieldsValue({
      startTime: defaultStartTime
    })
  }
  cancelBtn = () => {
    // 跳转到首页，并清楚session
    this.routerLink('/home/ContractPage?key=1')
    SysUtil.clearSession('InitiaData')
  }
  routerLink = (path:string) => { // 路由跳转
    this.props.history.push(path)
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

  // 提交
  handleSumbit = () => { // 点击保存，提交数据时回调
    const { userId } = this.state
    this.props.form.validateFields(async (err:any, data:any) => {
      if (!err) {
        this.setState({
          disabled: true,
          flags: false
        })
        let dataParm: any = {
          userId: userId,
          baseType: 1,
          hourType: data.hourType, // 工时
          taxationType: data.taxationType, // 计税,
          probation: data.probation, // 试用期
          type: data.typeName, // 合同
          images: [], // 图片
          contractPdf: '', // pdf 文件地址
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
            SysUtil.clearSession('InitiaData')
            SysUtil.clearSession(`InitialSignatureInfo_${userId}`)
          }
        }).catch(() => {
          this.setState({
            disabled: false
          })
        })
      }
    })
  }
  // 计算N年后,YYYYMMDD
  // startdate：为开始时间，格式YYYYMMDD
  // nextYear：为间隔年月，如1表示一年后，2表示两年后
  // type : 为endTime代表结束时间的前一天
  getAfterNYear = (startdate:any, nextYear:any, type?:any) => {
    let expriedYear = parseInt(startdate.substring(0, 4)) + nextYear // 获取起始年加几年
    let expriedMonth = startdate.substring(4, 6)
    let expriedDay = startdate.substring(6)
    let data = new Date(expriedYear + expriedMonth + expriedDay) // YYYY-MM-DD格式化成京8
    let timetimp = data.getTime() // 获取京8时间戳
    if (type === 'end') {
      timetimp = timetimp - 86400000
    }
    let dataAll = this.timeFormart(timetimp) // 将时间戳进行YYYY-MM-DD格式化
    return dataAll
  }

  timeFormart = (data:any) => { // 将时间戳格式化成YYYY-MM-DD日期（日期减去1天）
    let date = new Date(data)
    let Y = date.getFullYear() + '-'
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    let D = (date.getDate() + 1 <= 10 ? '0' + date.getDate() : date.getDate())
    return Y + M + D
  }

  disabledDate = (current:any) => { // 将大于入职日期时间进行禁用
    let { entryTime } = this.state.listArr
    let data = new Date(entryTime)
    let timetimp = data.getTime()
    timetimp = timetimp + 86400000
    let cur = moment(current).format('YYYY-MM-DD')
    let dataAll = this.timeFormart(timetimp)
    return entryTime && cur < dataAll
  }
  getFieldsValue = () => { // data 传递过来的参数  num 值改变时的参数
    const { userId } = this.state
    if (this.timerId) {
      clearTimeout(this.timerId)
    }
    this.timerId = setTimeout(() => {
      const filedsValue = this.props.form.getFieldsValue()
      const { typeName, hourType, taxationType, probation, startTime, endTime } = filedsValue
      const disabled = !(typeName && hourType && taxationType && startTime && endTime && probation)
      this.setState({
        disabled
      })
      delete filedsValue.images
      // 表单信息发生改变时，进行session存储
      if (userId) {
        SysUtil.setSessionStorage(`InitialSignatureInfo_${userId}`, filedsValue)
      }
    }, 0)
  }
  componentWillUnmount () {
    clearTimeout(this.timerId)
    clearTimeout(this.timerId1)
  }
  /** 模态框的显示 num: 0 关闭 1 打开  msg: 显示的消息 */
  handleModal = (num:number, msg?:string) => {
    const { handleOk, handleCancel } = this.BasicModal.current as BasicModal
    if (num === 0) {
      handleCancel()
    } else {
      this.setState({
        errorMsg: msg || ''
      })
      handleOk()
    }
  }
  handleModalOk = () => {
    const { handleCancel } = this.BasicModal.current as BasicModal
    handleCancel()
  }

  onConTimeChange = (num?:any, startTime?:any, endTime?:any) => {
    const { projectName } = this.state
    let sTime = moment(startTime, 'YYYY-MM-DD').format('YYYY-MM-DD')
    let eTime = moment(endTime, 'YYYY-MM-DD').format('YYYY-MM-DD')
    if (startTime) { // 当有开始时间时
      this.axios.request(this.api.linkageTryMonth, {
        startTime: sTime,
        endTime: eTime,
        projectName
      }).then(({ data }) => {
        this.setState({
          probationList: data
        })
      }).catch((err:any) => {
        this.error(err.msg[0])
      })
    } else if (num === 1) { // num === 1时，代表还没有选择合同结束日期
      this.handleModal(1, '请先选择合同类型')
    }
    if (endTime) {
      this.props.form.setFieldsValue({ // 当类型不等于上嘉或盒马时，清空合同结束时间与试用期
        probation: undefined
      })
      this.getFieldsValue()
    }
  }

  colseModel = () => {
    this.props.form.setFieldsValue({
      endTime: null
    })
  }

  render () {
    let promptFlg = false
    let data = SysUtil.getSessionStorage('InitiaData')
    const { userId } = data
    let obj = SysUtil.getSessionStorage(`InitialSignatureInfo_${userId}`)
    if (obj) {
      promptFlg = true
    }
    const { getFieldDecorator } = this.props.form
    const { listArr, loading, typeList, disabled, uploadData, flags, defaultEndTime, defaultStartTime, probationList, errorMsg } = this.state
    const { typeName, hourType, taxationType, probation } = uploadData
    const {
      projectName, projectNumber, idCard, passportCard, userName, organize, sjNumber, entryTime, entity,
      roleType, images, contractPdf
    } = listArr
    return (
      <div id="contract-add-page">
        <Spin tip="Loading..." spinning={loading}>
          <Form layout="inline">
            <Row>
              <Col span={6}>
                <Form.Item label="项目" className="cfrom-item" labelAlign='left'>
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
                      {/* <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" className="range-width-300" onChange={this.getFieldsValue.bind(this, '合同类型')}> */}
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
                    initialValue: uploadData ? hourType : undefined,
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
                    initialValue: uploadData ? taxationType : undefined,
                    rules: [{
                      required: true, message: '请选择计税类型'
                    }]
                  })(
                    <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placeholder="请选择" className="select-width-220" onChange={this.getFieldsValue.bind(this)}>
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
                      initialValue: defaultStartTime || null,
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
                      initialValue: defaultEndTime || null,
                      rules: [{
                        required: true, message: '请选择结束日期'
                      }]
                    })(
                      <DatePicker format='YYYY-MM-DD' disabledDate={this.disabledDate} onChange={this.onConTimeChange.bind(this, 1, defaultStartTime)} allowClear={false} suffixIcon={(<img src={date}/>)}/>
                    )}
                  </Form.Item>
                  <div className='content-tips'><Icon component={IconFill} className="tips-icon" /><span style={{ marginLeft: '0.03rem' }}>若合同无固定期限，合同有效时间设置必须≥100年，用于电子合同有无固定期限的判断！</span></div>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="试用期" className="cfrom-item" {...itemLayout}>
                  {getFieldDecorator('probation', {
                    initialValue: probation,
                    rules: [{
                      required: true, message: '请选择试用期'
                    }]
                  })(
                    <Select placeholder="请选择" className="select-width-220" onChange={this.getFieldsValue.bind(this)}>
                      {
                        probationList.map((el:any) => {
                          return <Option key={el.id} value={el.id}>{el.name}</Option>
                        })
                      }
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Divider />
            <Form.Item style={{ display: 'block' }} className="upload-img">
              {getFieldDecorator('images', {
                initialValue: images
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
              <Button disabled={disabled} onClick={() => this.preventMoreClick(this.handleSumbit)} className="sumbit-btn" type="primary">确定</Button>
              <Button onClick={this.cancelBtn} className="cancel-btn">取消</Button>
            </Form.Item>
          </Form>
        </Spin>
        {flags ? <Prompt when={promptFlg} message={`InitialSignatureInfo_${userId}`}></Prompt> : null}
        <BasicModal colseModel={this.colseModel} ref={this.BasicModal} title="提示">
          <p className="delete-p"><span>{errorMsg}</span></p>
          <Row>
            <Button onClick={() => (this.handleModalOk())} type="primary">确认</Button>
          </Row>
        </BasicModal>
      </div>
    )
  }
}
const ContractForm = Form.create<InitialSignatureAddPageProps>()(InitialSignatureAddPage)
export default ContractForm
