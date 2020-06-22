/**
 * @author maqian
 * @createTime 2019/04/08
 * @description 参保管理-参保核算
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent, TableItem } from '@components/index'
import { hot } from 'react-hot-loader'
import { FormComponentProps } from 'antd/lib/form'
import { Button, Form, Row, DatePicker, Input, Icon, Modal } from 'antd'
import './InsuredAccountePage.styl'
import date from '@assets/images/date.png'
import { IconFill } from '@components/icon/BasicIcon'
import TipModal from './InsuredaccountModal/InsuredTipModal'
import LoadModal from './InsuredaccountModal/InsuredLoadModal'
import Tip from './InsuredaccountModal/InsuredTip'
import NProgress from 'nprogress'
import moment from 'moment'
import 'nprogress/nprogress.css'
import SysUtil from '@utils/SysUtil'
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })

const { RangePicker } = DatePicker

interface FormProps extends FormComponentProps {
  searchData: Function
  searchParams?: any
}
// table表单关键字查询
class FormCompoent extends RootComponent<FormProps, any> {
  constructor (props:any) {
    super(props)
    const { takeEffectTimeStart, takeEffectTimeEnd, projectName, entity } = this.props.searchParams
    this.state = {
      searchParams: {
        takeEffectTimeStart: takeEffectTimeStart || '',
        takeEffectTimeEnd: takeEffectTimeEnd || '',
        projectName: projectName || '',
        entity: entity || ''
      },
      takeEffectTimeEnd: '',
      takeEffectTimeStart: ''
    }
  }
  handleSumbit = (e:any) => { // 点击搜索表单提交
    e.preventDefault()
    this.props.form.validateFieldsAndScroll({
      first: true
    }, (err, values) => {
      if (!err) {
        const { takeEffectTimeEnd, takeEffectTimeStart } = this.state
        const { projectName, entity } = values
        let dataParm = {
          projectName,
          entity,
          takeEffectTimeEnd,
          takeEffectTimeStart
        }
        this.props.searchData(dataParm) // 将数据传递到父组件
      }
    })
  }
  RangeChange = (dates:any, dateStrings:any) => { // 日期选择器改变时
    // 格式化试用期时间
    this.setState({
      takeEffectTimeStart: dateStrings[0],
      takeEffectTimeEnd: dateStrings[1]
    })
  }
  render () {
    const { getFieldDecorator } = this.props.form
    const { projectName, entity, takeEffectTimeStart, takeEffectTimeEnd } = this.state.searchParams
    return (
      <Form layout="inline" onSubmit={this.handleSumbit} style={{ marginBottom: '0.15rem' }}>
        <Form.Item label="生效日期" style={{ marginRight: '0.15rem' }}>
          {getFieldDecorator('takeEffectTimeEnd', {
            initialValue: takeEffectTimeStart ? [moment(takeEffectTimeStart), moment(takeEffectTimeEnd)] : undefined
          })(
            <RangePicker onChange={this.RangeChange} format='YYYY-MM-DD' suffixIcon={(<img src={date}/>)} className="data-width-300" />
          )}
        </Form.Item>
        <Form.Item style={{ marginRight: '0.15rem' }}>
          {getFieldDecorator('projectName', {
            initialValue: projectName,
            rules: [{
              required: false,
              pattern: new RegExp(/^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z_]|[0-9]){1,30}$/, 'g'),
              message: '请输入长度在30个字符之内'
            }]
          })(
            <Input placeholder="请输入项目名称" allowClear />
          )}
        </Form.Item>
        <Form.Item >
          {getFieldDecorator('entity', {
            initialValue: entity,
            rules: [{
              required: false,
              pattern: new RegExp(/^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z_]|[0-9]){1,30}$/, 'g'),
              message: '请输入长度在30个字符之内'
            }]
          })(
            <Input placeholder="请输入法人主体" allowClear />
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="btn-style">搜索</Button>
        </Form.Item>
        <Form.Item style={{ float: 'right' }}>
          <div className="tip-right">
            <Icon component={IconFill} className="tips-icon" />
            关账操作，每月只能执行一次！
          </div>
        </Form.Item>
      </Form>
    )
  }
}
const WrappedFormCompoent = Form.create<FormProps>()(FormCompoent)
interface InsuredAccountePageProps {
  history?:any
}
// 参保核算列表
@hot(module)
export default class InsuredAccountePage extends RootComponent<InsuredAccountePageProps, any> {
  tableRef = React.createRef<TableItem<any>>()
  constructor (props:any) {
    super(props)
    const searchParams = SysUtil.getSessionStorage('Insuredaccount_searchParams')
    this.state = {
      searchParams: searchParams || { // 查询参数
        takeEffectTimeStart: '', // 试用期开始时间
        takeEffectTimeEnd: '', // 试用期结束时间
        projectName: '', // 项目
        entity: '' // 法人主体
      },
      visible: false,
      tipModalVisible: false, // 关账模态关闭
      loadModalVisible: false, // 核算/关账下载模态关闭
      tipVisible: false, // 撤回模态关闭
      LoadcontentTips: '核算成功', // 下载模态标题
      insureData: '', // 核算数据存放,
      returnData: '' // 撤回关账数据存放
    }
  }
  insureChange = (record: any, e:any) => { // 点击 参保核算 事件
    e.preventDefault()
    const { iaId, closeAccount, entityId, projectId } = record
    this.setState({
      insureData: record
    })
    NProgress.set(0.0)
    NProgress.set(0.2)
    NProgress.set(0.4)
    NProgress.set(0.6)
    NProgress.set(0.8)
    NProgress.set(0.9)
    // 发送请求，获取核算结果
    this.axios.request(this.api.insureclose, {
      iaId,
      projectId,
      entityId,
      closeAccount,
      handleType: 0
    }).then((res:any) => {
      // 消息提示 路径跳转
      if (res.code === 200) {
        NProgress.set(1.0)
        NProgress.remove()
      }
      this.setState({
        loadModalVisible: true
      })
    }).catch((err:any) => {
      this.error(err.msg[0])
    })
  }
  returnChange = (record:any, e:any) => { // 点击 撤回关账 事件
    e.preventDefault()
    this.setState({
      tipVisible: true,
      returnData: record
    })
  }
  offChange = (record:any, e:any) => { // 点击 关帐按钮 事件
    e.preventDefault()
    this.axios.request(this.api.showChange, {
      iaId: record.iaId
    }).then((res:any) => {
      if (res.data) {
        this.setState({
          visible: true
        })
      } else {
        this.setState({
          tipModalVisible: true,
          insureData: record
        })
        return false
      }
    }).catch((err:any) => {
      this.error(err.msg[0])
    })
  }
  showDetail = (record:any, e:any) => { // 点击 查看 事件
    e.preventDefault()
    // 跳转详情页面
    this.routerLink('/home/InsuredAccounte/InsuredAccounteDetail')
    // 将数据存放在session中
    SysUtil.setSessionStorage('InsureDataDetail', record)
  }
  routerLink = (path:string) => { // 路由跳转
    this.props.history.push(path)
  }
  searchData = async (data:any) => { // 获取子组件传递过来的数据
    await this.setState({
      searchParams: data
    })
  }
  TipModalChange = (data: boolean) => { // 点击关账用于解手子组件传递的值
    this.tableRef.current!.loadingTableData()
    this.setState({
      tipModalVisible: data
    })
  }
  LoadModalChange = (data: boolean) => { // 下载数据自定义事件,用户接收子组件传递的数据
    this.setState({
      loadModalVisible: data
    })
  }
  TipChange = (data:any) => { // 撤回关帐点击
    this.tableRef.current!.loadingTableData()
    this.setState({
      tipVisible: data
    })
  }
  handleOk = () => {
    this.setState({
      visible: false
    })
  }
  handleCancel = () => {
    this.setState({
      visible: false
    })
  }
  render () {
    const {
      searchParams,
      visible,
      tipModalVisible, // 关账模态提示是否可见
      loadModalVisible, // 下载模态是否可见
      insureData, // 核算数据
      returnData, // 撤回关账数据
      LoadcontentTips, // 下载标题
      tipVisible // 撤回模态是否可见
    } = this.state
    const { AuthorityList, isAuthenticated } = this
    const [ , detail, account, close, reclose ] = AuthorityList.Insuredaccount
    let tags:any = {
      title: '操作',
      key: 'tags',
      width: 260,
      fixed: 'right',
      render: (text:string, record:any) => {
        const { closeAccount } = record
        return (
          <span>
            {
              isAuthenticated(detail) &&
                <a onClick={(e) => this.showDetail(record, e)} style={{ cursor: 'pointer', margin: '0 13px 0 0' }} title="用户查看" className="mgl10">查看</a>
            }
            {
              isAuthenticated(account) &&
                <a title="参保核算" style={{ cursor: 'pointer', margin: '0 13px 0 0' }} onClick={(e:any) => { this.insureChange(record, e) }}>参保核算</a>
            }
            {closeAccount === 0 && isAuthenticated(close)
              ? <a style={{ cursor: 'pointer', margin: '0 13px 0 0' }} title="关帐" onClick={(e) => this.offChange(record, e)}>关帐</a>
              : null
            }
            {closeAccount === 1 && isAuthenticated(close)
              ? <a style={{ pointerEvents: 'none', color: '#999', cursor: 'pointer', margin: '0 13px 0 0' }} title="关帐" onClick={(e) => this.offChange(record, e)}>关帐</a>
              : null
            }
            {closeAccount === 1 && isAuthenticated(reclose)
              ? <a style={{ cursor: 'pointer' }} title="撤回关帐" onClick={(e) => this.returnChange(record, e)}>撤回关帐</a>
              : null
            }
          </span>
        )
      }
    }
    let columnData = [
      { title: '序号', dataIndex: 'index', align: 'center', width: 100 },
      { title: '项目', dataIndex: 'projectName', width: 120, render: (text:any) => (<span>{text || '- - -'}</span>) },
      { title: '法人主体', dataIndex: 'entity', width: 300, render: (text:any) => (<span>{text || '- - -'}</span>) },
      { title: '参保城市', dataIndex: 'icName', width: 150, render: (text:any) => (<span>{text || '- - -'}</span>) },
      { title: '参保标准', dataIndex: 'standardName', width: 150, render: (text:any) => (<span>{text || '- - -'}</span>) },
      { title: '起缴规则', dataIndex: 'startRuleTime', width: 150, render: (text:any) => (<span>{text + '日' || '- - -'}</span>) },
      { title: '停缴规则', dataIndex: 'endRuleTime', width: 150, render: (text:any) => (<span>{text + '日' || '- - -'}</span>) },
      {
        title: '生效日期',
        dataIndex: 'takeEffectTimeRe',
        width: 150,
        render: (text:any) => (<span>{text || '- - -'}</span>),
        sorter: (a:any, b:any) => Date.parse(a.takeEffectTimeRe.replace('-', '/').replace('-', '/')) - Date.parse(b.takeEffectTimeRe.replace('-', '/').replace('-', '/'))
      },
      { title: '状态',
        dataIndex: 'closeAccount',
        width: 150,
        render: (text:string, record:any) => {
          const { closeAccount } = record
          return (
            closeAccount === 0 ? '本月未关帐' : '本月已关账'
          )
        }
      }
    ]
    if (isAuthenticated(detail) || isAuthenticated(account) || isAuthenticated(close) || isAuthenticated(reclose)) {
      columnData.push(tags)
    }
    return (
      <div id="insured-accounte-page">
        <Row>
          <WrappedFormCompoent searchParams={searchParams} searchData={this.searchData} {...this.props}/>
        </Row>
        <TableItem
          rowSelectionFixed
          filterKey="iaId"
          ref = {this.tableRef}
          URL={this.api.insureaccoutlist}
          columns={columnData}
          rowKey={({ iaId }) => iaId}
          scroll={{ x: 1700 }}
          searchParams={searchParams}
          bufferSearchParamsKey='Insuredaccount_searchParams'
        />
        {/* 点击关账 弹出提示框 */}
        <TipModal insureData={insureData} tipModalVisible={tipModalVisible} TipModalChange={this.TipModalChange} />
        {/* 下载数据
          loadModalVisible: 模态是否可见
          LoadModalChange: 接收子组件数据
          LoadcontentTips: 下载标题提示
          insureData: 传递给子组件的数据
        */}
        <LoadModal loadModalVisible={loadModalVisible} insureData={insureData} LoadModalChange={this.LoadModalChange} LoadcontentTips={LoadcontentTips}/>
        {/* 点击撤回 关账撤回提示 */}
        <Tip tipVisible={tipVisible} returnData={returnData} TipChange={this.TipChange}/>
        <Modal
          title='提示'
          style={{ textAlign: 'center' }}
          centered={true}
          footer={false}
          visible={visible}
          onCancel={this.handleCancel}
          width={'2.6rem'}
        >
          <div style={{ textAlign: 'center' }}>
            <Row>
              <p>该项目及法人主体下，存在员工个人参保参数未维护，不可关账！</p>
            </Row>
            <Row>
              <Button onClick={() => this.setState({ visible: false })} type="primary" className="sumbit-btn">确定</Button>
            </Row>
          </div>
        </Modal>
      </div>
    )
  }
}
