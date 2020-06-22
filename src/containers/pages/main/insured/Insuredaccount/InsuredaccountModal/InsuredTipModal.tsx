/**
 * @author maqian
 * @createTime 2019/04/11
 * @description 关账提示模态框
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent } from '@components/index'
import { hot } from 'react-hot-loader'
import { Button, Modal } from 'antd'
import '../InsuredAccountePage.styl'
import LoadModal from './InsuredLoadModal'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })

interface TipModalProps {
  tipModalVisible?: any
  content?: string
  TipModalChange?: any
  insureData?:any
}
@hot(module) // 热更新（局部刷新界面）
export default class TipModal extends RootComponent<TipModalProps, any> {
  constructor (props:any) {
    super(props)
    this.state = {
      tipModalVisible: false, // 模态是否显示
      loadModalVisible: false, // 下载模态是否显示
      LoadcontentTips: '关帐成功'
    }
  }

  handleOk = (e:any) => {
    const { insureData: { iaId, entityId, projectId } } = this.props
    NProgress.set(0.0)
    NProgress.set(0.3)
    NProgress.set(0.6)
    NProgress.set(0.9)
    // 关账请求
    this.axios.request(this.api.insureclose, {
      iaId,
      entityId,
      projectId,
      closeAccount: 1,
      handleType: 1
    }).then((res:any) => {
      // 消息提示 路径跳转
      if (res.code === 200) {
        NProgress.set(1.0)
        this.props.TipModalChange(false) // 关闭关账提示框
        this.setState({
          loadModalVisible: true
        })
      }
    }).catch((err:any) => {
      this.props.TipModalChange(false) // 关闭关账提示框
      this.error(err.msg[0])
    })
  }

  handleCancel = (e:any) => {
    this.props.TipModalChange(false) // 关闭关账提示框
    this.setState({
      tipModalVisible: false // 控制显示隐藏关账模态框
    })
  }

  CloseDialog = (data:any) => { // 接收子组件传递的数据
    this.setState({
      loadModalVisible: data // 控制显示隐藏核算/关账下载模态框
    })
  }
  render () {
    const { insureData, tipModalVisible } = this.props
    const { LoadcontentTips, loadModalVisible } = this.state
    return (
      <div>
        <Modal
          title="提示"
          visible={tipModalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
          closable={false}
          maskStyle={{ background: 'rgba(0,0,0,0.5)' }}
          style={{ textAlign: 'center', height: '1.2rem' }}
          bodyStyle={{ height: '0.86rem', padding: '0.13rem 0 0 0' }}
          className="title-style"
          width='2.5rem'
        >
          <p style={{ paddingBottom: '0.15rem' }}>关账操作，每月只能执行一次！确认当月关账</p>
          <Button onClick={this.handleOk} className='comfirm-btn' type="primary">确定</Button>
          <Button onClick={this.handleCancel} className='cancel-btn'>取消</Button>
        </Modal>
        <LoadModal insureData={insureData} loadModalVisible={loadModalVisible} LoadModalChange={this.CloseDialog} LoadcontentTips={LoadcontentTips}/>
      </div>
    )
  }
}
