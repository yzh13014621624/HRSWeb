/**
 * @author minjie
 * @createTime 2019/04/07
 * @description 参保标准
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent, EmptyTable, BasicModal } from '@components/index'
import { hot } from 'react-hot-loader'
import { Button, Pagination, Row } from 'antd'
import { BaseProps } from 'typings/global'
import SysUtil from '@utils/SysUtil'
import SearchItem from '../components/SearchItem'
import BtnColumn from '../components/BtnColumn'
import ColumnsContent from '../components/ColumnsContent'

import '../style/StandardPage.styl'

interface StandardPageProps extends BaseProps {
  type?: any
}

interface StandardPageState {
  dataSource:any // 表格的值
  searchParams:any // 搜索条件
  warnMsg:string // 提示消息
  keys: any // 保存多选的
  errorBtn: string
}

@hot(module)
export default class StandardPage extends RootComponent<StandardPageProps, StandardPageState> {
  private BasicModal= React.createRef<BasicModal>() // 模态框
  private BasicModalTwo = React.createRef<BasicModal>() // 模态框
  private keysName:Array<string> = [] // 保存删除的名称

  private apiObj:any = { // 下载导出的api
    importApi: this.api.paramsStandardImport,
    exportApi: this.api.paramsStandardExport,
    exportTemplte: this.api.paramsStandardExportTemplate,
    fileName: 'HR参保标准信息导出',
    fileNameTemplte: 'HR参保标准信息导入模板'
  }

  private page:number = 1 // 当前页
  private pageSize:number = 2 // 页数
  private params:any = { // 查询的参数
    endTime: undefined,
    startTime: undefined,
    standardName: undefined
  }
  // 分页
  private pagination:any = {
    current: 1, // 当前的页
    pageSize: 2, // 每页显示的条数
    total: 1,
    size: 'small',
    showQuickJumper: true,
    onChange: (page: number) => {
      this.pagination.current = page
      this.page = page
      this.loadingTableData()
    },
    itemRender: (current: number, type: string, originalElement: any) => {
      if (type === 'prev') {
        return <Button size='small' style={{ margin: '0 6px' }}>上一页</Button>
      } if (type === 'next') {
        return <Button size='small' style={{ margin: '0 6px' }}>下一页</Button>
      }
      return originalElement
    }
  }

  constructor (props:any) {
    super(props)
    const searchParams = SysUtil.getSessionStorage('StandardPage_searchParams')
    this.params = searchParams
    this.state = {
      searchParams: searchParams || {
        endTime: undefined,
        startTime: undefined,
        standardName: undefined
      },
      warnMsg: '',
      dataSource: [],
      keys: [],
      errorBtn: '知道了'
    }
  }

  /** 初始化数据 */
  componentDidMount () {
    this.loadingTableData()
  }

  /** tab 切换之后 重新加载数据 */
  UNSAFE_componentWillReceiveProps (porps:any) {
    if (porps.type === 'stand') {
      this.loadingTableData()
    }
  }

  /** 查询数据 */
  loadingTableData = () => {
    const { axios, api, page, pageSize, pagination, params } = this
    const obj = { ...params, page, pageSize }
    axios.request(api.paramsStandardQuery, obj).then((res:any) => {
      const { data, totalNum, currentPage } = res.data
      pagination.total = totalNum
      pagination.current = currentPage
      this.setState({
        dataSource: data
      })
    }).catch((err:any) => {
      this.setState({
        dataSource: []
      })
      console.log(err.msg)
    })
  }

  /** 获取到搜索的参数 */
  getSearchData = (data:any) => {
    const { endTime, startTime, standardName } = data
    this.params = data
    this.page = 1
    this.setState({ searchParams: { endTime, startTime, standardName } })
    this.loadingTableData()
  }

  /** 查看详情 */
  detailFun = (id:number) => {
    this.props.history.push({
      pathname: `parameters/standard/${id}`
    })
  }

  /** 删除之后重新计算page, num:删除了多少条 */
  chongPage = (num:number) => {
    const { dataSource } = this.state
    // 剩余的条数
    let pageSize = dataSource.length - num
    if (pageSize === 0) {
      this.page = this.page > 1 ? this.page - 1 : this.page
    }
  }

  /* 删除信息 */
  removeData = () => {
    const { handleCancel } = this.BasicModal.current as BasicModal
    const { api, axios } = this
    axios.request(api.paramsStandardRemove, {
      deleteList: this.state.keys
    }).then((res:any) => {
      if (res.code === 200) {
        const { searchParams } = this.state
        this.chongPage(this.state.keys.length) // 重新计算
        this.keysName = []
        this.setState({ searchParams, keys: [] })
        this.loadingTableData()
        this.$message.success('删除成功！')
      } else {
        this.error(res.msg)
      }
    }).catch((err:any) => {
      this.error(err.msg)
    }).finally(() => handleCancel())
  }

  /* 删除 (0: 删除单个, 1: 删除多个) 提示 */
  removeFun = (num: number = 0, id?:number, isuse?:number) => {
    if (num === 0) {
      if (isuse === 1) {
        this.keysName = []
        this.setState({ errorBtn: '确定' })
        this.handleModal(1, 'two', `该参保标准正被引用/曾被应用，不可删除。`)
      } else {
        this.setState({
          keys: [id]
        })
        this.handleModal(1, 'one', `确认删除?`)
      }
    } else {
      if (this.state.keys.length > 0) {
        if (this.keysName.length > 0) {
          this.setState({ errorBtn: '知道了' })
          this.handleModal(1, 'two', `以下参保标准正被引用/曾被应用，不可删除。`)
        } else {
          this.handleModal(1, 'one', `确认删除?`)
        }
      } else {
        this.handleModal(1, 'two', `请选择需删除的参保标准`)
      }
    }
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

  /** 保存选中的信息 */
  checkChange = (flg:boolean, id:number, name?:string) => {
    let { keys } = this.state
    if (flg) {
      keys.push(id)
      if (name) this.keysName.push(name)
    } else {
      if (name) this.keysName.splice(this.keysName.indexOf(name), 1)
      keys.splice(keys.indexOf(id), 1)
    }
    this.setState({
      keys: [...new Set(keys)]
    })
  }

  render () {
    const { searchParams, dataSource, warnMsg, keys, errorBtn } = this.state
    return (
      <div>
        <SearchItem namePlaceholder='请输入参保标准名称' searchParams={searchParams} getSearchData={this.getSearchData} type={1} />
        <BtnColumn apiObj={this.apiObj} searchParams={searchParams}
          addPath = {'/home/parameters/standard'} type='stand'
          removeFun={this.removeFun} {...this.props}></BtnColumn>
        {dataSource.length > 0 ? <div>
          {dataSource.map((el:any, index:number) => (
            <ColumnsContent type="stand" detailFun={this.detailFun} keys={keys} checkChange={this.checkChange}
              removeFun={this.removeFun} key={index} record={el}></ColumnsContent>
          ))}
          {dataSource.length > 0 ? <div style={{ textAlign: 'right', margin: '10px' }}>
            <Pagination {...this.pagination} />
          </div> : null}
        </div> : <EmptyTable/>}
        {/** 弹出框 */}
        <BasicModal ref={this.BasicModal} title="提示">
          <p className="delete-p"><span>{warnMsg}</span></p>
          <Row>
            <Button onClick={() => (this.removeData())} type="primary">确认</Button>
            <Button onClick={() => (this.handleModal(0, 'one'))} type="primary">取消</Button>
          </Row>
        </BasicModal>
        <BasicModal ref={this.BasicModalTwo} title="提示">
          <p className={this.keysName.length > 0 ? 'error-pn' : 'error-p' }><span>{warnMsg}</span></p>
          {this.keysName.map((el:any, index:number) => (
            <p key={index} className="error-pname"><span>{el}</span></p>
          ))}
          <Row>
            <Button onClick={() => (this.handleModal(0, 'two'))} type="primary">{errorBtn}</Button>
          </Row>
        </BasicModal>
      </div>
    )
  }
}
