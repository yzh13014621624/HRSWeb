/*
 * @description: 法人主体管理主页面
 * @author: yanzihao
 * @lastEditors: yanzihao
 * @Date: 2020-05-08 13:43:35
 * @LastEditTime: 2020-06-18 11:33:12
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { FormComponentProps } from 'antd/lib/form'
import { RootComponent, TableItem, BasicDowload, BasicModal, FileUpload, BasicModalNew } from '@components/index'
import { Button, Form, Row, Input, Icon, Modal, Col, Select, Cascader } from 'antd'
import { IconTj, IconSc, IconDr, IconDc, IconXz } from '@components/icon/BasicIcon'
import { BaseProps, KeyValue } from 'typings/global'
import { BaseCommonModal } from '@shared/modal/Modal'
import { SysUtil } from '@utils/index'
import moment from 'moment'
import './index.styl'
const { Item } = Form
const { Option, OptGroup } = Select
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}

interface LegalentityManagementState {
  searchParams: any
  keys: any[] // 选中的列表的数据id集合
  msg: string // 模态框标题
  isDistabledBtn: boolean // 模态框里面的确认按钮是否可以点击
  legalEntityGetCityList: any[] // 存储所属城市
}

interface LegalentityManagementProps extends BaseProps, FormComponentProps {}

class LegalentityManagement extends RootComponent<LegalentityManagementProps, LegalentityManagementState> {
  tableRef = React.createRef<TableItem<any>>()
  modalRef = React.createRef<BasicModal>()
  BasicModalDel = React.createRef<BaseCommonModal>()
  addOrEdit: boolean = true // 新增-true 编辑-false
  selectData: any = {} // 当前操作的整条数据---点击查看的时候的当条数据
  constructor (props: LegalentityManagementProps) {
    super(props)
    const searchParams = SysUtil.getSessionStorage('legalentityManagement_searchParams')
    this.state = {
      searchParams: searchParams || {},
      isDistabledBtn: true,
      keys: [],
      msg: '新增',
      legalEntityGetCityList: []
    }
  }

  componentDidMount = () => {
    this.axios.request(this.api.LegalEntityGetCityList).then(({ data }) => {
      this.setState({
        legalEntityGetCityList: data
      })
    })
  }

  // 批量删除
  batchDel = () => {
    const { state: { keys } } = this
    if (!keys.length) this.$message.warning('请选择法人主体！')
    else this.BasicModalDel.current!.show()
  }

  // 删除二次确认
  isDelete = () => {
    const {
      state: { keys },
      api: { LegalEntityDelete }
    } = this
    this.BasicModalDel.current!.handleCancel()
    this.axios.request(LegalEntityDelete, { entityIds: keys }).then(({ code, data }) => {
      if (code === 200 && data === '1') {
        this.setState({ keys: [] })
        this.tableRef.current!.deletedAndUpdateTableData()
      } else if (code === 200 && data !== '1') this.errorTips(data)
    })
  }

  // 搜索按钮
  searchBtn = () => {
    const { props: { form: { getFieldsValue } } } = this
    const { projectId, cityId, entity } = getFieldsValue()
    this.setState({ searchParams: { projectId, cityId, entity } })
  }

  // 查看或者删除操作 1-查看 2-删除
  handleDetailOrdelete = async (record: any, type: number) => {
    const {
      props: { form: { setFieldsValue } }
    } = this
    let { projectId, cityId, entity, entityId } = record
    projectId = projectId.split(',')
    projectId = projectId.map((item: string) => Number(item))
    if (type === 2) {
      await this.setState({ keys: [entityId] })
      this.batchDel()
    } else {
      this.setState({ msg: '查看' })
      this.addOrEdit = false
      this.selectData = record
      await this.modalRef.current!.handleOk()
      this.changeBtnStatus()
      setFieldsValue({
        projectId1: projectId,
        cityId1: cityId,
        entity1: entity
      })
    }
  }

  // 获取选中的列表数据
  getSelect = (keys: any[]) => {
    this.setState({ keys })
  }

  // 新增
  addData = () => {
    this.addOrEdit = true
    this.selectData = {}
    this.setState({ msg: '新增' })
    this.modalRef.current!.handleOk()
  }

  // 模态框新增下编辑确认和取消事件 1-确认 0-取消
  editData = (type: number) => {
    const {
      addOrEdit,
      selectData,
      props: { form: { getFieldsValue } },
      api: { LegalEntityAddEntity, LegalEntityEditEntity }
    } = this
    let { projectId1, cityId1, entity1 } = getFieldsValue()
    const { entityId } = selectData
    projectId1 = projectId1 + ''
    this.modalRef.current!.handleCancel()
    let api: any = ''
    let params = {
      projectId: projectId1,
      cityId: cityId1,
      entityId,
      entity: entity1
    }
    if (addOrEdit) api = LegalEntityAddEntity
    else api = LegalEntityEditEntity
    if (type === 1) {
      this.axios.request(api, params).then(({ code }) => {
        if (code === 200) {
          if (addOrEdit) this.$message.success('新增成功！')
          else this.$message.success('修改成功！')
          this.tableRef.current!.loadingTableData()
        }
      })
    }
  }

  // 用于改变按钮的状态
  changeBtnStatus = () => {
    setTimeout(() => {
      const { props: { form: { getFieldsValue } } } = this
      const { projectId1, cityId1, entity1 } = getFieldsValue()
      if (projectId1 && projectId1.length && cityId1 && entity1) this.setState({ isDistabledBtn: false })
      else this.setState({ isDistabledBtn: true })
    })
  }

  // 提示信息
  errorTips = (msg: any) => {
    msg = msg.split(',')
    console.log(msg, 'msg')
    Modal.error({
      title: '消息提示',
      centered: true,
      content: <div>
        {
          msg.map((item: string) => (
            <div key={item} className={item.indexOf('删除') > 0 ? 'waringstyl' : ''}>{item}</div>
          ))
        }
      </div>

    })
  }

  render () {
    const {
      state: { searchParams, msg, isDistabledBtn, legalEntityGetCityList },
      api: { LegalEntityGetList, LegalEntityImportList, LegalEntityExportList, LegalEntityExportTem, LegalEntityGetCityList },
      props: { form: { getFieldDecorator } },
      AuthorityList: { legalentityManagement },
      addOrEdit
    } = this
    const [ edit, add, imt, ext, dowImt, del, dels ] = legalentityManagement
    const columnData = [
      { title: '序号', dataIndex: 'index', width: 150 },
      { title: '法人主体名称', dataIndex: 'entity', width: 320 },
      { title: '所属项目', dataIndex: 'projectName', width: 200 },
      { title: '所属城市', dataIndex: 'cityName', width: 300 },
      { title: '创建时间', dataIndex: 'createTime', width: 300 },
      {
        title: '操作',
        width: 120,
        render: (text: any, record: any) => (
          <div style={{ color: '#40A9FF' }} className='btn'>
            {
              this.isAuthenticated(edit) &&
              <span onClick={() => this.handleDetailOrdelete(record, 1)}>查看</span>
            }
            {
              this.isAuthenticated(del) &&
              <span onClick={() => this.handleDetailOrdelete(record, 2)}>删除</span>
            }
          </div>
        )
      }
    ]
    const pySegSort = (arr: any[]) => {
      if (!String.prototype.localeCompare) return null
      let letters = 'ABCDEFGHJKLMNOPQRSTWXYZ'.split('')
      let zh = '阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀'.split('')
      let segs: any[] = []
      letters.map((item, i) => {
        let cur: any = { letter: item, data: [] }
        arr.map((item: any) => {
          if (item.cityName.localeCompare(zh[i]) >= 0 && item.cityName.localeCompare(zh[i + 1]) < 0) {
            cur.data.push({ cityName: item.cityName, cityId: item.cityId })
          }
        })
        if (cur.data.length) {
          cur.data.sort((a: any, b: any) => {
            return a.cityName.localeCompare(b.cityName, 'zh')
          })
          segs.push(cur)
        }
      })
      return segs
    }
    const legal: any = legalEntityGetCityList.length > 0 ? pySegSort(legalEntityGetCityList) : []
    return (
      <div id='legalentitymanagement'>
        <Row>
          <Form layout='inline'>
            <Item label='所属项目'>
              {getFieldDecorator('projectId', {
                initialValue: searchParams.projectId
              })(
                <Select className='input-180' placeholder='请选择所属项目' allowClear>
                  <Option value={1}>上嘉</Option>
                  <Option value={2}>盒马</Option>
                  <Option value={3}>物美</Option>
                </Select>
              )}
            </Item>
            <Item label='所属城市'>
              {getFieldDecorator('cityId', {
                initialValue: searchParams.cityId
              })(
                <Select className='input-180' placeholder='请选择所属城市' allowClear showSearch optionFilterProp="children">
                  {
                    legal.length > 0 &&
                    legal.map((v: any) => {
                      return v.data.length > 0 && (
                        <OptGroup label={v.letter} key={v.letter}>
                          {
                            v.data.map((v: any) => {
                              return <Option value={v.cityId} key={v.cityId}>{v.cityName}</Option>
                            })
                          }
                        </OptGroup>
                      )
                    })
                  }
                </Select>
              )}
            </Item>
            <Item>
              {getFieldDecorator('entity', {
                initialValue: searchParams.entity
              })(
                <Input placeholder='请输入法人主体名称' allowClear />
              )}
            </Item>
            <Item>
              <Button type='primary' onClick={this.searchBtn}>搜索</Button>
            </Item>
          </Form>
        </Row>
        <Row className='actionbtn'>
          {
            this.isAuthenticated(add) &&
            <Button type="primary" onClick={this.addData}>
              <Icon component={IconTj}/>新增
            </Button>
          }
          {
            this.isAuthenticated(dels) &&
            <Button type="primary" onClick={this.batchDel}>
              <Icon component={IconSc}/>批量删除
            </Button>
          }
          {
            this.isAuthenticated(imt) &&
            <FileUpload
              action={LegalEntityImportList.path}>
              <Button className="contract-page-button" type="primary">
                <Icon component={IconDr}/>导入
              </Button>
            </FileUpload>
          }
          {
            this.isAuthenticated(ext) &&
            <BasicDowload
              action={LegalEntityExportList}
              parmsData={searchParams}
              fileName="法人主体导出"
              dowloadURL="URL"
              btntype="primary">
              <Icon component={IconDc}/>导出
            </BasicDowload>
          }
          {
            this.isAuthenticated(dowImt) &&
            <BasicDowload
              action={LegalEntityExportTem}
              parmsData={{ type: '.xlsx' }}
              fileName="法人主体导入模板"
              btntype="primary"
            >
              <Icon component={IconXz}/>下载导入模板
            </BasicDowload>
          }
        </Row>
        <Row>
          <TableItem
            ref={this.tableRef}
            rowSelectionFixed
            filterKey="entityId"
            rowKey={({ entityId }) => entityId}
            URL={LegalEntityGetList}
            searchParams={ searchParams }
            columns={columnData}
            scroll={{ x: 600 }}
            getSelectedRow={this.getSelect}
            bufferSearchParamsKey='legalentityManagement_searchParams'
          />
        </Row>
        <BaseCommonModal
          {...this.props}
          ref={this.BasicModalDel}
          confirm={this.isDelete}
          intercept
          text='确认要删除吗？'
        />
        <BasicModal
          ref={this.modalRef}
          maskClosable = {false}
          title={msg}
          destroyOnClose={true}
        >
          <Form>
            <Row>
              <Col>
                <Item label='法人主体名称' {...formItemLayout}>
                  {getFieldDecorator('entity1', {
                    rules: [{
                      required: true,
                      message: '请输入法人主体名称'
                    }]
                  })(
                    <Input
                      placeholder='请输入法人主体名称'
                      allowClear
                      className='input-220'
                      onChange={this.changeBtnStatus}
                    />
                  )}
                </Item>
              </Col>
            </Row>
            <Row>
              <Col>
                <Item label='所属项目' {...formItemLayout}>
                  {getFieldDecorator('projectId1', {
                    rules: [{
                      required: true,
                      message: '请选择所属项目'
                    }]
                  })(
                    <Select
                      mode="multiple"
                      className='input-220'
                      placeholder='请选择所属项目'
                      allowClear
                      onChange={this.changeBtnStatus}
                    >
                      <Option value={1}>上嘉</Option>
                      <Option value={2}>盒马</Option>
                      <Option value={3}>物美</Option>
                    </Select>
                  )}
                </Item>
              </Col>
            </Row>
            <Row>
              <Col>
                <Item label='所属城市' {...formItemLayout}>
                  {getFieldDecorator('cityId1', {
                    rules: [{
                      required: true,
                      message: '请选择所属城市'
                    }]
                  })(
                    <Select className='input-220' placeholder='请选择所属城市' allowClear showSearch optionFilterProp="children">
                      {
                        legal.length > 0 &&
                        legal.map((v: any) => {
                          return v.data.length > 0 && (
                            <OptGroup label={v.letter} key={v.letter}>
                              {
                                v.data.map((v: any) => {
                                  return <Option value={v.cityId} key={v.cityName}>{v.cityName}</Option>
                                })
                              }
                            </OptGroup>
                          )
                        })
                      }
                    </Select>
                  )}
                </Item>
              </Col>
            </Row>
          </Form>
          <Row style={{ marginTop: '20px' }}>
            <Col>
              <Button type="primary" onClick={() => this.editData(1)} disabled={isDistabledBtn}>{addOrEdit ? '确定' : '保存'}</Button>
              <Button onClick={() => this.editData(0)}>取消</Button>
            </Col>
          </Row>
        </BasicModal>
      </div>
    )
  }
}
export default Form.create<LegalentityManagementProps>()(LegalentityManagement)
