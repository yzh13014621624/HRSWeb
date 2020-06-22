/*
 * @description: 报表中心 - 新建组合报表 主板
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-04-23 17:48:28
 * @LastEditTime: 2019-06-13 14:30:05
 * @copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import RootComponent from '@components/root/RootComponent'
import BasicModal from '@components/modal/BasicModal'
import SharedStructure from '@shared/structure/SharedStructure'
import ReportFormTable from './Table'
import { Card, Row, Col, Button, Form, Checkbox, Select, Input, DatePicker, Icon } from 'antd'
import { hot } from 'react-hot-loader'

import moment from 'moment'
import SysUtil from '@utils/SysUtil'
import { outArray } from '@utils/ComUtil'
import { reportFormTemplateList } from './data'

import './style'

import { FormComponentProps } from 'antd/lib/form'
import { CheckboxChangeEvent, CheckboxOptionType } from 'antd/lib/checkbox'
import { BaseProps, KeyValue } from 'typings/global'

type CheckboxValueType = string | number | boolean

interface ReportFormProps extends BaseProps, FormComponentProps {
  getFormDate: (params: KeyValue) => void
}

interface ReportFormState {
  disabled: boolean
  project: {
    initial: boolean
    projectCheckedList: CheckboxValueType[]
    projectCheckedAll: boolean
    projectIndeterminate: boolean
  }
  entity: {
    entityCheckedList: CheckboxValueType[]
    entityCheckedAll: boolean
    entityIndeterminate: boolean
  }
  organize: {
    organizeCheckedList: CheckboxValueType[]
    organizeCheckedAll: boolean
    organizeIndeterminate: boolean
  }
  treeOrganizeList: string[]
  projectList: (CheckboxOptionType | string)[]
  entityList: (CheckboxOptionType | string)[]
  organizeList: (CheckboxOptionType | string)[]
  reportFormTemplateName: undefined | string
  reportFormTemplateAlias: string
  reportFormDate: moment.Moment | undefined
  reportFormName: string
  isFullFilledName: boolean
  isRepeatReportFormName: boolean,
  tableProjectCheckedList: CheckboxValueType[]
  tableEntityCheckedList: CheckboxValueType[]
  tableOrganizeCheckedList: CheckboxValueType[]
  tableReportFormName: string
  tableTemplateName: string
  tableTemplateAlias: string
  tableReportFormDate: moment.Moment | undefined
  preventClickMore: boolean
}

class ReportForm extends RootComponent<ReportFormProps, ReportFormState> {
  modal = React.createRef<BasicModal>()
  table = React.createRef<ReportFormTable>()
  input = React.createRef<Input>()
  projectCheckedList: CheckboxValueType[] = []
  entityCheckedList: CheckboxValueType[] = []
  organizeCheckedList: CheckboxValueType[] = []
  reportFormName: string = ''
  timerId: any = null
  preventClickMoreTimerId: any = null

  constructor (props: ReportFormProps) {
    super(props)
    this.state = {
      disabled: false,
      project: this.getSessionStorage('project') || {
        initial: true,
        projectCheckedList: [],
        projectCheckedAll: true,
        projectIndeterminate: false
      },
      entity: {
        entityCheckedList: [],
        entityCheckedAll: true,
        entityIndeterminate: false
      },
      organize: {
        organizeCheckedList: [],
        organizeCheckedAll: true,
        organizeIndeterminate: false
      },
      treeOrganizeList: [],
      projectList: [],
      entityList: [],
      organizeList: [],
      reportFormTemplateName: this.getSessionStorage('reportFormTemplateName') || undefined,
      reportFormTemplateAlias: '',
      reportFormDate: this.getSessionStorage('reportFormDate') || undefined,
      reportFormName: '',
      isFullFilledName: true,
      isRepeatReportFormName: false,
      // table 需要的数据
      tableProjectCheckedList: [],
      tableEntityCheckedList: [],
      tableOrganizeCheckedList: [],
      tableReportFormName: '',
      tableTemplateName: '',
      tableTemplateAlias: '',
      tableReportFormDate: undefined,
      preventClickMore: false
    }
  }

  // 读取项目缓存内容
  getSessionStorage (name: string) {
    const storagedContent = SysUtil.getSessionStorage('ReportFormContent') || {}
    return storagedContent[name]
  }

  // 存储项目内容
  setSessionStorage (name: string, val: KeyValue | string) {
    const storagedContent = SysUtil.getSessionStorage('ReportFormContent') || {}
    storagedContent[name] = val
    SysUtil.setSessionStorage('ReportFormContent', storagedContent)
  }

  // 清除项目缓存内容
  clearSessionStorage (name: string) {
    const storagedContent = SysUtil.getSessionStorage('ReportFormContent') || {}
    delete storagedContent[name]
    SysUtil.setSessionStorage('ReportFormContent', storagedContent)
  }

  // 设置 button 按钮状态
  setButtonIsDisabled () {
    const {
      project,
      entity,
      // organize,
      treeOrganizeList,
      reportFormTemplateName,
      reportFormDate
    } = this.state
    const disabled = !(
      !!project.projectCheckedList.length &&
      !!entity.entityCheckedList.length &&
      // !!organize.organizeCheckedList.length &&
      !!treeOrganizeList.length &&
      !!reportFormTemplateName &&
      !!reportFormDate
    )
    this.setState({ disabled })
  }

  /* *********************** start - 项目初始化 - start *********************** */

  async componentDidMount () {
    await this.initialProjectData()
    await this.getInitialList()
    this.setButtonIsDisabled()
  }

  async getInitialList () {
    const { api, axios } = this
    const { combinedEntityList, combinedOrganizeList } = api
    const { projectCheckedList } = this.state.project
    const len = projectCheckedList.length
    const projectArr = (len && projectCheckedList) || this.projectCheckedList // 全没选效果取全选
    // const promise = [combinedEntityList, combinedOrganizeList].map((api) => {
    //   return axios.request(api, { projectArr })
    // })
    // await Promise.all(promise)
    //   .then(([enList, orgList]: KeyValue[]) => {
    //     const entityList = enList.data
    //     this.transformEntityList(entityList)
    //     const organizeList = this.transformOrganizeList(orgList.data)
    //     this.setState({
    //       entityList,
    //       organizeList
    //     })
    //   })
    //   .catch(({ msg }) => {
    //     this.$message.error(msg[0])
    //   })
    const promise = [combinedEntityList].map((api) => {
      return axios.request(api, { projectArr })
    })
    await Promise.all(promise)
      .then(([enList]: KeyValue[]) => {
        const entityList = enList.data
        this.transformEntityList(entityList)
        this.setState({
          entityList
        })
      })
      .catch(({ msg }) => {
        this.$message.error(msg[0])
      })
  }

  // 初始化项目并收集所有 id
  async initialProjectData () {
    const { api, axios } = this
    await axios.request(api.combinedProjectList).then(({ data }) => {
      const projectCheckedList: number[] = []
      const { project } = this.state
      const state = {
        project,
        projectList: data
      }
      data.forEach((item: KeyValue) => {
        const { projectName, projectId } = item
        item.label = projectName
        item.value = projectId
        projectCheckedList.push(projectId)
      })
      this.projectCheckedList = projectCheckedList
      if (project.initial) project.projectCheckedList = projectCheckedList
      else delete state.project
      this.setState({ ...state })
    })
  }

  // 监听项目全选
  selectAllProjects = async (e: CheckboxChangeEvent) => {
    const { checked } = e.target
    const project = {
      initial: false,
      projectIndeterminate: false,
      projectCheckedAll: checked,
      projectCheckedList: checked ? this.projectCheckedList : []
    }
    this.setSessionStorage('project', project)
    this.clearSessionStorage('entity')
    this.clearSessionStorage('organize')
    await this.setState({ project })
    await this.getInitialList()
    this.setButtonIsDisabled()
  }

  // 监听项目单选
  getSelectedProject = async (projectCheckedList: Array<CheckboxValueType>) => {
    const len = this.state.projectList.length
    const checkedLen = projectCheckedList.length
    const project = {
      initial: false,
      projectCheckedList,
      projectCheckedAll: len === checkedLen,
      projectIndeterminate: !!checkedLen && (checkedLen < len)
    }
    this.setSessionStorage('project', project)
    this.clearSessionStorage('entity')
    this.clearSessionStorage('organize')
    await this.setState({ project })
    await this.getInitialList()
    this.setButtonIsDisabled()
  }

  /* *********************** end - 项目初始化 - end *********************** */

  // 初始化法人主体数据并收集所有 id
  transformEntityList (data: KeyValue[]) {
    let entityCheckedList: number[] = []
    data.forEach((item: KeyValue) => {
      const { entity, entityId } = item
      item.label = entity
      item.value = entityId
      entityCheckedList.push(entityId)
    })
    const entity = this.getSessionStorage('entity') || {
      entityCheckedList,
      entityCheckedAll: true,
      entityIndeterminate: false
    }
    this.entityCheckedList = entityCheckedList
    this.setState({ entity })
  }

  // 监听法人主体全选
  selectAllEntities = async (e: CheckboxChangeEvent) => {
    const { checked } = e.target
    const entity = {
      entityIndeterminate: false,
      entityCheckedAll: checked,
      entityCheckedList: checked ? this.entityCheckedList : []
    }
    await this.setState({ entity })
    this.setSessionStorage('entity', entity)
    this.setButtonIsDisabled()
  }

  // 监听法人主体单选
  getSelectedEntity = async (entityCheckedList: Array<CheckboxValueType>) => {
    const len = this.state.entityList.length
    const checkedLen = entityCheckedList.length
    const entity = {
      entityCheckedList,
      entityCheckedAll: len === checkedLen,
      entityIndeterminate: !!checkedLen && (checkedLen < len)
    }
    await this.setState({ entity })
    this.setSessionStorage('entity', entity)
    this.setButtonIsDisabled()
  }

  // 初始化组织数据并收集所有 id
  transformOrganizeList (data: KeyValue[]) {
    let organizeCheckedList: string[] = []
    data = outArray(data)
    data.forEach((item: KeyValue) => {
      const { lablekey } = item
      item.label = lablekey
      item.value = lablekey
      organizeCheckedList.push(lablekey)
    })
    const organize = this.getSessionStorage('organize') || {
      organizeCheckedList,
      organizeCheckedAll: true,
      organizeIndeterminate: false
    }
    this.organizeCheckedList = organizeCheckedList
    this.setState({ organize })
    return (data as CheckboxOptionType[])
  }

  // 监听组织全选
  selectAllOrganize = async (e: CheckboxChangeEvent) => {
    const { checked } = e.target
    const organize = {
      organizeIndeterminate: false,
      organizeCheckedAll: checked,
      organizeCheckedList: checked ? this.organizeCheckedList : []
    }
    await this.setState({ organize })
    this.setSessionStorage('organize', organize)
    this.setButtonIsDisabled()
  }

  // 监听组织单选
  getSelectedOrganize = async (organizeCheckedList: Array<CheckboxValueType>) => {
    const len = this.state.organizeList.length
    const checkedLen = organizeCheckedList.length
    const organize = {
      organizeCheckedList,
      organizeCheckedAll: len === checkedLen,
      organizeIndeterminate: !!checkedLen && (checkedLen < len)
    }
    await this.setState({ organize })
    this.setSessionStorage('organize', organize)
    this.setButtonIsDisabled()
  }

  // 监听报表模板选择
  getReportFormTemplate = async (reportFormTemplateName: string) => {
    await this.setState({ reportFormTemplateName })
    this.setSessionStorage('reportFormTemplateName', reportFormTemplateName)
    this.setButtonIsDisabled()
  }

  // 树状组织选择
  getOrganize = async (treeOrganizeList: string[]) => {
    await this.setState({ treeOrganizeList })
    // this.setSessionStorage('treeOrganizeList', treeOrganizeList)
    this.setButtonIsDisabled()
  }

  // 监听日期选择
  getSelectedDate = async (reportFormDate: any) => {
    await this.setState({ reportFormDate })
    this.setSessionStorage('reportFormDate', reportFormDate)
    this.setButtonIsDisabled()
  }

  // 查询报表数据
  queryReportData = async () => {
    const { reportFormName } = this
    const {
      project, entity, organize, reportFormDate, preventClickMore, treeOrganizeList
    } = this.state
    if (preventClickMore) return
    const { projectCheckedList } = project
    const { entityCheckedList } = entity
    // const { organizeCheckedList } = organize
    const reportFormTemplateName = this.state.reportFormTemplateName as string
    const template = reportFormTemplateList.find(item => item.name === reportFormTemplateName)
    const [reportYear, reportMonth] = moment(reportFormDate).format('YYYY-MM').split('-')
    await this.setState({
      reportFormTemplateAlias: (template as KeyValue)['alias'],
      reportFormName,
      tableProjectCheckedList: (projectCheckedList.length && projectCheckedList) || this.projectCheckedList,
      tableEntityCheckedList: (entityCheckedList.length && entityCheckedList) || this.entityCheckedList,
      tableOrganizeCheckedList: treeOrganizeList,
      // tableOrganizeCheckedList: (organizeCheckedList.length && organizeCheckedList) || this.organizeCheckedList,
      // tableReportFormName: `${reportFormName}-${reportFormTemplateName}${reportYear}${reportMonth}`,
      tableTemplateName: reportFormTemplateName,
      tableTemplateAlias: (template as KeyValue)['alias'],
      tableReportFormDate: reportFormDate,
      preventClickMore: true
    })
    // await this.table.current!.queryReportData()
    this.showModal()
    this.preventClickMoreTimerId = setTimeout(() => {
      this.setState({
        preventClickMore: false
      })
    }, 100)
  }

  showModal = () => {
    this.modal.current!.handleOk()
  }

  hideModal = () => {
    this.modal.current!.handleCancel()
    this.reportFormName = ''
  }

  getReportFormName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reportFormName = e.target.value
    this.setState({
      isFullFilledName: true
    })
    this.reportFormName = reportFormName
    if (!reportFormName.trim()) {
      this.setState({ isRepeatReportFormName: false })
      return
    }
    if (this.timerId) clearTimeout(this.timerId)
    this.timerId = setTimeout(() => {
      this.axios.request(this.api.combinedQueryReportName, { regexName: reportFormName })
        .then(() => {
          this.setState({ isRepeatReportFormName: false })
        })
        .catch(() => {
          this.setState({ isRepeatReportFormName: true })
        })
    }, 50)
  }

  // 生成报表
  createNewReportForm = async () => {
    const { reportFormName } = this
    if (!reportFormName.trim()) {
      this.setState({
        isFullFilledName: false
      })
      return
    }
    if (this.state.isRepeatReportFormName) return
    const {
      reportFormDate, reportFormTemplateName
    } = this.state
    const [reportYear, reportMonth] = moment(reportFormDate).format('YYYY-MM').split('-')
    await this.setState({
      tableReportFormName: `${reportFormName}-${reportFormTemplateName!}${reportYear}${reportMonth}`,
      tableTemplateName: reportFormTemplateName!
    })
    await this.table.current!.getTableData()
    this.hideModal()
    this.input.current!.input.value = ''
    this.reportFormName = ''
  }

  render () {
    const Option = Select.Option
    const CheckboxGroup = Checkbox.Group
    const {
      disabled,
      projectList, project,
      entityList, entity,
      organizeList, organize,
      treeOrganizeList,
      reportFormTemplateName, reportFormTemplateAlias,
      reportFormDate,
      reportFormName, isFullFilledName, isRepeatReportFormName,
      tableProjectCheckedList, tableEntityCheckedList, tableOrganizeCheckedList,
      tableReportFormName, tableTemplateName, tableTemplateAlias, tableReportFormDate
    } = this.state
    const { projectCheckedList, projectIndeterminate, projectCheckedAll } = project
    const { entityCheckedList, entityIndeterminate, entityCheckedAll } = entity
    const { organizeCheckedList, organizeIndeterminate, organizeCheckedAll } = organize
    return (
      <div>
        <Card id="report_form">
          <Row className="reportform_name">新建组合报表</Row>
          <Row className="form_item_container">
            <Col className="label_name"><span>*</span> 项目</Col>
            <Col className="form_item_wrapper project">
              <Checkbox
                onChange={this.selectAllProjects}
                indeterminate={projectIndeterminate}
                checked={projectCheckedAll}>
                全部
              </Checkbox>
              <CheckboxGroup
                options={projectList}
                value={projectCheckedList}
                onChange={this.getSelectedProject}>
              </CheckboxGroup>
            </Col>
          </Row>
          <Row className="form_item_container">
            <Col className="label_name"><span>*</span> 法人主体</Col>
            <Col className="form_item_wrapper entity">
              <Checkbox
                onChange={this.selectAllEntities}
                indeterminate={entityIndeterminate}
                checked={entityCheckedAll}>
                全部
              </Checkbox>
              <CheckboxGroup
                options={entityList}
                value={entityCheckedList}
                onChange={this.getSelectedEntity}>
              </CheckboxGroup>
            </Col>
          </Row>
          <Row className="form_item_container">
            <Col className="label_name"><span>*</span> 组织</Col>
            <Col className="form_item_wrapper organize">
              {/* <Checkbox
                indeterminate={organizeIndeterminate}
                checked={organizeCheckedAll}
                onChange={this.selectAllOrganize}>
                全部
              </Checkbox>
              <CheckboxGroup
                options={organizeList}
                value={organizeCheckedList}
                onChange={this.getSelectedOrganize}>
              </CheckboxGroup> */}
              <SharedStructure type="string" width="1.15rem" multiple onChange={this.getOrganize} />
            </Col>
          </Row>
          <Row className="form_item_container">
            <Col span={6}>
              <Col className="label_name select"><span>*</span> 报表模板</Col>
              <Col className="form_item_wrapper select">
                <Select
                  placeholder="请选择"
                  style={{ width: '1.15rem' }}
                  defaultValue={reportFormTemplateName}
                  onChange={this.getReportFormTemplate}>
                  {reportFormTemplateList.map(item => <Option value={item.name} title={item.name} key={item.id}>{item.name}</Option>)}
                </Select>
              </Col>
            </Col>
            <Col span={6}>
              <Col className="label_name date"><span>*</span> 报表月度</Col>
              <Col className="form_item_wrapper date">
                <DatePicker.MonthPicker
                  style={{ width: '1.15rem' }}
                  disabledDate={(current: any) => current && current >= moment().startOf('month')}
                  defaultValue={(reportFormDate && moment(reportFormDate)) || undefined}
                  onChange={this.getSelectedDate} />
              </Col>
            </Col>
          </Row>
          {
            this.isAuthenticated(this.AuthorityList.combinedreportform[1]) &&
            <Row className="button_wrapper">
              <Button type="primary" className="ant_button_confirm" disabled={disabled} onClick={this.queryReportData}>生成报表</Button>
            </Row>
          }
        </Card>
        {
          !!tableProjectCheckedList.length &&
          <ReportFormTable
            ref={this.table}
            showModal={this.showModal}
            projectCheckedList={tableProjectCheckedList}
            entityCheckedList={tableEntityCheckedList}
            organizeCheckedList={tableOrganizeCheckedList}
            reportFormName={tableReportFormName}
            templateName={tableTemplateName}
            templateAlias={tableTemplateAlias}
            reportFormDate={tableReportFormDate as moment.Moment} />
        }
        {/* 提示 */}
        <BasicModal ref={this.modal} title="生成报表" destroyOnClose>
          <div className="report_form_name">
            <Input
              placeholder="请输入报表名称"
              ref={this.input}
              maxLength={20}
              className={`modal_input ${isRepeatReportFormName ? 'error' : ''}`}
              onChange={this.getReportFormName} />
            {isRepeatReportFormName && <p className="error_tips">报表名称不能重复！</p>}
            {!isFullFilledName && <p className="error_tips">请输入报表名称</p>}
          </div>
          <Row className="report_form_modal_button_wrapper">
            <Button type="primary" className="ant_button_confirm" onClick={this.createNewReportForm}>确定生成</Button>
            <Button className="ant_button_cancel" onClick={this.hideModal}>取消生成</Button>
          </Row>
        </BasicModal>
      </div>
    )
  }

  componentWillUnmount () {
    clearTimeout(this.timerId)
    clearTimeout(this.preventClickMoreTimerId)
  }
}

@hot(module)
export default class CombinedReportFormPage extends RootComponent<BaseProps> {
  render () {
    const ReportFormComponent = Form.create<ReportFormProps>()(ReportForm)
    return (
      <div id="combined_reportform_container">
        <ReportFormComponent />
      </div>
    )
  }
}
