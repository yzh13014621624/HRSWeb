/**
 * @author minjie
 * @createTime 2019/04/08
 * @description 导出数据
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent } from '@components/index'
import { Button, Modal, Progress } from 'antd'
import moment from 'moment'
interface BasicDowloadProps {
  className?:string
  btntype?:any // 下载按钮的样式
  type?: string // （暂时没用）
  action?: any // 下载的地址对象
  fileName?: string
  parmsData?: object // 导出的时候的条件
  icon?:string,
  suffix?: string // 文件后缀 xlsx  xls
  loadDate?:string // 下载时间
  size?:string
  isLoadeTime?:boolean // 下载是否带当前时间(为true不带时间)
  // 请求的返回的是直接的URl
  dowloadURL?: 'URL' | 'Blob'
}

interface BasicDowloadState {
  btnType: any
  fileName:string
  suffix: string
  loadDate: string
  // 下载的进度条
  visible: boolean
  // 下载进度
  progressPercent: number
}

export default class BasicDowload extends RootComponent<BasicDowloadProps, BasicDowloadState> {
  constructor (props:any) {
    super(props)
    const { btntype, fileName, suffix, loadDate } = this.props
    this.state = {
      btnType: btntype || 'primary',
      fileName: fileName || 'HR导出文件',
      suffix: suffix || 'xlsx',
      loadDate: loadDate || moment().format('YYYY_MM_DD'),
      visible: false,
      progressPercent: 0
    }
  }

  UNSAFE_componentWillReceiveProps ({ fileName }: BasicDowloadProps) {
    this.setState({ fileName: fileName! })
  }

  /* 点击开始下载 */
  // download = (e:any) => {
  //   e.preventDefault()
  //   const { parmsData, action, isLoadeTime } = this.props
  //   const { fileName, suffix, loadDate } = this.state
  //   const { type = 'post', path } = action
  //   let ax:any
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
  //   if (action) {
  //     if (type === 'post') {
  //       ax = this.axios.instance({
  //         method: type,
  //         url: path,
  //         data: parmsData,
  //         responseType: 'blob'
  //       })
  //     } else {
  //       ax = this.axios.instance({
  //         method: type,
  //         url: path,
  //         params: parmsData,
  //         responseType: 'blob'
  //       })
  //     }
  //   }
  //   ax.then((res:any) => {
  //     if (!res || res.data.type === 'application/json') {
  //       this.$message.error('导出失败！')
  //     } else {
  //       let url = window.URL.createObjectURL(res.data)
  //       let link = document.createElement('a')
  //       link.style.display = 'none'
  //       link.href = url
  //       isLoadeTime
  //         ? link.setAttribute('download', `${fileName}.${suffix}`)
  //         : link.setAttribute('download', `${fileName}_${loadDate}.${suffix}`)
  //       document.body.appendChild(link)
  //       link.click()
  //       URL.revokeObjectURL(res.data)
  //       // this.$message.success('导出成功!')
  //     }
  //   }).catch((err:any) => {
  //     this.$message.error(err.message)
  //   }).finally(() => {
  //     clearInterval(time)
  //     time = null
  //     this.setState({ visible: false, progressPercent: 100 })
  //   })
  // }

  /* 点击开始下载 */
  download = (e:any) => {
    e.preventDefault()
    const { parmsData, action, isLoadeTime } = this.props
    const { fileName, suffix, loadDate } = this.state
    const { type = 'post', path } = action
    let ax:any
    if (action) {
      if (type === 'post') {
        ax = this.axios.instance({
          method: type,
          url: path,
          data: parmsData,
          responseType: 'blob'
        })
      } else {
        ax = this.axios.instance({
          method: type,
          url: path,
          params: parmsData,
          responseType: 'blob'
        })
      }
    }
    ax.then((res:any) => {
      let { data, status, msg } = res
      if (status === 200) {
        this.warning('数据正在导出中，请至任务管理查看报表!')
      } else {
        this.warning(`${msg[0]}`)
      }
    })
  }

  // 采用在点击之后立马在当前页面执行---原始版本
  // dowloadURL = (e:any) => {
  //   e.preventDefault()
  //   const { parmsData, action, isLoadeTime } = this.props
  //   const { fileName, suffix, loadDate } = this.state
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
  //   this.axios.instanceTime({
  //     method: 'post',
  //     url: action.path,
  //     data: parmsData
  //   }).then((res:any) => {
  //     let { data, code, msg } = res.data
  //     if (code === 200) {
  //       // let url = window.URL.createObjectURL(data)
  //       let link = document.createElement('a')
  //       link.style.display = 'none'
  //       link.href = data
  //       isLoadeTime
  //         ? link.setAttribute('download', `${fileName}.${suffix}`)
  //         : link.setAttribute('download', `${fileName}_${loadDate}.${suffix}`)
  //       document.body.appendChild(link)
  //       link.click()
  //     } else {
  //       this.$message.error('导出失败！')
  //     }
  //   }).catch((err:any) => {
  //     console.log(err)
  //   }).finally(() => {
  //     clearInterval(time)
  //     time = null
  //     this.setState({ visible: false, progressPercent: 100 })
  //   })
  // }

  // 点击之后全部在任务管理中展示然后进行操作
  dowloadURL = (e:any) => {
    e.preventDefault()
    const { parmsData, action, isLoadeTime } = this.props
    const { fileName, suffix, loadDate } = this.state
    this.axios.instanceTime({
      method: 'post',
      url: action.path,
      data: parmsData
    }).then((res:any) => {
      let { data, code, msg } = res.data
      if (code === 200) {
        this.warning('数据正在导出中，请至任务管理查看报表!')
      } else {
        this.warning(`${msg[0]}`)
      }
    })
  }

  // 因为导出不统一导致既要有在当前页面进行操作的也需要有在任务管理中操作的
  // dowloadURL = (e:any) => {
  //   e.preventDefault()
  //   const { parmsData, action, isLoadeTime } = this.props
  //   const { fileName, suffix, loadDate } = this.state
  //   let time: any
  //   this.axios.instanceTime({
  //     method: 'post',
  //     url: action.path,
  //     data: parmsData
  //   }).then((res:any) => {
  //     let { data, code, msg } = res.data
  //     if (code === 200) {
  //       if (data === 1 || !data) {
  //         this.setState({ visible: true, progressPercent: 0 })
  //         time = setInterval(() => {
  //           let { progressPercent } = this.state
  //           if (progressPercent >= 80) {
  //             clearInterval(time)
  //             this.setState({ visible: false, progressPercent: 100 })
  //             let link = document.createElement('a')
  //             link.style.display = 'none'
  //             link.href = data
  //             isLoadeTime
  //               ? link.setAttribute('download', `${fileName}.${suffix}`)
  //               : link.setAttribute('download', `${fileName}_${loadDate}.${suffix}`)
  //             document.body.appendChild(link)
  //             link.click()
  //           } else {
  //             progressPercent += 8
  //           }
  //           this.setState({ progressPercent })
  //         }, 1000)
  //         return
  //       }
  //       this.warning('数据正在导出中，请至任务管理查看报表!')
  //     } else {
  //       this.warning(`${msg[0]}`)
  //     }
  //   })
  // }

  warning = (content: string) => {
    Modal.warning({
      title: '温馨提示',
      content
    })
  }

  render () {
    const { className, icon, btntype, size, dowloadURL } = this.props
    const { visible, progressPercent } = this.state
    return (
      <div style={{ display: 'inline-block' }}>
        <a onClick={(e) => dowloadURL === 'URL' ? this.dowloadURL(e) : this.download(e)}
          title="下载Excel" className="mgl10">{this.props.children}</a>
        <Modal title="" closable={false} footer={null} visible={visible}>
          <div className="upload-progress">
            <p>下载中，请稍等...</p>
            <Progress strokeColor={{
              to: '#24C8EA',
              from: '#2B8FF9'
            }}
            status="active" percent={progressPercent} />
          </div>
        </Modal>
      </div>
    )
  }
}
