/**
 * @description 电子合同 详情
 * @author minjie
 * @createTime 2019/05/14
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from '@components/index'
import { Form, Button, Row, Col, Divider } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { BaseProps } from 'typings/global'
import { ContractModel } from './components/index'

interface ContractDetailProps extends FormComponentProps, BaseProps {
  history: any
}

interface ContractDetailState {
  userId: any
  ContractInfo: ContractModel
}

class ContractDetail extends RootComponent<ContractDetailProps, ContractDetailState> {
  constructor (props:ContractDetailProps) {
    super(props)
    const { match } = this.props
    let userId = match.params.id || 0
    this.state = {
      userId: userId,
      ContractInfo: new ContractModel()
    }
  }

  /** 初始加载数据 */
  componentDidMount () {
    const { userId } = this.state
    if (userId !== 0) { // 查询详情
      this.getDetail(userId)
    }
  }

  /** 获取用户的信息 */
  getDetail = (userId:any) => {
    this.axios.request(this.api.paramMaintenanceDetail, {
      ecId: userId
    }).then(({ data }:any) => {
      this.setState({ ContractInfo: data })
    }).catch((err:any) => {
      console.log(err)
    })
  }

  /** 返回上一个界面 */
  goBack = () => {
    this.props.history.replace('/home/paramMaintenance')
  }

  render () {
    const formItemLayout = {
      labelCol: { xs: { span: 24 }, sm: { span: 6 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 18 } }
    }
    const { ContractInfo: { downloadUrl, ecName, ecType, status, createTime, corporateName } } = this.state
    return (
      <Form {...formItemLayout} style={{ margin: 19, padding: 20 }}>
        <Row>
          <Col span={6}><Form.Item labelCol={{ span: 4 }} label="员工类型">{ecName}</Form.Item></Col>
          <Col span={6}><Form.Item label="合同类型">{ecType}</Form.Item></Col>
          <Col span={6}><Form.Item label="创建时间">{createTime}</Form.Item></Col>
          <Col span={4}><Form.Item label="使用状态">{status}</Form.Item></Col>
          <Col span={2}><Button className="ant_button_goback" style={{ float: 'right' }} onClick={this.goBack}>返回</Button></Col>
        </Row>
        <Divider style={{ marginTop: 30, marginBottom: 30 }}/>
        <Row>
          <Col><iframe src={downloadUrl} frameBorder="0" style={{ width: '100%', height: 702 }}/></Col>
        </Row>
      </Form>
    )
  }
}

export default Form.create<ContractDetailProps>()(ContractDetail)
