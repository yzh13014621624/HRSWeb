/**
 * @author minjie
 * @createTime 2019/04/08
 * @description 导出数据
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent } from '@components/index'
import { Button, Modal, Progress } from 'antd'
import { inject } from 'mobx-react'
import moment from 'moment'
import './style/Upload.styl'

interface UrlInteface {
  path:string
  type?:string
  fileName?:string
  suffix?:string
  parmsData?: object
}

interface BasicDowloadProps {
  className?:string
  btntype?:any // 下载按钮的样式
  type?: string // （暂时没用）
  action?: any // 下载的地址对象
  multiDownload?: UrlInteface[] // 批量下载
  fileName?: string
  parmsData?: object // 导出的时候的条件
  icon?:string,
  suffix?: string // 文件后缀 xlsx  xls
  loadDate?:any // 下载时间
  size?:string
  isLoadeTime?:boolean // 下载是否带当前时间(为true不带时间)
  // 请求的返回的是直接的URl
  dowloadURL?: 'URL' | 'Blob'
  /** 下载成功|失败 */
  onClose?: () => void
  style?:any
  mobxGlobal?: any
  disabled?:boolean // 按钮是否禁用
}

interface BasicDowloadState {
  btnType: any
  fileName:string
  suffix: string
  loadDate: any
  // 下载的进度条
  visible: boolean
  // 下载进度
  progressPercent: number
  disabled?:boolean // 按钮是否禁用
}

@inject('mobxGlobal')
export default class BasicDowload extends RootComponent<BasicDowloadProps, BasicDowloadState> {
  constructor (props:any) {
    super(props)
    const { btntype, fileName, suffix, loadDate, isLoadeTime, disabled } = this.props
    this.state = {
      btnType: btntype || 'primary',
      fileName: fileName || 'HR导出文件',
      suffix: suffix || 'xlsx',
      loadDate: loadDate || moment().format('YYYYMMDD'),
      visible: false,
      progressPercent: 0,
      disabled: disabled || false
    }
  }

  UNSAFE_componentWillReceiveProps ({ fileName }: BasicDowloadProps) {
    this.setState({ fileName: fileName! })
  }

  /* 点击开始下载 */
  download = () => {
    const { parmsData, action, isLoadeTime, onClose } = this.props
    const { fileName, suffix, loadDate } = this.state
    const { type = 'post', path } = action
    let ax: any
    this.setState({ visible: true, progressPercent: 0 })
    let time:any = setInterval(() => {
      let { progressPercent } = this.state
      if (progressPercent >= 80) {
        clearInterval(time)
      } else {
        progressPercent += 8
      }
      this.setState({ progressPercent })
    }, 1000)
    if (action) {
      const params = {
        method: type,
        url: path,
        data: parmsData,
        params: parmsData,
        responseType: 'blob'
      }
      if (type === 'post') delete params.params
      else delete params.data
      ax = this.axios.instance(params)
    }
    ax.then((res:any) => {
      if (!res || res.data.type === 'application/json') {
        onClose && onClose()
        this.$message.error('导出失败！')
      } else {
        let url = window.URL.createObjectURL(res.data)
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        isLoadeTime
          ? link.setAttribute('download', `${fileName}.${suffix}`)
          : link.setAttribute('download', `${fileName}_${loadDate}.${suffix}`)
        document.body.appendChild(link)
        link.click()
        URL.revokeObjectURL(res.data)
        onClose && onClose()
      }
    }).catch((err:any) => {
      onClose && onClose()
      this.$message.error(err.message)
    }).finally(() => {
      clearInterval(time)
      time = null
      this.setState({ visible: false, progressPercent: 100 })
    })
  }

  // 点击之后全部在任务管理中展示然后进行操作
  dowloadURL = () => {
    const { parmsData, action, isLoadeTime, onClose, multiDownload, mobxGlobal: { setTaskNum } } = this.props
    const { loadDate } = this.state
    let num = 0
    if (action) {
      const { type = 'post', path } = action
      let ax:any
      const params = {
        method: type,
        url: path,
        data: parmsData,
        params: parmsData
      }
      if (type === 'post') delete params.params
      else delete params.data
      ax = this.axios.instance(params)
      ax.then((res:any) => {
        let { code, msg } = res.data
        if (code === 200) {
          onClose && onClose()
          this.warning('数据正在导出中，请至任务管理查看报表!')
          // 获取任务数量
          this.axios.request(this.api.count).then(({ code, data }) => {
            if (code === 200) {
              let { sun } = data
              sun = sun > 99 ? '99+' : sun
              setTaskNum(sun)
            }
          })
        } else {
          this.warning(`${msg[0]}`)
        }
      })
    }
    /* 批量导出文件 */
    if (multiDownload && multiDownload.length) {
      let axList: any[] = []
      const ratio = parseInt((100 / multiDownload.length) + '')
      for (const api of multiDownload) {
        const { type = 'post', path, parmsData } = api
        let ax: any
        const params = {
          method: type,
          url: path,
          data: parmsData,
          params: parmsData
        }
        if (type === 'post') delete params.params
        else delete params.data
        ax = this.axios.instance(params)
        axList.push(ax)
      }
      Promise.all(axList)
        .then(res => {
          res.forEach((datas, i) => {
            const { code, data, msg } = datas.data
            const { fileName = 'HR导出文件', suffix = 'xlsx' } = multiDownload[i]
            if (code === 200) {
              // setTimeout(() => {
              //   let { progressPercent } = this.state
              //   progressPercent += ratio
              //   let link = document.createElement('a')
              //   link.style.display = 'none'
              //   link.href = data
              //   isLoadeTime
              //     ? link.setAttribute('download', `${fileName}.${suffix}`)
              //     : link.setAttribute('download', `${fileName}_${loadDate}.${suffix}`)
              //   document.body.appendChild(link)
              //   link.click()
              //   if (progressPercent >= 100 - ratio) this.setState({ visible: false, progressPercent: 100 })
              //   else this.setState({ progressPercent })
              //   onClose && onClose()
              // }, ratio + i * 200)
              onClose && onClose()
              num++
              num === 1 && this.warning('数据正在导出中，请至任务管理查看报表!')
              // 获取任务数量
              this.axios.request(this.api.count).then(({ code, data }) => {
                if (code === 200) {
                  let { sun } = data
                  sun = sun > 99 ? '99+' : sun
                  setTaskNum(sun)
                }
              })
            } else {
              // this.$message.error('导出失败！')
              onClose && onClose()
              this.warning(`${msg[0]}`)
            }
          })
        })
        // .catch(() => onClose && onClose())
        // .finally(() => this.setState({ visible: false, progressPercent: 100 }))
    }
  }

  // 因为导出不统一导致既要有在当前页面进行操作的也需要有在任务管理中操作的
  // dowloadURL = () => {
  //   console.log('dowloadURL')
  //   const { parmsData, action, isLoadeTime, onClose, multiDownload } = this.props
  //   const { fileName, suffix, loadDate } = this.state
  //   if (action) {
  //     const { type = 'post', path } = action
  //     let ax: any
  //     const params = {
  //       method: type,
  //       url: path,
  //       data: parmsData,
  //       params: parmsData
  //     }
  //     if (type === 'post') delete params.params
  //     else delete params.data
  //     ax = this.axios.instance(params)
  //     ax.then((res:any) => {
  //       let { data, code, msg } = res.data
  //       console.log(data)
  //       if (code === 200) {
  //         if (data !== 1 || data !== null) {
  //           this.setState({ visible: true, progressPercent: 0 })
  //           let time: any = setInterval(() => {
  //             let { progressPercent } = this.state
  //             if (progressPercent >= 80) {
  //               clearInterval(time)
  //               this.setState({ visible: false, progressPercent: 100 })
  //               let link = document.createElement('a')
  //               link.style.display = 'none'
  //               link.href = data
  //               isLoadeTime
  //                 ? link.setAttribute('download', `${fileName}.${suffix}`)
  //                 : link.setAttribute('download', `${fileName}_${loadDate}.${suffix}`)
  //               document.body.appendChild(link)
  //               link.click()
  //               onClose && onClose()
  //             } else {
  //               progressPercent += 8
  //             }
  //             this.setState({ progressPercent })
  //           }, 1000)
  //           return
  //         }
  //         this.warning('数据正在导出中，请至任务管理查看报表!')
  //       } else {
  //         this.warning(`${msg[0]}`)
  //       }
  //     })
  //   }
  //   /* 批量导出文件 */
  //   if (multiDownload && multiDownload.length) {
  //     let axList: any[] = []
  //     const ratio = parseInt((100 / multiDownload.length) + '')
  //     for (const api of multiDownload) {
  //       const { type = 'post', path, parmsData } = api
  //       let ax: any
  //       const params = {
  //         method: type,
  //         url: path,
  //         data: parmsData,
  //         params: parmsData
  //       }
  //       if (type === 'post') delete params.params
  //       else delete params.data
  //       ax = this.axios.instance(params)
  //       axList.push(ax)
  //     }
  //     Promise.all(axList)
  //       .then(res => {
  //         res.forEach((datas, i) => {
  //           const { code, data } = datas.data
  //           const { fileName = 'HR导出文件', suffix = 'xlsx' } = multiDownload[i]
  //           if (code === 200) {
  //             setTimeout(() => {
  //               let { progressPercent } = this.state
  //               progressPercent += ratio
  //               let link = document.createElement('a')
  //               link.style.display = 'none'
  //               link.href = data
  //               isLoadeTime
  //                 ? link.setAttribute('download', `${fileName}.${suffix}`)
  //                 : link.setAttribute('download', `${fileName}_${loadDate}.${suffix}`)
  //               link.click()
  //               if (progressPercent >= 100 - ratio) this.setState({ visible: false, progressPercent: 100 })
  //               else this.setState({ progressPercent })
  //               onClose && onClose()
  //             }, ratio + i * 100)
  //           } else {
  //             this.$message.error('导出失败！')
  //             onClose && onClose()
  //           }
  //         })
  //       })
  //       .catch(() => onClose && onClose())
  //       .finally(() => this.setState({ visible: false, progressPercent: 100 }))
  //   }
  // }

  warning = (content: string) => {
    Modal.warning({
      title: '温馨提示',
      content
    })
  }

  render () {
    const { className, icon, btntype, dowloadURL, style, disabled } = this.props
    const { visible, progressPercent } = this.state
    return (
      <div className="cus-dowload" style={style}>
        <Button onClick={dowloadURL === 'URL' ? this.dowloadURL : this.download}
          className={className}
          type={btntype} disabled={disabled} icon={icon}>{this.props.children}</Button>
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
