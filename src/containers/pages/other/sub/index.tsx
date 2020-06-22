/**
 * @description 额外的
 * @author minjie
 * @createTime 2019/05/12
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from '@components/index'
import { Button, Form, Input, Row, Col, Divider } from 'antd'
import { FormComponentProps } from 'antd/lib/form'

const { TextArea } = Input

interface ExecuteSqlScriptProps extends FormComponentProps {
}

interface ExecuteSqlScriptState {
  msgData: any
  msgDataB: any
}

// 查看合同
class ExecuteSqlScript extends RootComponent<ExecuteSqlScriptProps, ExecuteSqlScriptState> {
  constructor (props:ExecuteSqlScriptProps) {
    super(props)
    this.state = {
      msgData: '',
      msgDataB: ''
    }
  }

  /** executeSqlScript */
  executeSqlScript = () => {
    let objB = { // 执行sql语句
      type: 'get',
      path: '/BasicData/executeSqlScript'
    }
    this.axios.request(objB).then((res:any) => {
      this.setState({ msgData: JSON.stringify(res) })
    }).catch((err) => {
      let { msg } = err
      this.setState({ msgData: msg || err })
    })
  }

  /** 存在参数 */
  executeSql = () => {
    let objA = { // 执行sql语句
      type: 'post',
      path: '/BasicData/executeSql'
    }
    this.props.form.validateFieldsAndScroll(['executeSqlList'], (err:any, values:any) => {
      if (!err) {
        values['executeSqlList'] = values.executeSqlList.split('/')
        this.axios.request(objA, values).then((res:any) => {
          let { msg } = res
          this.setState({ msgDataB: JSON.stringify(res) })
        }).catch((err) => {
          this.setState({ msgDataB: JSON.stringify(err) })
        })
      }
    })
  }

  render () {
    const { msgData, msgDataB } = this.state
    const { getFieldDecorator } = this.props.form
    return (
      <Form layout="inline">
        <Row>
          <Col span={24}>
            <Form.Item>
              <Button type="primary" onClick={this.executeSqlScript}>sql执行(executeSqlScript)</Button>
            </Form.Item>
          </Col>
        </Row>
        <Row justify='center'>
          <Col span={8} offset={8}>
            <TextArea placeholder='executeSqlScript执行结果' value={msgData} rows={4}/>
          </Col>
        </Row>
        <Divider>华丽的分割线</Divider>
        <Row>
          <Col span={24}>
            <Form.Item label='参数请用英文逗号分割' style={{ width: 600 }} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
              {getFieldDecorator('executeSqlList', {
                rules: [{ required: true, message: '请填写参数（字符串，/ 分割）' }]
              })(
                <TextArea rows={4} placeholder='请填写参数（字符串，/ 分割）'></TextArea>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item>
              <Button type="primary" onClick={this.executeSql}>sql执行(executeSql)</Button>
            </Form.Item>
          </Col>
        </Row>
        <Row justify='center'>
          <Col span={8} offset={8}>
            <TextArea placeholder='executeSql执行结果' value={msgDataB} rows={4}/>
          </Col>
        </Row>
      </Form>
    )
  }
}
export const ExecuteSqlScriptItem = Form.create<ExecuteSqlScriptProps>()(ExecuteSqlScript)
