/**
 * @author maqian
 * @createTime 2019/04/11
 * @description 核算与关账下载模态框
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from '@components/index'
import { hot } from 'react-hot-loader'
import { Button, Icon, Modal, Progress } from 'antd'
import { successImgs } from '@components/icon/BasicIcon'
import moment from 'moment'
import InsureExcel from '@assets/images/svg/share/insured/insuredExcel.svg'
import '../InsuredAccountePage.styl'
import { JudgeUtil } from '@utils/index'
import { inject } from 'mobx-react'
interface LoadModalProps {
  LoadModalChange?: any // 将关闭弹框的值传给父组件
  loadModalVisible?: any // 关闭弹框
  LoadcontentTips?: any // 弹出框的提示
  insureData?:any // 父组件传递的当前行的数据
  mobxGlobal?: any
}

interface LoadModalState {
  // 下载的进度条
  visible: boolean
  // 下载进度
  progressPercent: number
  resultFont:string
}

@inject('mobxGlobal')
@hot(module) // 热更新（局部刷新界面）
export default class LoadModal extends RootComponent<LoadModalProps, LoadModalState> {
  constructor (props: any) {
    super(props)
    this.state = {
      visible: false,
      progressPercent: 0,
      resultFont: '' || '核算' // 文字提示
    }
  }
  componentDidMount () {
    const { LoadcontentTips } = this.props
    if (LoadcontentTips === '核算成功') {
      this.setState({
        resultFont: '核算'
      })
    } else {
      this.setState({
        resultFont: '关账'
      })
    }
  }
  handleOk = (e:any) => { // 点击下载
    const { LoadModalChange, LoadcontentTips, insureData, mobxGlobal: { setTaskNum } } = this.props
    LoadModalChange(false) // 关闭下载模态
    // 发送‘下载’请求
    let ax:any
    let filename:string
    // this.setState({ visible: true, progressPercent: 0 })
    // let time:any = setInterval(() => {
    //   let { progressPercent } = this.state
    //   if (progressPercent >= 80) {
    //     clearInterval(time)
    //   } else {
    //     progressPercent += 8
    //   }
    //   this.setState({ progressPercent })
    // }, 1000)
    if (LoadcontentTips === '核算成功') {
      // 核算
      filename = '参保核算数据导出'
      ax = this.axios.instanceTime({
        method: 'post',
        url: this.api.insureload.path,
        data: {
          iaId: insureData.iaId,
          handleType: 0 // 核算
        }
      })
    } else {
      // 关账
      filename = '关账数据导出'
      ax = this.axios.instance({
        method: 'post',
        url: this.api.insureload.path,
        data: {
          iaId: insureData.iaId,
          handleType: 1 // 关账
        }
      })
    }

    ax.then((res:any) => {
      let { data, code } = res.data
      if (code === 200) {
        this.warning('数据正在下载中，请至任务管理查看报表!')
        this.axios.request(this.api.count).then(({ code, data }) => {
          if (code === 200) {
            let { sun } = data
            sun = sun > 99 ? '99+' : sun
            setTaskNum(sun)
          }
        })
      }
      // if (!JudgeUtil.isEmpty(data)) {
      //   let link = document.createElement('a')
      //   link.style.display = 'none'
      //   link.href = data
      //   link.setAttribute('download', `${filename}_${moment().format('YYYY_MM_DD')}.xlsx`)
      //   document.body.appendChild(link)
      //   link.click()
      //   this.$message.success('导出成功!')
      // } else {
      //   this.$message.error('导出失败！')
      // }
    }).catch((err:any) => {
      const { msg } = err
      this.error(msg || err)
    })
    // .catch((err:any) => {
    //   const { msg } = err
    //   this.error(msg || err)
    // }).finally(() => {
    //   clearInterval(time)
    //   time = null
    //   this.setState({ visible: false, progressPercent: 100 })
    // })
  }

  handleCancel = (e:any) => { // 取消关闭下载模态框
    this.props.LoadModalChange(false)
  }

  warning = (content: string) => {
    Modal.warning({
      title: '温馨提示',
      content
    })
  }

  render () {
    const { resultFont, visible, progressPercent } = this.state
    return (
      <div className="modal-box">
        <Modal
          visible={this.props.loadModalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
          maskStyle={{ background: 'rgba(0,0,0,0.5)' }}
          style={{ textAlign: 'center', height: '2rem' }}
          bodyStyle={{ height: '1.98rem', padding: '0.13rem 0 0 0' }}
          className="title-style"
          width='2.5rem'
        >
          <Icon className="icon-style" component={successImgs}></Icon>
          <p className="title-success">{this.props.LoadcontentTips}</p>
          <p className="tips-success">请下载{resultFont}结果文件进行检查！</p>
          <div style={{ margin: '0.06rem 0px 0.15rem' }}>
            <img src={InsureExcel} alt=""/>
          </div>
          <Button onClick={this.handleOk} className='load-cancel-btn' type="primary">下载</Button>
        </Modal>
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
