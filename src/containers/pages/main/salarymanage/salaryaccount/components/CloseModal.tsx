/*
 * @description: 关账并归档弹框
 * @author: maqian
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: maqian
 * @Date: 2019-09-23 15:24:50
 * @LastEditTime: 2019-09-28 14:21:42
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent } from '@components/index'
import { hot } from 'react-hot-loader'
import { Button, Icon, Modal, Progress } from 'antd'
import { successImgs } from '@components/icon/BasicIcon'
import { JudgeUtil } from '@utils/index'

import InsuredModal from './InsuredModal' // 核算模态框

interface CloseModalProps {
  closeModalVisible:boolean
  onCloseModal:Function
  insureData:any
  loadExcelName:string
  apiPath:any
  apiData:any
  onSetChange?: (data:boolean) => void
}

interface CloseModalState {
  loadModalVisible:boolean
  IapiPath:any
  IapiData:any
}

@hot(module)
export default class CloseModal extends RootComponent<CloseModalProps, CloseModalState> {
  constructor (props:CloseModalProps) {
    super(props)
    this.state = {
      loadModalVisible: false,
      IapiPath: null,
      IapiData: null
    }
  }

  onHandleOk = () => {
    const { loadExcelName, insureData: { saId }, onCloseModal, onSetChange } = this.props
    onCloseModal(false)
    const { apiPath, apiData } = this.props
    this.axios.request(apiPath, apiData, true).then((res:any) => {
      if (loadExcelName === '税前关账成功') {
        this.setState({
          IapiPath: this.api.BeforeTaxInsuredLoad,
          IapiData: {
            saId
          }
        })
      } else if (loadExcelName === '个税关账成功') {
        this.setState({
          IapiPath: this.api.PersonalExport,
          IapiData: {
            saId,
            difference: 1
          }
        })
      }
      this.setState({
        loadModalVisible: true
      })
      if (onSetChange) onSetChange(true)
    }).catch((err:any) => {
      this.error(err.msg[0])
    })
  }

  onHandleCancel = () => {
    this.props.onCloseModal(false)
  }

  onLoadModal = (loadModalVisible:boolean) => {
    this.setState({
      loadModalVisible
    })
  }

  render () {
    const { loadModalVisible, IapiPath, IapiData } = this.state
    const { closeModalVisible, insureData, loadExcelName } = this.props
    return (
      <div>
        <Modal
          title="提示"
          visible={closeModalVisible}
          footer={null}
          closable={false}
          maskStyle={{ background: 'rgba(0,0,0,0.5)' }}
          style={{ textAlign: 'center', height: '1.2rem' }}
          bodyStyle={{ height: '0.86rem', padding: '0.13rem 0 0 0' }}
          className='close-modal'
          width='2.5rem'
        >
          <p style={{ paddingBottom: '0.15rem' }}>关账操作，每月只能执行一次！确认当月关账</p>
          <Button onClick={this.onHandleOk} className='comfirm-btn' type="primary">确定</Button>
          <Button onClick={this.onHandleCancel} className='cancel-btn'>取消</Button>
        </Modal>
        <InsuredModal apiData={IapiData} apiPath={IapiPath} {...{ insureData, loadModalVisible, loadExcelName }} onLoadModal={this.onLoadModal} />
      </div>
    )
  }
}
