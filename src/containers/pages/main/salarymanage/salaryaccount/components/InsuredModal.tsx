/*
 * @description: 薪酬核算-核算下载模态框
 * @author: maqian
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: maqian
 * @Date: 2019-09-23 11:47:59
 * @LastEditTime: 2019-12-03 17:49:50
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent, BasicDowload } from '@components/index'
import { hot } from 'react-hot-loader'
import { Button, Icon, Modal, Progress } from 'antd'
import { successImgs } from '@components/icon/BasicIcon'

import './index.styl'
import TemplateModal from './TemplateModal'
import InsureExcel from '@assets/images/svg/share/insured/insuredExcel.svg'

interface InsuredModalProps {
  loadModalVisible:boolean // 弹出框显示隐藏 默认隐藏
  onLoadModal:Function // 将关闭弹框的值传给父组件
  loadExcelName:string // 模态标题(表命)
  insureData:any // 数据参数
  apiPath?:any // 请求接口
  apiData?:any // 请求参数
}
interface InsuredModalState {
  templateModalVisible:boolean
  templateTree:any
}
@hot(module)
export default class InsuredModal extends RootComponent<InsuredModalProps, InsuredModalState> {
  constructor (props:InsuredModalProps) {
    super(props)
    this.state = {
      templateModalVisible: false, // 控制模板模态显示/隐藏
      templateTree: null
    }
  }

  onHandleCancel = () => { // 取消模态框事件
    this.props.onLoadModal(false)
  }

  onHandleOk = () => { // 点击下载按钮
    const { props: { onLoadModal } } = this
    /*
      表名： 税前核算成功 个税核算成功 税后核算成功
      1、点击下载按钮， 如果是税前、个税  直接进行下载
      2、如果是税后，弹出自定义模版框 选择 然后进行下载
    */
    const { loadExcelName } = this.props
    if (loadExcelName === '税后核算成功' || loadExcelName === '税后关账成功') {
      this.axios.request(this.api.getSalaryTemplate).then(({ data }) => {
        this.setState({
          templateTree: data,
          templateModalVisible: true
        })
        onLoadModal(false)
      }).catch((err:any) => {
        this.error(err.msg[0])
      })
    }
    this.onHandleCancel()
  }

  onTemplateChange = (templateModalVisible:boolean) => {
    this.setState({
      templateModalVisible
    })
  }

  render () {
    const { templateModalVisible, templateTree } = this.state
    const { loadModalVisible, loadExcelName, insureData, apiPath, apiData } = this.props
    let insured = loadExcelName === '税前核算成功'
    let resultBol = loadExcelName === '个税核算成功' || loadExcelName === '个税关账成功'
    let parmas:any
    resultBol
      ? parmas = [{ ...apiPath, parmsData: apiData, fileName: '测试名称', suffix: 'xlsx' }]
      : parmas = [{ ...apiPath, parmsData: { ...apiData, type: insured ? 1 : 3 }, fileName: '测试名称', suffix: 'xlsx' }, { ...apiPath, parmsData: { ...apiData, type: insured ? 2 : 4 }, fileName: '测试名称', suffix: 'xlsx' }]
    return (
      <div>
        <Modal
          visible={loadModalVisible}
          onCancel={this.onHandleCancel}
          footer={null}
          maskStyle={{ background: 'rgba(0,0,0,0.5)' }}
          style={{ textAlign: 'center', height: '2rem' }}
          bodyStyle={{ height: '1.98rem', padding: '0.13rem 0 0 0' }}
          className="insured-modal"
          width='2.5rem'
        >
          <Icon className="icon-style" component={successImgs}></Icon>
          <p className="title-success">{loadExcelName}</p>
          <p className="tips-success">请下载{loadExcelName}结果文件进行检查！</p>
          <div style={{ margin: '0.09rem 0px 0.12rem' }}>
            <img src={InsureExcel} alt=""/>
          </div>
          {
            (loadExcelName === '税后核算成功' || loadExcelName === '税后关账成功')
              ? <Button onClick={this.onHandleOk} className='load-cancel-btn' type="primary">下载</Button>
              : <BasicDowload
                multiDownload={parmas}
                type='default'
                dowloadURL="URL"
                className='comfirm-btn'
                onClose={this.onHandleCancel}
              >
                <span>下载</span>
              </BasicDowload>
          }
        </Modal>
        <TemplateModal data={insureData} api={this.api.AfterTaxLoadList} list={true} onTemplateChange={this.onTemplateChange} {... { templateTree, templateModalVisible }} />
      </div>
    )
  }
}
