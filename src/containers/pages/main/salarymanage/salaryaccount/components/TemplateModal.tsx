/*
 * @description: 下载自定义模态框
 * @author: maqian
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: maqian
 * @Date: 2019-09-23 17:15:32
 * @LastEditTime: 2019-10-09 11:01:54
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent, BasicDowload } from '@components/index'
import { hot } from 'react-hot-loader'
import { FormComponentProps } from 'antd/lib/form'
import { Button, Modal, Tabs, Row, Form, Checkbox, Col } from 'antd'
import { BaseProps } from 'typings/global'

import './index.styl'

const { TabPane } = Tabs
const CheckboxGroup = Checkbox.Group

interface TemplateModalProps extends BaseProps, FormComponentProps {
  templateModalVisible:boolean
  onTemplateChange:Function
  templateTree:any
  data:any
  list:boolean // 判断是列表还是详情  true为列表 false为详情
  api:any // 接口地址
  type:any // 判断是关账还是核算
}
interface TemplateModalState {
  indeterminate:boolean
  checkAll:boolean
  oneValueList:any
  twoValueList:any
  threeValueList:any
  loadValue1:Array<string>
  loadVlaue2:Array<string>
  loadValue3:Array<string>
}

@hot(module)
class TemplateModal extends RootComponent<TemplateModalProps, TemplateModalState> {
  constructor (props:TemplateModalProps) {
    super(props)
    this.state = {
      indeterminate: true, // 全选按钮样式控制
      checkAll: false, // 是否全选
      oneValueList: [], // 模板1选中存放
      twoValueList: [], // 模板2选中存放
      threeValueList: [], // 模板3选中值存放
      loadValue1: [], // 获取模板1的值
      loadVlaue2: [], // 获取模板2的值
      loadValue3: [] // 获取模板3的值
    }
  }

  onHandleCancel = () => { // 取消模态
    this.props.onTemplateChange(false)
  }

  onChange = (threeValueList:any) => { // 自定义模板单选按钮
    const { templateTree: { template3 } } = this.props
    this.setState({
      threeValueList,
      indeterminate: !!threeValueList.length && threeValueList.length < template3.length,
      checkAll: threeValueList.length === template3.length
    })
  }

  onCheckAllChange = (e:any) => { // 自定义模板全选按钮
    const { templateTree: { template3 } } = this.props
    let a:any
    if (e.target.checked) {
      a = template3.map((el:any) => {
        return el.value
      })
    }
    this.setState({
      threeValueList: e.target.checked ? a : [],
      indeterminate: false,
      checkAll: e.target.checked
    })
  }

  render () {
    const { props, state } = this
    const {
      templateModalVisible,
      form: { getFieldDecorator },
      templateTree,
      data,
      list,
      api,
      type
    } = props
    const { threeValueList, indeterminate, checkAll } = state
    return (
      <div>
        <Modal
          visible={templateModalVisible}
          footer={null}
          title='薪酬核算导出'
          maskStyle={{ background: 'rgba(0,0,0,0.5)' }}
          style={{ textAlign: 'center', height: '3.5rem' }}
          bodyStyle={{ height: '3.1rem', padding: '0.04rem 0 0 0' }}
          className="template-modal"
          width='5.2rem'
          onCancel={this.onHandleCancel}
        >
          <Tabs defaultActiveKey="1">
            <TabPane tab="薪资核算模板1" key="1">
              <Form className='template-form' style={{ height: '2.3rem', overflowY: 'scroll', background: '#FBFBFB', margin: '0 0.1rem', paddingTop: 20 }}>
                <Form.Item>
                  {getFieldDecorator('checkboxGroup2', {
                    initialValue: templateTree && templateTree.value1
                  })(
                    <CheckboxGroup
                      options={templateTree && templateTree.template1}
                      className='set-check-group'
                      disabled
                    />
                  )}
                </Form.Item>
              </Form>
              <Row>
                <BasicDowload action={api}
                  parmsData={{
                    key: 1,
                    values: templateTree && templateTree.value1,
                    month: data,
                    type
                  }}
                  dowloadURL="URL"
                  className='comfirm-btns'
                  onClose={this.onHandleCancel}
                >
                  <span>确定导出</span>
                </BasicDowload>
                <Button onClick={this.onHandleCancel} className='cancel-btn'>取消</Button>
              </Row>
            </TabPane>
            <TabPane tab="薪资核算模板2" key="2">
              <Form className='template-form' style={{ height: '2.3rem', overflowY: 'scroll', background: '#FBFBFB', margin: '0 0.1rem', paddingTop: 20 }}>
                <Form.Item>
                  {getFieldDecorator('checkboxGroup2', {
                    initialValue: templateTree && templateTree.value2
                  })(
                    <CheckboxGroup
                      options={templateTree && templateTree.template2}
                      className='set-check-group'
                      disabled
                    />
                  )}
                </Form.Item>
              </Form>
              <Row>
                <BasicDowload action={api}
                  parmsData={{
                    key: 2,
                    values: templateTree && templateTree.value2,
                    month: data,
                    type
                  }}
                  dowloadURL="URL"
                  className='comfirm-btns'
                  onClose={this.onHandleCancel}
                >
                  <span>确定导出</span>
                </BasicDowload>
                <Button onClick={this.onHandleCancel} className='cancel-btn'>取消</Button>
              </Row>
            </TabPane>
            <TabPane tab="自定义模板" key="3">
              <div className='template-form' style={{ height: '2.3rem', overflowY: 'scroll', background: '#FBFBFB', margin: '0 0.1rem', paddingTop: 15 }}>
                <Checkbox
                  indeterminate={indeterminate}
                  onChange={this.onCheckAllChange}
                  checked={checkAll}
                  className='checked-all'
                >
                  全选
                </Checkbox>
                <CheckboxGroup
                  options={templateTree && templateTree.template3}
                  value={threeValueList}
                  onChange={this.onChange}
                  className='set-check-color'
                />
              </div>
              <Row>
                <BasicDowload action={api}
                  parmsData={{
                    key: 3,
                    values: threeValueList,
                    month: data,
                    type
                  }}
                  disabled={threeValueList.length <= 0}
                  dowloadURL="URL"
                  className={threeValueList.length > 0 ? 'comfirm-btns' : 'comfirm'}
                  onClose={this.onHandleCancel}
                >
                  <span>确定导出</span>
                </BasicDowload>
                <Button onClick={this.onHandleCancel} className='cancel-btn'>取消</Button>
              </Row>
            </TabPane>
          </Tabs>
        </Modal>
      </div>
    )
  }
}

export default Form.create<TemplateModalProps>()(TemplateModal)
