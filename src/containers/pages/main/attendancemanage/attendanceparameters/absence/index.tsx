/*
 * @description: 考勤管理-缺勤参数主页面
 * @author: zhousong
 * @lastEditors: zhousong
 * @Date: 2019-09-23 10:29:06
 * @LastEditTime: 2020-06-08 16:51:43
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { hot } from 'react-hot-loader'
import { FormProps } from 'typings/global'
import { RootComponent, BasicModal } from '@components/index'
import CommonPage from '../components/commonPage'
import { Icon, Form, Select, Input, Modal, Button, Row, Radio, TimePicker } from 'antd'
import CodeList from '../codeList'
import _ from 'lodash'
import moment from 'moment'

const RadioGroup = Radio.Group
const { Option } = Select
const REQUEST_TYPE = 2 // 增删改查接口type值，班次-1，缺勤-2，加班-3

interface ShiftProps extends FormProps {
}
interface ShiftState {
  modalVisible: boolean,
  warnMsg: string,
  errorBtn: string,
  currentOphId: any,
  isEdit: boolean,
  loading: boolean,
  totalCount: any,
  tableData: any[],
  disabled: boolean,
  dailyAttendance: boolean
  disableName: boolean
  startOpen: boolean
  endOpen: boolean
}
@hot(module)
class Absence extends RootComponent<ShiftProps, ShiftState> {
  private BasicModal= React.createRef<BasicModal>() // 模态框
  private BasicModalTwo = React.createRef<BasicModal>() // 模态框
  timer: any = null
  constructor (props:any) {
    super(props)
    this.state = {
      modalVisible: false,
      warnMsg: '',
      errorBtn: '知道了',
      currentOphId: 0,
      isEdit: false,
      loading: false,
      totalCount: 0,
      tableData: [],
      disabled: false,
      dailyAttendance: true,
      disableName: false,
      startOpen: false,
      endOpen: false
    }
  }

  componentDidMount () {
    this.getPageData()
  }

  componentWillUnmount () {
    clearTimeout(this.timer)
  }

  getPageData = () => {
    this.setState({ loading: true })
    this.axios.request(this.api.querySchedulingList, { type: REQUEST_TYPE }, false).then(({ code, data }) => {
      if (code === 200) {
        this.setState({
          totalCount: data.count,
          tableData: data.scheList,
          loading: false
        })
      }
    })
  }

  onViewDeital = (item: any) => {
    if (!item) {
      this.setState({ modalVisible: true, isEdit: false }, () => {
        const storage = this.getCachedFromStorage('absence')
        this.props.form.setFieldsValue({
          ...storage
          // startWorkTime: storage && storage.startWorkTime ? moment(storage.startWorkTime) : null,
          // endWorkTime: storage && storage.endWorkTime ? moment(storage.endWorkTime) : null
        })
        this.setState((state) => ({
          // dailyAttendance: storage && storage.dailyAttendance !== undefined ? storage.dailyAttendance === 2 : state.dailyAttendance,
          disableName: false
        }))
        let hasEdit = false
        _.forEach(storage, (value, key) => {
          // if (key !== 'dailyAttendance' && value) {
          if (value) {
            hasEdit = true
          }
        })
        if (storage && hasEdit) {
          this.props.form.validateFields()
        }
        this.justifyConfirm()
      })
    } else {
      this.setState({
        modalVisible: true,
        isEdit: true,
        currentOphId: item.ophId,
        disableName: item.paramStatus === 1
        // dailyAttendance: item.dailyAttendance ? item.dailyAttendance === 2 : true
      }, () => {
        this.props.form.setFieldsValue({
          'schedulingCode': item.schedulingCode,
          'schedulingName': item.schedulingName
          // 'dailyAttendance': item.dailyAttendance || 2,
          // 'startWorkTime': item && item.startWorkTime ? moment(item.startWorkTime) : null,
          // 'endWorkTime': item && item.endWorkTime ? moment(item.endWorkTime) : null,
          // 'breakTime': item.breakTime
        })
        this.justifyConfirm()
      })
    }
  }

  onCloseModal = () => {
    this.setState({ modalVisible: false })
  }

  onSaveEdit = () => {
    const { currentOphId } = this.state
    this.props.form.validateFields((err, value: any) => {
      if (err) {
        return
      }
      const params = {
        ...value,
        ophId: currentOphId,
        type: REQUEST_TYPE,
        startWorkTime: value.startWorkTime ? moment(value.startWorkTime).format('YYYY-MM-DD HH:mm') : null,
        endWorkTime: value.endWorkTime ? moment(value.endWorkTime).format('YYYY-MM-DD HH:mm') : null
      }
      // if (value.dailyAttendance === 2) {
      //   delete params.startWorkTime
      //   delete params.endWorkTime
      //   delete params.breakTime
      // }
      delete params.schedulingCode
      this.axios.request(this.api.updateScheduling, params, false).then(({ code }) => {
        if (code === 200) {
          this.$message.success('保存成功')
          this.onCloseModal()
          this.getPageData()
        }
      })
    })
  }

  onSaveAdd = () => {
    this.props.form.validateFields((err, value: any) => {
      if (err) {
        return
      }
      const params = {
        ...value,
        type: REQUEST_TYPE,
        startWorkTime: value.startWorkTime ? moment(value.startWorkTime).format('YYYY-MM-DD HH:mm') : null,
        endWorkTime: value.endWorkTime ? moment(value.endWorkTime).format('YYYY-MM-DD HH:mm') : null
      }
      // if (value.dailyAttendance === 2) {
      //   delete params.startWorkTime
      //   delete params.endWorkTime
      //   delete params.breakTime
      // }
      this.axios.request(this.api.insertScheduling, params, false).then(({ code }) => {
        if (code === 200) {
          this.$message.success('新增成功')
          this.removeCachedStorage('absence')
          this.onCloseModal()
          this.getPageData()
        }
      })
    })
  }

  onOpenDeleteModal = (item: any) => {
    this.setState({
      currentOphId: item.ophId
    })
    this.handleModal(1, 'one', '确认删除？')
  }

  onDelete = () => {
    const { currentOphId } = this.state
    const { handleCancel } = this.BasicModal.current as BasicModal
    handleCancel()
    this.axios.request(this.api.deleteScheduling, { ophId: currentOphId }, false).then(({ code }) => {
      if (code === 200) {
        this.$message.success('删除成功')
        this.getPageData()
      }
    })
  }

  /** 模态框的显示 num: 0 关闭 1 打开  msg: 显示的消息 */
  handleModal = (num:number, type:string, msg?:string) => {
    if (type === 'one') {
      const { handleOk, handleCancel } = this.BasicModal.current as BasicModal
      if (num === 0) {
        handleCancel()
      } else {
        this.setState({ warnMsg: msg || '' })
        handleOk()
      }
    } else {
      const { handleOk, handleCancel } = this.BasicModalTwo.current as BasicModal
      if (num === 0) {
        handleCancel()
      } else {
        this.setState({ warnMsg: msg || '' })
        handleOk()
      }
    }
  }

  onReSort = (item: any, index: number, sort: number) => {
    const { tableData } = this.state
    if (item.sort === 1 && sort === 1) return
    if (index === tableData.length - 1 && sort === -1) return
    const prevItem = tableData[index - sort]
    const payload = {
      sortList: [
        {
          ophId: item.ophId,
          sort: prevItem.sort
        },
        {
          ophId: prevItem.ophId,
          sort: item.sort
        }
      ]
    }
    this.setState({ loading: true })
    this.axios.request(this.api.sortSchedulingList, payload, undefined, false).finally(() => { this.getPageData() })
  }

  justifyConfirm = () => {
    const { isEdit } = this.state
    if (this.timer) clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      let disabled = false
      const formValues = this.props.form.getFieldsValue()
      const erros = this.props.form.getFieldsError()
      _.forEach(formValues, (value, key) => {
        // if (formValues.dailyAttendance === 1) {
        if (value === undefined || value === null) {
          disabled = true
        }
        // } else {
        //   if (key !== 'startWorkTime' && key !== 'endWorkTime' && key !== 'breakTime') {
        //     if (value === undefined || value === null) {
        //       disabled = true
        //     }
        //   }
        // }
      })
      _.forEach(erros, (value) => {
        if (value !== undefined) {
          disabled = true
        }
      })
      if (!isEdit) {
        this.setCachedToStorage('absence', formValues)
      }
      this.setState({
        disabled
      })
    }, 50)
  }

  onChangeDaily = (e: any) => {
    this.setState({
      dailyAttendance: e.target.value === 2
    }, () => {
      this.props.form.validateFields()
      this.justifyConfirm()
    })
  }

  render () {
    const {
      isAuthenticated,
      AuthorityList,
      state: { modalVisible, warnMsg, errorBtn, isEdit, tableData, loading, totalCount, disabled, dailyAttendance, disableName, startOpen, endOpen },
      props: {
        form: { getFieldDecorator }
      }
    } = this
    const columns = [
      {
        title: '序号',
        dataIndex: 'serial',
        render: (value: any, item: any, index: number) => {
          return (
            <span>{index + 1}</span>
          )
        }
      },
      {
        title: '缺勤代码',
        dataIndex: 'schedulingCode'
      },
      {
        title: '缺勤名称',
        dataIndex: 'schedulingName'
      },
      {
        title: '上班打卡时间',
        dataIndex: 'startWorkTime',
        render: (value: any, item: any) => {
          if (value) {
            return <span>{moment(value).format('HH:mm')}</span>
          } else {
            return <span>---</span>
          }
        }
      },
      {
        title: '下班打卡时间',
        dataIndex: 'endWorkTime',
        render: (value: any, item: any) => {
          if (value) {
            return <span>{moment(value).format('HH:mm')}</span>
          } else {
            return <span>---</span>
          }
        }
      },
      {
        title: '休息时长',
        dataIndex: 'breakTime',
        render: (value: any, item: any) => {
          if (value) {
            return <span>{value}分钟</span>
          } else {
            return <span>---</span>
          }
        }
      },
      {
        title: '操作',
        dataIndex: 'actions',
        render: (value: any, item: any, index: any) => {
          return (
            <React.Fragment>
              {
                item.paramStatus === 1
                  ? <span>---</span>
                  : (
                    <React.Fragment>
                      {isAuthenticated(AuthorityList.composeParam[11]) && <a onClick={() => this.onViewDeital(item)}>查看</a>}
                      {isAuthenticated(AuthorityList.composeParam[12]) && <a className='action-link' onClick={() => this.onOpenDeleteModal(item)}>删除</a>}
                      {isAuthenticated(AuthorityList.composeParam[13]) &&
                        <>
                          <a className='action-link' onClick={() => this.onReSort(item, index, 1)}>
                            <Icon type="swap-right" className='action-swap-icon-up' />
                          </a>
                          <a className='action-link down' onClick={() => this.onReSort(item, index, -1)}>
                            <Icon type="swap-right" className='action-swap-icon-down' />
                          </a>
                        </>
                      }
                    </React.Fragment>
                  )
              }
            </React.Fragment>
          )
        }
      }
    ]
    const formItemLayout = {
      labelCol: { xs: { span: 24 }, sm: { span: 6 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 18 } }
    }
    return (
      <div className='absence'>
        <CommonPage
          columns={columns}
          handleAddButton={() => this.onViewDeital(undefined)}
          dataSource={tableData}
          loading={loading}
          count={totalCount}
          isAllowAdd={isAuthenticated(AuthorityList.composeParam[9])}
        />
        <Modal
          visible={modalVisible}
          onCancel={this.onCloseModal}
          width='480px'
          title={<div className='attendance-modal-title'>{isEdit ? '查看' : '新增'}</div>}
          footer={false}
          destroyOnClose={true}
        >
          <Form.Item label='缺勤代码' {...formItemLayout}>
            {getFieldDecorator('schedulingCode', {
              rules: [
                {
                  required: true,
                  message: '请选择缺勤代码'
                }
              ]
            })(
              <Select className='modal-form-width' allowClear onChange={this.justifyConfirm} disabled={isEdit} placeholder='请选择'>
                {
                  CodeList.lowerCase().map((item: any, index: number) => {
                    return (
                      <Option key={index} value={item}>{item}</Option>
                    )
                  })
                }
              </Select>
            )}
          </Form.Item>
          <Form.Item label='缺勤名称' {...formItemLayout}>
            {getFieldDecorator('schedulingName', {
              rules: [
                {
                  required: true,
                  message: '请输入缺勤名称'
                }
              ]
            })(
              <Input maxLength={20} allowClear disabled={disableName} className='modal-form-width' onChange={this.justifyConfirm} placeholder='请输入' />
            )}
          </Form.Item>
          {/* <Form.Item label='是否需要打卡' {...formItemLayout}>
            {getFieldDecorator('dailyAttendance', {
              initialValue: 2,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <RadioGroup onChange={this.onChangeDaily} >
                <Radio value={1}>是</Radio>
                <Radio value={2}>否</Radio>
              </RadioGroup>
            )}
          </Form.Item>
          <Form.Item label='上班打卡时间' {...formItemLayout}>
            {getFieldDecorator('startWorkTime', {
              rules: [
                {
                  required: !dailyAttendance,
                  message: '请选择上班打卡时间'
                }
              ]
            })(
              <TimePicker
                format="HH:mm"
                onChange={this.justifyConfirm}
                allowClear
                disabled={dailyAttendance}
                className='modal-form-width'
                onOpenChange={(open) => this.setState({ startOpen: open })}
                open={startOpen}
                addon={() => (
                  <div style={{ textAlign: 'right' }}>
                    <Button size="small" type="primary" onClick={() => this.setState({ startOpen: false })}>
                      确定
                    </Button>
                  </div>
                )}
              />
            )}
          </Form.Item>
          <Form.Item label='下班打卡时间' {...formItemLayout}>
            {getFieldDecorator('endWorkTime', {
              rules: [
                {
                  required: !dailyAttendance,
                  message: '请选择下班打卡时间'
                }
              ]
            })(
              <TimePicker
                format="HH:mm"
                onChange={this.justifyConfirm}
                allowClear
                disabled={dailyAttendance}
                className='modal-form-width'
                onOpenChange={(open) => this.setState({ endOpen: open })}
                open={endOpen}
                addon={() => (
                  <div style={{ textAlign: 'right' }}>
                    <Button size="small" type="primary" onClick={() => this.setState({ endOpen: false })}>
                      确定
                    </Button>
                  </div>
                )}
              />
            )}
          </Form.Item>
          <Form.Item label='休息时长' {...formItemLayout}>
            {getFieldDecorator('breakTime', {
              rules: [
                {
                  required: !dailyAttendance,
                  message: '请输入休息时长'
                },
                {
                  validator: (rules: any, value: any, callback: Function) => {
                    if (value && !dailyAttendance && !(/^[1-9]\d*$/.test(value))) {
                      callback(new Error('休息时长为正整数'))
                    }
                    callback()
                  }
                }
              ]
            })(
              <Input maxLength={3} disabled={dailyAttendance} allowClear className='modal-form-width' onChange={this.justifyConfirm} placeholder='请输入休息时长' suffix='分钟' />
            )}
          </Form.Item> */}
          <div className='modal-button-group'>
            {
              isEdit
                ? isAuthenticated(AuthorityList.composeParam[10]) && <Button className='modal-button' type='primary' disabled={disabled} onClick={this.onSaveEdit}>保存</Button>
                : <Button className='modal-button' type='primary' disabled={disabled} onClick={this.onSaveAdd}>确定</Button>
            }
            {
              isAuthenticated(AuthorityList.composeParam[10]) &&
              <Button className='modal-button' onClick={this.onCloseModal}>取消</Button>
            }
          </div>
        </Modal>
        {/** 确认弹出框 */}
        <BasicModal ref={this.BasicModal} title="提示">
          <p className="delete-p"><span>{warnMsg}</span></p>
          <Row>
            <Button onClick={() => (this.onDelete())} type="primary">确认</Button>
            <Button onClick={() => (this.handleModal(0, 'one'))} type="primary">取消</Button>
          </Row>
        </BasicModal>
        <BasicModal ref={this.BasicModalTwo} title="提示">
          <p className='error-p'><span>{warnMsg}</span></p>
          <Row>
            <Button onClick={() => (this.handleModal(0, 'two'))} type="primary">{errorBtn}</Button>
          </Row>
        </BasicModal>
      </div>
    )
  }
}
export default Form.create<FormProps>()(Absence)
