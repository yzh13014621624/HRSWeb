/*
 * @description: 考勤管理-公共页面组件
 * @author: zhousong
 * @lastEditors: zhousong
 * @Date: 2019-09-23 10:55:31
 * @LastEditTime: 2020-04-13 09:54:47
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { hot } from 'react-hot-loader'
import { FormComponentProps } from 'antd/lib/form'
import { FormProps } from 'typings/global'
import { RootComponent, TableItem } from '@components/index'
import { Button, Icon, Divider, Form, Input, Row, Col, Spin } from 'antd'
import { IconTj } from '@components/icon/BasicIcon'
import './index.styl'

interface SettingProps extends FormProps {
}

interface SettingState {
  settingInfo: any
  loading: boolean
}

const Item = Form.Item

@hot(module)
class AttendSetting extends RootComponent<SettingProps, SettingState> {
  constructor (props: SettingProps) {
    super(props)
    this.state = {
      settingInfo: {},
      loading: false
    }
  }

  componentDidMount = () => {
    this.getSettingInfo()
  }

  getSettingInfo = () => {
    this.setState({
      loading: true
    })
    this.axios.request(this.api.getGraceTimeInfo, {}, false).then(({ code, data }) => {
      if (code === 200) {
        this.setState({
          settingInfo: data,
          loading: false
        })
      }
    })
  }

  normalize = (value: any) => {
    const reg = /^[0-9]\d*$/
    if (value || value === 0) {
      value = value instanceof String ? value.replace(/[^\d]/g, '') : value.toString().replace(/[^\d]/g, '')
      if (reg.test(value)) {
        return parseFloat(value)
      }
    }
  }

  handleSave = () => {
    this.props.form.validateFields((err: any, values: any) => {
      if (err) return
      const params = {
        ...values
      }
      this.axios.request(this.api.updateGraceTime, params, false).then(({ code, data }) => {
        if (code === 200) {
          this.$message.success('保存成功！')
          this.getSettingInfo()
        }
      })
    })
  }

  render () {
    const {
      props: { form: { getFieldDecorator } },
      state: {
        settingInfo, loading
      }
    } = this
    const formItemLayout = {
      labelCol: {
        style: {
          width: '120Px'
        }
      },
      wrapperCol: {
        style: {
          width: '150Px'
        }
      }
    }
    return (
      <div className='attend-setting'>
        <Spin spinning={loading}>
          <Item label='迟到宽限时间' {...formItemLayout} key='1' className='setting-formitem'>
            {
              getFieldDecorator('lateTime', {
                initialValue: settingInfo.lateTime || 0,
                normalize: this.normalize,
                rules: [
                  {
                    required: true,
                    message: '请输入迟到宽限时间'
                  }
                ]
              })(
                <Input maxLength={3} suffix='分钟' className='attend-input' />
              )
            }
          </Item>
          <Item label='早退宽限时间' {...formItemLayout} key='2' className='setting-formitem'>
            {
              getFieldDecorator('earlyTime', {
                initialValue: settingInfo.earlyTime || 0,
                normalize: this.normalize,
                rules: [
                  {
                    required: true,
                    message: '请输入早退宽限时间'
                  }
                ]
              })(
                <Input maxLength={3} suffix='分钟' className='attend-input' />
              )
            }
          </Item>
          <Item label='上班打卡时间范围' {...formItemLayout} key='3' className='setting-formitem'>
            {
              getFieldDecorator('startWorkTime', {
                initialValue: settingInfo.startWorkTime || 0,
                normalize: this.normalize,
                rules: [
                  {
                    required: true,
                    message: '请输入上班打卡时间范围'
                  }
                ]
              })(
                <Input maxLength={3} suffix='分钟' className='attend-input' />
              )
            }
          </Item>
          <Item label='下班打卡时间范围' {...formItemLayout} key='4' className='setting-formitem'>
            {
              getFieldDecorator('endWorkTime', {
                initialValue: settingInfo.endWorkTime || 0,
                normalize: this.normalize,
                rules: [
                  {
                    required: true,
                    message: '请输入下班打卡时间范围'
                  }
                ]
              })(
                <Input maxLength={3} suffix='分钟' className='attend-input' />
              )
            }
          </Item>
          <Divider type='horizontal' />
          <div className='title'>上次修改记录</div>
          <Item label='迟到宽限时间' className='setting-formitem' {...formItemLayout}>{settingInfo.lastLateTime || 0}分钟</Item>
          <Item label='早退宽限时间' className='setting-formitem' {...formItemLayout}>{settingInfo.lastEarlyTime || 0}分钟</Item>
          <Item label='上班打卡时间范围' className='setting-formitem' {...formItemLayout}>{settingInfo.lastStartWorkTime || 0}分钟</Item>
          <Item label='下班打卡时间范围' className='setting-formitem' {...formItemLayout}>{settingInfo.lastEndWorkTime || 0}分钟</Item>
        </Spin>
        <Button type='primary' className='setting-btn' onClick={this.handleSave}>保存</Button>
      </div>
    )
  }
}

export default Form.create<FormProps>()(AttendSetting)
