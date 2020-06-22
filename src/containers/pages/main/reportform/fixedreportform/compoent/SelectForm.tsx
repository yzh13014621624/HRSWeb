/*
 * @description: 固定报表-弹框报表名选项
 * @author: maqian
 * @github: git@code.aliyun.com:WOHAOYUN/thematrix.git
 * @lastEditors: maqian
 * @Date: 2019-07-29 11:33:01
 * @LastEditTime: 2019-08-06 16:40:43
 * @Copyright: Copyright © 2019  Shanghai  Shangjia  Logistics  Co.,  Ltd.  All  rights  reserved.
 */

import * as React from 'react'
import SysUtil from '@utils/SysUtil'
import { hot } from 'react-hot-loader'
import { BaseProps } from 'typings/global'
import { inject, observer } from 'mobx-react'
import { RootComponent } from '@components/index'
import { Button, Form, Radio, Modal } from 'antd'
import { FormComponentProps } from 'antd/lib/form'

import '../style/selectform.styl'

interface SelectFormProps extends FormComponentProps, BaseProps {
  closeModal:Function
  ryears:number
  rmonth:string
  mboxReport:any
}

@inject('mboxReport')
@observer
@hot(module)
class SelectForm extends RootComponent<SelectFormProps, any> {
  constructor (props:SelectFormProps) {
    super(props)
    this.state = {
      value: null,
      previewVisible: false
    }
  }
  handleSumbit = (e:any) => { // 点击提交，生成报表
    e.preventDefault()
    let data = this.props.form.getFieldsValue()
    const { type } = data
    SysUtil.setSessionStorage('reportType', type)
    this.closeModals()
    this.axios.request(this.api.reportsModal, {
      type
    }, true).then(({ response }) => {
      if (response) {
        this.closeModals()
        this.setState({
          previewVisible: true
        })
      } else {
        this.closeModals()
        this.requestReport()
      }
    }).catch((err:any) => {
      console.log(err)
      this.error(err.msg[0])
    })
  }
  handleReport = () => { // 二次弹框 覆盖之前报表
    this.requestReport()
  }
  requestReport = () => { // 生成报表接口
    const { ryears, rmonth } = this.props
    let type = SysUtil.getSessionStorage('reportType')
    this.axios.request(this.api.generateReport, {
      type
    }, true).then((res:any) => {
      const { setReports } = this.props.mboxReport
      this.setState({
        previewVisible: false
      })
      this.$message.success(res.data[0])
      let data = {
        ryears,
        rmonth
      }
      setReports(data)
    }).catch((err:any) => {
      this.error(err.msg[0])
    })
  }

  closeModals = () => {
    this.props.closeModal(false)
    this.props.form.resetFields()
  }
  render () {
    const { previewVisible } = this.state
    const { ryears, rmonth, form: { getFieldDecorator } } = this.props
    return (
      <div>
        <Form layout='inline' onSubmit={this.handleSumbit} id='select-form-box'>
          <Form.Item wrapperCol={{ span: 24 }}>
            {getFieldDecorator('type', {
              initialValue: 10
            })(
              <Radio.Group >
                <Radio className='select-item' value={10}>
                  花名册汇总表-{ryears + rmonth}
                </Radio>
                <Radio className='select-item' value={11}>
                  在职名单汇总表-{ryears + rmonth}
                </Radio>
                <Radio className='select-item' value={12}>
                  离职名单汇总表-{ryears + rmonth}
                </Radio>
                <Radio className='select-item' value={13}>
                  试用期审核名单汇总表-{ryears + rmonth}
                </Radio>
                <Radio className='select-item' value={14}>
                  合同到期名单汇总表-{ryears + rmonth}
                </Radio>
                <Radio className='select-item' value={15}>
                  合同信息汇总表-{ryears + rmonth}
                </Radio>
                <Radio className='select-item' value={16}>
                  异动信息汇总表-{ryears + rmonth}
                </Radio>
                <Radio className='select-item' style={{ paddingTop: 12, paddingBottom: 0 }} value={17}>
                  <span>参保明细汇总表-{ryears + rmonth}</span>
                  <p style={{ paddingLeft: 24, margin: '15px 0px' }}>参保费用拆分汇总表-{ryears + rmonth}</p>
                  <p style={{ paddingLeft: 24 }}>参保费用付款汇总表-{ryears + rmonth}</p>
                </Radio>
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item className="btn-margin-top">
            <Button htmlType="submit" className="sumbit-btn" type="primary">确定</Button>
            <Button onClick={this.closeModals} className="cancel-btn">取消</Button>
          </Form.Item>
        </Form>
        <Modal
          width='2.6rem'
          footer={null}
          maskClosable={false}
          className='modal-style'
          title='提示'
          style={{ textAlign: 'center' }}
          visible={previewVisible}
          onCancel={ () => { this.setState({ previewVisible: false }) } }
          maskStyle={{ background: 'rgba(0,0,0,0.5)' }}
        >
          <p style={{ marginBottom: 50, marginTop: 20 }}>确定生成新的报表，覆盖之前报表？</p>
          <Button onClick={this.handleReport} className="sumbit-btn" type="primary">确定</Button>
          <Button onClick={ () => { this.setState({ previewVisible: false }) }} className="cancel-btn">取消</Button>
        </Modal>
      </div>
    )
  }
}

export default Form.create<SelectFormProps>()(SelectForm)
