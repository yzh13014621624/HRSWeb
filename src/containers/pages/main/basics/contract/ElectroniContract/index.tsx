/*
 * @description: 电子合同
 * @author: maqian
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: maqian
 * @Date: 2019-09-19 17:06:38
 * @LastEditTime: 2019-10-14 16:13:13
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { hot } from 'react-hot-loader'
import { RootComponent } from '@components/index'
import { Button, Row, Col, Modal, Icon } from 'antd'

import './index.styl'

@hot(module)
export default class ElectroniContract extends RootComponent<any, any> {
  constructor (props:any) {
    super(props)
    const { match } = props
    let id = match.params.id || 0
    let status = match.params.status || 0
    let key = match.params.key || 0
    this.state = {
      id: id || null,
      key,
      status: status || null,
      path: null
    }
  }

  componentDidMount () {
    const { match: { params: { id } } } = this.props
    this.axios.request(this.api.getContractDetail, { id }).then((res:any) => {
      // 获取带数据放到数据中
      this.setState({
        path: res.data
      })
    }).catch((err:any) => {
      this.error(err.msg[0])
    })
  }

  cancelBtn = (e:any) => { // 点击返回按钮
    e.preventDefault()
    const { key } = this.state
    this.props.history.push(`/home/ContractPage?key=${key}`)
  }

  onHandlePass = (e:any) => { // 点击通过审批
    e.preventDefault()
    const { key, id } = this.state
    this.axios.request(this.api.platSign, { id }).then((res:any) => {
      this.$message.success('审批通过')
      this.props.history.push(`/home/ContractPage?key=${key}`)
    }).catch((err:any) => {
      this.error(err.msg[0])
    })
  }

  onHandleReturn = (e:any) => { // 点击驳回并重签
    e.preventDefault()
    const { key, id } = this.state
    this.axios.request(this.api.rejectAndReSign, { id }, true).then((res:any) => {
      this.$message.success('驳回成功')
      this.props.history.push(`/home/ContractPage?key=${key}`)
    }).catch((err:any) => {
      this.error(err.msg[0])
    })
  }

  // pdfLoad = () => { // pdf下载
  //   const { key, id, path } = this.state
  //   let link = document.createElement('a')
  //   link.style.display = 'none'
  //   link.href = path
  //   document.body.appendChild(link)
  //   link.click()
  // }

  render () {
    const { status, path } = this.state
    const { AuthorityList, isAuthenticated } = this
    const contract = AuthorityList.contract
    return (
      <div id='initial-signature-contract'>
        <Row className='initial-signature-head'>
          {/* {
            status === '4' &&
            <Button type='primary' onClick={this.pdfLoad}>
              <Icon component={IconDc}/>导出PDF文件
            </Button>
          } */}
          <Button onClick={(e) => this.cancelBtn(e)} className="cancel-btn">返 回</Button>
        </Row>
        <iframe width='95%' height={600} src={path} frameBorder="0"></iframe>
        {
          status === '2' &&
        <Row className='btn-margin'>
          <Col span={12} >
            {
              isAuthenticated(contract[18]) &&
              <Button onClick={(e) => this.onHandlePass(e)} className="sumbit-btns" type="primary">审核通过</Button>
            }
            {
              isAuthenticated(contract[19]) &&
              <Button onClick={(e) => this.onHandleReturn(e)} className="cancel-btns">驳回并发起重签</Button>
            }
          </Col>
        </Row>
        }
      </div>
    )
  }
}
