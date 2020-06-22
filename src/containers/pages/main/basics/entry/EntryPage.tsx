/**
 * @author minjie
 * @createTime 2019/03/26
 * @description 入职界面
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent, FileUpload, BasicDowload, TableItem, BasicModalNew } from '@components/index'
import { Button, Row, Col, Icon } from 'antd'
import { Link } from 'react-router-dom'
import { IconSc, IconDc, IconDr, IconXz, IconTj, IconZaizhi, IconDairuzhi, IconLizhi } from '@components/icon/BasicIcon'
import { SysUtil, outArrayNew } from '@utils/index'
import { BaseProps } from 'typings/global'
import { TableSearch, SendSMS, SmsInterface } from './component/index'
import moment from 'moment'

interface EntryPageState {
  /** 搜索的值 */
  searchParams: any
  /** 错误的消息 */
  errorMsg:string
  /** 错误弹窗的显示隐藏： 控制的值 */
  visible: boolean
  /** 导入的时候传递的 组织值 */
  organizeList:any
  /** 发送短信的 显示隐藏 */
  visibleSMS: boolean
}

export default class EntryPage extends RootComponent<BaseProps, EntryPageState> {
  constructor (props:any) {
    super(props)
    let commonOrganize = SysUtil.getSessionStorage('commonOrganize')
    this.state = {
      errorMsg: '',
      searchParams: SysUtil.getSessionStorage('entry_searchParams') || {},
      organizeList: outArrayNew(commonOrganize).map((el:any) => el.lablekey),
      visible: false,
      visibleSMS: false
    }
  }

  /** 对应不同的类型去执行不同的函数 */
  private handalModalKey:number = 0
  private tableItem = React.createRef<TableItem<any>>()
  /* 保存多选的信息 */
  private keys:any[] = []
  private bankCards:Array<string> = []
  private workConditionAry:Array<string> = []
  private key:any = 0
  private bankCard:any = ''
  private userId:number = 0

  /** 发送短信的数据 */
  private smsData:SmsInterface = { userId: 0, times: 0, msg: '', errMsg: '' }

  /** 查询数据 */
  searchData = (searchParams:any) => {
    this.setState({ searchParams })
  }

  /** 提示的弹窗： 显示隐藏 */
  handalModal = (num: number, errorMsg: string = '') => {
    switch (num) {
      // 删除单个
      case 2: this.removeData(0); break
      // 删除多个
      case 3: this.removeData(1); break
      // 入职生效
      case 4: this.entryIntoForce(this.userId); break
    }
    this.setState({ visible: num === 1, errorMsg })
  }

  /* 删除 (0: 删除单个, 1: 删除多个) 提示 */
  handleRemoveAfter = (num: number = 0, id?:number, bankCard?:string, e?:any) => {
    if (e) e.preventDefault()
    if (num === 0) {
      this.key = id
      this.bankCard = bankCard
      this.handalModalKey = 2
      this.handalModal(1, '确认删除？')
    } else {
      if (this.keys.length > 0) {
        let ary = this.workConditionAry.filter((el:any) => el !== '待入职')
        if (ary.length > 0) {
          this.handalModalKey = 0
          this.handalModal(1, '选择的员工中有在职员工，在职员工不可删除！')
        } else {
          this.handalModalKey = 3
          this.handalModal(1, '确认删除？')
        }
      } else {
        this.handalModalKey = 0
        this.handalModal(1, '请选择员工')
      }
    }
  }

  /* 删除信息 num: 0: 单个， 1: 多个 */
  removeData = (num:number) => {
    let bankCardArr = num === 0 ? [this.bankCard] : [...this.bankCards]
    let userIdArr = num === 0 ? [this.key] : [...this.keys]
    this.axios.request(this.api.entryDelete, {
      bankCardArr,
      userIdArr
    }).then((res:any) => {
      const { removeLodingTable } = this.tableItem.current as TableItem<any>
      removeLodingTable(userIdArr.length)
      this.handalModalKey = 0
      if (num === 0) {
        this.key = 0
        this.bankCard = ''
      } else {
        this.keys = []
        this.bankCards = []
        this.workConditionAry = []
      }
      this.$message.success('删除成功！')
    }).catch((err:any) => {
      this.handalModalKey = 0
      this.error(err.msg || err)
    })
  }

  /* 入职生效 提示 */
  handleEntryIntoForce = (userId:number, e?:any) => {
    if (e) e.preventDefault()
    this.userId = userId
    this.handalModalKey = 4
    this.handalModal(1, '入职生效后员工将转为在职状态，是否确认生效？')
  }

  /** 入职生效 */
  entryIntoForce = (userId:number) => {
    const { api, axios } = this
    axios.request(api.entrySuccess, {
      userId: userId
    }, true).then((res:any) => {
      const { code, errMsg, msg, times } = res.data
      if (code === 200) {
        this.userId = 0
        const { removeLodingTable } = this.tableItem.current as TableItem<any>
        this.handalModalKey = 0
        removeLodingTable()
        this.$message.success('入职成功！')
      } else {
        this.smsData = { userId: this.userId, errMsg, msg, times }
        this.handelSendSMS(true)
      }
    }).catch((err:any) => {
      this.handalModalKey = 0
      this.error(err.msg || err)
    })
  }

  /** 单个改变的时候 */
  getSelect = (record:any, selected:any, selectedRows:any) => {
    if (selected) { // 单个选中
      this.bankCards.push(record.bankCard)
      this.workConditionAry.push(record.workCondition)
      this.keys.push(record.userId)
    } else {
      let index = this.keys.indexOf(record.userId)
      let indexb = this.bankCards.indexOf(record.bankCard)
      let indexw = this.workConditionAry.indexOf(record.workCondition)
      if (index >= 0 && indexb >= 0) { // 存在则移除
        this.keys.splice(index, 1)
        this.bankCards.splice(indexb, 1)
        if (indexw >= 0) this.workConditionAry.splice(indexw, 1)
      }
    }
  }

  /** 多个改变的时候 */
  getSelectAll = (selected:any, selectedRows:any, changeRows:any) => {
    if (selected) { // 全部选中
      selectedRows.forEach((el:any) => {
        let index = this.keys.indexOf(el.userId)
        let indexb = this.bankCards.indexOf(el.bankCard)
        let indexw = this.workConditionAry.indexOf(el.workCondition)
        if (index < 0 && indexb < 0) {
          this.keys.push(el.userId)
          this.bankCards.push(el.bankCard)
          if (indexw < 0) this.workConditionAry.push(el.workCondition)
        }
      })
    } else {
      changeRows.forEach((el:any) => {
        let index = this.keys.indexOf(el.userId)
        let indexb = this.bankCards.indexOf(el.bankCard)
        let indexw = this.workConditionAry.indexOf(el.workCondition)
        if (index >= 0 && indexb >= 0) {
          this.keys.splice(index, 1)
          this.bankCards.splice(indexb, 1)
          if (indexw >= 0) this.workConditionAry.splice(indexw, 1)
        }
      })
    }
  }

  /** 发送短信通知 */
  handelSendSMS = (visibleSMS: boolean) => {
    this.setState({ visibleSMS })
  }

  render () {
    // 获取From 的表单的信息
    const { api, AuthorityList, isAuthenticated } = this
    const { searchParams, errorMsg, organizeList, visible, visibleSMS } = this.state
    let tags:any = {
      title: '操作',
      key: 'tags',
      fixed: 'right',
      width: 160,
      render: ({ workCondition, userId, entryTime, bankCard }:any) => {
        let ht:any = null
        if (isAuthenticated(AuthorityList.entry[3]) && workCondition === '待入职') {
          let date1 = new Date(moment().format('YYYY-MM-DD'))
          let date2 = new Date(moment(entryTime).format('YYYY-MM-DD'))
          if (date2.getTime() <= date1.getTime()) {
            ht = <a style={{ marginLeft: '13px' }} onClick={this.handleEntryIntoForce.bind(this, userId)}>入职生效</a>
          }
        }
        return (
          <span>
            {isAuthenticated(AuthorityList.entry[2]) && <Link to={`/home/entryPage/entryAdd/${userId}`}>查看</Link>}
            {ht}
            {isAuthenticated(AuthorityList.entry[4]) && workCondition === '待入职' &&
              <a onClick={this.handleRemoveAfter.bind(this, 0, userId, bankCard)} style={{ marginLeft: '13px' }}>删除</a>}
          </span>
        )
      }
    }
    let columnData = [
      { title: '序号', width: 80, dataIndex: 'index' },
      { title: '项目', width: 80, dataIndex: 'projectName' },
      {
        title: '工号',
        width: 100,
        dataIndex: 'projectNumber',
        render: (text:string) => (<span>{text || '- - -'}</span>)
      },
      {
        title: '管理编号',
        width: 140,
        dataIndex: 'sjNumber',
        render: (text:string) => (<span>{text || '- - -'}</span>)
      },
      { title: '姓名', width: 80, dataIndex: 'userName' },
      { title: '组织', width: 200, dataIndex: 'organize', render: (text:string) => (<span>{text || '- - -'}</span>) },
      {
        title: '在职状态',
        width: 100,
        dataIndex: 'workCondition',
        render: (text:string, record:any) => {
          let ic = text === '在职' ? IconZaizhi : text === '待入职' ? IconDairuzhi : IconLizhi
          return (
            <span>
              <Icon component={ic}></Icon>
              {text}
            </span>
          )
        }
      },
      {
        title: '入职日期',
        width: 100,
        dataIndex: 'entryTimeRe',
        sorter: (a:any, b:any) => Date.parse(a.entryTimeRe.replace('-', '/').replace('-', '/')) - Date.parse(b.entryTimeRe.replace('-', '/').replace('-', '/'))
      },
      {
        title: '离职日期',
        width: 100,
        dataIndex: 'quitTimeRe',
        sorter: (a:any, b:any) => a.quitTime > b.quitTime,
        render: (text:string) => (<span>{text || '- - -'}</span>)
      },
      {
        title: '工作岗位',
        width: 120,
        dataIndex: 'jobName',
        render: (text:string) => (<span>{text || '- - -'}</span>)
      },
      {
        title: '好饭碗登录账号',
        width: 120,
        dataIndex: 'hfwLoginNum',
        render: (text:string) => (<span>{text || '- - -'}</span>)
      },
      {
        title: '数据来源',
        width: 120,
        dataIndex: 'dataSource',
        render: (text:string) => (<span>{text || '- - -'}</span>)
      }
    ]
    if (isAuthenticated(AuthorityList.entry[2]) || isAuthenticated(AuthorityList.entry[3]) || isAuthenticated(AuthorityList.entry[4])) {
      columnData.push(tags)
    }
    return (
      <div style={{ padding: 20 }}>
        <Row>
          <Col><TableSearch serachParam={searchParams} setSerachParam={this.searchData} /></Col>
        </Row>
        <Row style={{ marginTop: 10, marginBottom: 20 }}>
          <Col>
            {isAuthenticated(AuthorityList.entry[1]) && <Button type="primary">
              <Link to='/home/entryPage/entryAdd'><Icon component={IconTj}/>
                <span style={{ margin: '0 0.02rem', letterSpacing: 0 }}>新增</span>
              </Link>
            </Button>}
            {isAuthenticated(AuthorityList.entry[4]) && <Button className="custom-page-btn" type="primary" onClick={() => this.handleRemoveAfter(1)}>
              <Icon component={IconSc}/>批量删除
            </Button> }
            {isAuthenticated(AuthorityList.entry[6]) && <FileUpload params={{ organizeList }} action={api.entryImportUserInfo.path}>
              <Button className="custom-page-btn" type="primary">
                <Icon component={IconDr}/>导入
              </Button>
            </FileUpload>}
            {isAuthenticated(AuthorityList.entry[7]) && <BasicDowload action={api.entryExportUserInfo}
              parmsData={searchParams} fileName="HR入职信息导出" dowloadURL="URL"
              className="custom-page-btn" btntype="primary">
              <Icon component={IconDc}/>导出
            </BasicDowload> }
            {isAuthenticated(AuthorityList.entry[8]) && <BasicDowload action={api.entryExportUserInfoTem}
              parmsData={{ type: '.xlsx' }} fileName="HR入职信息导入模板"
              className="custom-page-btn" btntype="primary">
              <Icon component={IconXz}/>下载导入模版
            </BasicDowload> }
          </Col>
        </Row>
        <TableItem
          ref={this.tableItem}
          rowSelectionFixed
          filterKey="index"
          rowKey={({ index }) => index}
          URL={api.entryQuery}
          searchParams={searchParams}
          columns={columnData}
          scroll={{ x: 1500 }}
          getRemoveSelect={this.getSelect}
          getRemoveSelectAll={this.getSelectAll}
          bufferSearchParamsKey='entry_searchParams'
        />
        <BasicModalNew visible={visible} onCancel={this.handalModal}>
          <p className="delete-p"><span>{errorMsg}</span></p>
          {this.handalModalKey === 0 ? <Row>
            <Button onClick={this.handalModal.bind(this, 0, '')} type="primary">确认</Button>
          </Row> : <Row>
            <Button onClick={this.handalModal.bind(this, this.handalModalKey, '')} type="primary">确认</Button>
            <Button onClick={this.handalModal.bind(this, 0, '')} type="primary">取消</Button>
          </Row>}
        </BasicModalNew>
        <SendSMS smsData={this.smsData} visible={visibleSMS} onCancel={this.handelSendSMS}/>
      </div>
    )
  }
}
