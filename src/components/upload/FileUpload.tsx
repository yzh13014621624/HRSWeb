/**
 * @author minjie
 * @createTime 2019/04/08
 * @description 文件导入
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import RcUpload from 'rc-upload'
import { RootComponent, BasicModal } from '@components/index'
import { Button, Row, Col, Modal, Progress } from 'antd'
import { inject } from 'mobx-react'

// import js from '@assets/images/js.png' // 警告的图片
import js from '@assets/images/svg/share/fileupload/js.svg' // 警告的图片

import './style/Upload.styl'

interface FileUploadProps {
  name?: string // 上传的字段文件名
  action?: string // 上传的路径
  className?: string // 样式类名
  style?: object // 行内样式
  multiple?:boolean // 是否多选
  accept?:string // 允许上传的类型
  size?:number // 限制的大小
  params?: any // 上传的时候的参数
  successChange?: Function // 成功之后
  mobxGlobal?: any
}

interface FileUploadState {
  accept: string
  fileSize: number
  filename: string
  errmsg: string
  errurl: string
  visible: boolean
  progressPercent: number
}

@inject('mobxGlobal')
export default class FileUpload extends RootComponent<FileUploadProps, FileUploadState> {
  basicModel: React.RefObject<BasicModal>

  constructor (props:any) {
    super(props)
    const { accept, size, name } = this.props
    this.state = {
      accept: accept || '.xlsx,.xls', // '.xlsx,.xls'
      fileSize: size || 10,
      filename: name || 'file',
      errmsg: '',
      errurl: '',
      visible: false,
      progressPercent: 0
    }
    this.basicModel = React.createRef()
  }

  /**
   * 组件销毁之前 对 state 的状态做出处理
   */
  componentWillUnmount () {
    this.setState = (state, callback) => {}
  }

  // 开始上传文件：实际不会进行上传的
  onStart = (file:any) => {
    // 文件开始上传
  }

  onProgress = (file:any) => {
    // console.log(file)
  }

  /** 导出之后的下载 */
  showModel = (url:string, msg:string) => {
    this.setState({
      errmsg: msg,
      errurl: url
    })
    this.handleModal(1) // 正常导入的错误的信息
  }

  onSuccess = (res: any, file: any) => {
    let { successChange } = this.props
    if (successChange) {
      successChange(res)
    } else {
      const { errNum, errMessage, excelUrl, successNum } = res.data
      if (errNum > 0) {
        this.showModel(excelUrl, errMessage)
      } else if (errNum < 1 && successNum > 0) {
        this.$message.success('导入成功！')
      } else {
        this.$message.error('导入失败！')
      }
    }
  }

  onError = (err:any, flg:boolean) => {
    const { code, msg } = err
    this.error(msg || err)
    // if (flg) {
    //   if (code === 401) {
    //     this.error(msg)
    //   } else {
    //     this.error('文件格式不正确！')
    //   }
    // } else {
    //   this.error(err)
    // }
  }

  /* 文件上传的 检查 */
  beforeUpload = (file:any, fileList:any) => {
    const { accept, fileSize } = this.state
    const { size, name } = file
    let a = '文件上传出错'
    return new Promise((resolve, reject) => {
      // 对文件的信息进行 类型判断
      let index = name.lastIndexOf('.')
      let typeArry = accept.split(',')
      let suffer = (name as string).substring(index, name.length)
      if (typeArry.indexOf(suffer) < 0) {
        a = '请上传正确的文件'
        this.$message.error(a)
        reject(a)
      }
      if ((size / 1024 / 1024) > fileSize) { // 对文件进行 大小判断
        a = `上传文件的大小不能超过${fileSize}M`
        this.$message.warning(a)
        reject(a)
      }
      resolve(file)
    })
  }

  // /* 自定义的文件上传, 默认的不传，直接成功 */
  // customRequest = (request:any) => {
  //   const { action, file, filename, fileSize, data, onProgress, onSuccess, onError } = request
  //   let formData = new FormData()
  //   let params = this.props.params
  //   // 创建对象的信息
  //   formData.append(filename, file, file.name)
  //   if (params) {
  //     for (const key in params) {
  //       formData.append(key, params[key])
  //     }
  //   }
  //   this.setState({ visible: true, progressPercent: 0 })
  //   let time:any = setInterval(() => {
  //     let { progressPercent } = this.state
  //     if (progressPercent >= 80) {
  //       clearInterval(time)
  //     } else {
  //       progressPercent += 8
  //     }
  //     this.setState({ progressPercent })
  //   }, 1000)
  //   this.axios.upload({
  //     method: 'post',
  //     url: action,
  //     data: formData
  //     // onUploadProgress: (progressEvent:any) => {
  //     //   if (progressEvent.lengthComputable) {
  //     //     this.onUploadProgressLoading(progressEvent)
  //     //   }
  //     // }
  //   }).then((res:any) => {
  //     const { code, data, msg } = res.data
  //     if (code === 200) {
  //       onSuccess(res.data, file)
  //     } else {
  //       onError(res.data, true)
  //     }
  //   }).catch((err:any) => {
  //     onError(err, false)
  //   }).finally(() => {
  //     this.setState({ visible: false, progressPercent: 100 })
  //   })
  // }

  /* 自定义的文件上传, 默认的不传，直接成功 */
  customRequest = (request:any) => {
    const { action, file, filename, fileSize, data, onProgress, onSuccess, onError } = request
    const { mobxGlobal: { setTaskNum }, successChange } = this.props
    let formData = new FormData()
    let params = this.props.params
    // 创建对象的信息
    formData.append(filename, file, file.name)
    if (params) {
      for (const key in params) {
        formData.append(key, params[key])
      }
    }
    this.axios.upload({
      method: 'post',
      url: action,
      data: formData
    }).then((res:any) => {
      let { data, code, msg } = res.data
      if (code === 200) {
        this.warning('数据正在导入中，请至任务管理查看报表!')
        this.axios.request(this.api.count).then(({ code, data }) => {
          if (code === 200) {
            successChange && successChange({ data, code })
            let { sun } = data
            sun = sun > 99 ? '99+' : sun
            this.props.mobxGlobal.setTaskNum(sun)
          }
        })
      } else {
        this.warning(`${msg[0]}`)
      }
    }).finally(() => {
      this.setState({ visible: false, progressPercent: 100 })
    })
  }

  /* 打开弹窗: 错误的小消息存在 */
  handleModal = (num: number = 0) => {
    const { handleOk, handleCancel } = this.basicModel.current as BasicModal
    num === 0 ? handleCancel() : handleOk()
  }

  /** 下载数据 */
  dowloadFile = (url:string) => {
    let link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    document.body.appendChild(link)
    link.click()
    this.handleModal(0)
    this.$message.success('下载成功!')
  }

  /** 上传的进度 */
  // onUploadProgressLoading = ({ total, loaded }:any) => {
  //   let progressPercent:number = (total / loaded) * 100
  //   let visible:boolean = true
  //   this.setState({ visible, progressPercent })
  // }

  render () {
    const { multiple, action, name, style } = this.props
    const { filename, accept, errmsg, errurl, visible, progressPercent } = this.state
    const config = {
      action: action,
      name: filename,
      accept: accept, // 默认上传的是图片
      multiple: multiple, // 多选
      onStart: this.onStart, // 开始上传的
      onProgress: this.onProgress,
      onSuccess: this.onSuccess,
      onError: this.onError,
      beforeUpload: this.beforeUpload,
      customRequest: this.customRequest
    }
    return (
      <div className="upload-file-content" style={style}>
        <RcUpload {...config}>
          {this.props.children}
        </RcUpload>
        <Modal title="" closable={false} footer={null} visible={visible}>
          <div className="upload-progress">
            <p>正在导入，请稍等...</p>
            <Progress strokeColor={{
              to: '#24C8EA',
              from: '#2B8FF9'
            }}
            status="active" percent={progressPercent} />
          </div>
        </Modal>
        <BasicModal ref={this.basicModel} title="提示">
          <Row>
            <Col span={7} style={{ textAlign: 'center' }}><img src={js}></img></Col>
            <Col span={17} className="error-col">{errmsg}</Col>
          </Row>
          <Row>
            <div className="import-error">
              <p>出错原因可能为：</p>
              <p>1.数据不完整（必填项为空）；</p>
              <p>2.字段格式不正确（如导入数据中的“项目”为系统内没有的项目名称等）；</p>
              <p>3.与原数据冲突（如导入的员工相关记录在系统中已存在）。</p>
            </div>
          </Row>
          <Row>
            <Button type="primary" onClick={() => (this.dowloadFile(errurl))}>下载出错数据</Button>
          </Row>
        </BasicModal>
      </div>
    )
  }
}
