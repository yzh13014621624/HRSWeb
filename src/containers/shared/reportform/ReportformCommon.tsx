/**
 * @author maqian
 * @createTime 2019/04/28
 * @description 报表中心-公用部分
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { TableItem, RootComponent, BasicDowload } from '@components/index'
import { hot } from 'react-hot-loader'
import { FormComponentProps } from 'antd/lib/form'
import { Form, Table, ConfigProvider } from 'antd'
import NumberFormat from '@utils/NumberFormat'

interface ReportformCommonProps extends FormComponentProps {
  searchParams?:any
  formType?:any
  requestUrl?:any
  onChanges?:any
  ReportTable?:any
  raId?:any
  loading?:boolean
  columnData?:any
  dataSourcePic?:any
}
@hot(module)
class ReportformCommon extends RootComponent<ReportformCommonProps, any> {
  tableItem = React.createRef<TableItem<any>>()
  columnData: any[]
  scroll: {}
  constructor (props:any) {
    super(props)
    this.columnData = []
    this.state = {
      tableData: []
    }
    this.scroll = {}
    if (props.formType === '花名册汇总表') { // 1
      this.scroll = { x: 6500, y: 640 }
      this.columnData = [
        { title: '', dataIndex: 'index', align: 'center', width: 100 },
        { title: '项目', dataIndex: 'projectName', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '工号', dataIndex: 'projectNumber', width: 120, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '管理编号', dataIndex: 'sjNumber', width: 140, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '组织', dataIndex: 'organize', width: 300, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '在职状态', dataIndex: 'workCondition', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '入职日期', dataIndex: 'entryTime', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '离职日期', dataIndex: 'quitTime', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '服务期限', dataIndex: 'serviceTime', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '姓名', dataIndex: 'userName', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '性别', dataIndex: 'sex', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '年龄', dataIndex: 'age', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '身份证号码/通行证/护照号', dataIndex: 'idCard', width: 300, render: (text:string, recode:any) => { return <span>{text || recode.passportCard || '- - -'}</span> } },
        { title: '出生日期', dataIndex: 'birth', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '民族', dataIndex: 'nation', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '籍贯', dataIndex: 'nativePlace', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '国家', dataIndex: 'country', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '婚姻状况', dataIndex: 'maritalStatus', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '最高学历', dataIndex: 'maxEducation', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '银行卡号', dataIndex: 'bankCard', width: 300, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '户口地址', dataIndex: 'residenceAdress', width: 300, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '户口性质', dataIndex: 'residenceNature', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '联系地址', dataIndex: 'contactAdress', width: 300, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '联系方式', dataIndex: 'contactWay', width: 120, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '紧急联系人', dataIndex: 'urgentUser', width: 120, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '紧急联系人关系', dataIndex: 'urgentRelation', width: 170, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '紧急联系人电话', dataIndex: 'urgentPhone', width: 150, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '工时类型', dataIndex: 'hourType', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '计税类型', dataIndex: 'taxationType', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '合同起始日期', dataIndex: 'startTime', width: 150, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '合同终止日期', dataIndex: 'endTime', width: 150, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '试用期结束日期', dataIndex: 'tryEndTime', width: 180, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '试用期基本工资', dataIndex: 'probationBaseSalary', width: 180, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '试用期绩效工资', dataIndex: 'probationPerSalary', width: 180, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '等级', dataIndex: 'grade', width: 100, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '档级', dataIndex: 'files', width: 100, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '层级', dataIndex: 'level', width: 100, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '基本工资', dataIndex: 'baseSalary', width: 100, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '绩效工资', dataIndex: 'performanceSalary', width: 120, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '层级工资', dataIndex: 'hierarchySalary', width: 120, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '绩效奖金', dataIndex: 'performanceBonus', width: 120, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) }
      ]
    } else if (props.formType === '在职名单汇总表') { // 2
      this.scroll = { x: 6200, y: 640 }
      this.columnData = [
        { title: '', dataIndex: 'index', align: 'center', width: 100 },
        { title: '项目', dataIndex: 'projectName', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '工号', dataIndex: 'projectNumber', width: 120, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '管理编号', dataIndex: 'sjNumber', width: 140, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '组织', dataIndex: 'organize', width: 300, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '在职状态', dataIndex: 'workCondition', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '入职日期', dataIndex: 'entryTime', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '服务期限', dataIndex: 'serviceTime', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '姓名', dataIndex: 'userName', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '性别', dataIndex: 'sex', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '年龄', dataIndex: 'age', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '身份证号码/通行证/护照号', dataIndex: 'idCard', width: 300, render: (text:string, recode:any) => { return <span>{text || recode.passportCard || '- - -'}</span> } },
        { title: '出生日期', dataIndex: 'birth', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '民族', dataIndex: 'nation', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '籍贯', dataIndex: 'nativePlace', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '国家', dataIndex: 'country', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '婚姻状况', dataIndex: 'maritalStatus', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '最高学历', dataIndex: 'maxEducation', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '银行卡号', dataIndex: 'bankCard', width: 300, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '户口地址', dataIndex: 'residenceAdress', width: 300, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '户口性质', dataIndex: 'residenceNature', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '联系地址', dataIndex: 'contactAdress', width: 300, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '联系方式', dataIndex: 'contactWay', width: 120, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '紧急联系人', dataIndex: 'urgentUser', width: 120, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '紧急联系人关系', dataIndex: 'urgentRelation', width: 150, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '紧急联系人电话', dataIndex: 'urgentPhone', width: 150, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '工时类型', dataIndex: 'hourType', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '计税类型', dataIndex: 'taxationType', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '合同起始日期', dataIndex: 'startTime', width: 150, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '合同终止日期', dataIndex: 'endTime', width: 150, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '试用期结束日期', dataIndex: 'tryEndTime', width: 180, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '试用期基本工资', dataIndex: 'probationBaseSalary', width: 180, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '试用期绩效工资', dataIndex: 'probationPerSalary', width: 180, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '等级', dataIndex: 'grade', width: 100, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '档级', dataIndex: 'files', width: 100, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '层级', dataIndex: 'level', width: 100, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '基本工资', dataIndex: 'baseSalary', width: 120, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '绩效工资', dataIndex: 'performanceSalary', width: 120, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '层级工资', dataIndex: 'hierarchySalary', width: 120, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '绩效奖金', dataIndex: 'performanceBonus', width: 120, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) }
      ]
    } else if (props.formType === '离职名单汇总表') { // 3
      this.scroll = { x: 6250, y: 640 }
      this.columnData = [
        { title: '', dataIndex: 'index', align: 'center', width: 100 },
        { title: '项目', dataIndex: 'projectName', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '工号', dataIndex: 'projectNumber', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '管理编号', dataIndex: 'sjNumber', width: 140, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '组织', dataIndex: 'organize', width: 300, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '在职状态', dataIndex: 'workCondition', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '入职日期', dataIndex: 'entryTime', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '离职日期', dataIndex: 'quitTime', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '服务期限', dataIndex: 'serviceTime', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '姓名', dataIndex: 'userName', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '性别', dataIndex: 'sex', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '年龄', dataIndex: 'age', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '身份证号码/通行证/护照号', dataIndex: 'idCard', width: 300, render: (text:string, recode:any) => { return <span>{text || recode.passportCard || '- - -'}</span> } },
        { title: '出生日期', dataIndex: 'birth', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '民族', dataIndex: 'nation', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '籍贯', dataIndex: 'nativePlace', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '国家', dataIndex: 'country', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '婚姻状况', dataIndex: 'maritalStatus', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '最高学历', dataIndex: 'maxEducation', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '银行卡号码', dataIndex: 'bankCard', width: 300, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '户口地址', dataIndex: 'residenceAdress', width: 300, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '户口性质', dataIndex: 'residenceNature', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '联系地址', dataIndex: 'contactAdress', width: 300, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '联系方式', dataIndex: 'contactWay', width: 120, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '紧急联系人', dataIndex: 'urgentUser', width: 120, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '紧急联系人关系', dataIndex: 'urgentRelation', width: 150, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '紧急联系人电话', dataIndex: 'urgentPhone', width: 150, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '工时类型', dataIndex: 'hourType', width: 100, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '计税类型', dataIndex: 'taxationType', width: 100, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '合同起始日期', dataIndex: 'startTime', width: 150, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '合同终止日期', dataIndex: 'endTime', width: 150, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '试用期结束时间', dataIndex: 'tryEndTime', width: 180, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '试用期基本工资', dataIndex: 'probationBaseSalary', width: 180, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '试用期绩效工资', dataIndex: 'probationPerSalary', width: 180, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '等级', dataIndex: 'grade', width: 100, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '档级', dataIndex: 'files', width: 100, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '层级', dataIndex: 'level', width: 100, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '基本工资', dataIndex: 'baseSalary', width: 120, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '绩效工资', dataIndex: 'performanceSalary', width: 120, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '层级工资', dataIndex: 'hierarchySalary', width: 120, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '绩效奖金', dataIndex: 'performanceBonus', width: 120, render: (text:string) => (<span>{text || '- - -'}</span>) }
      ]
    } else if (props.formType === '试用期审核名单汇总表') { // 4
      this.scroll = { x: 2400, y: 640 }
      this.columnData = [
        { title: '', dataIndex: 'index', align: 'center', width: 100 },
        { title: '项目', dataIndex: 'projectName', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '工号', dataIndex: 'projectNumber', width: 120, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '管理编号', dataIndex: 'sjNumber', width: 140, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '组织', dataIndex: 'organize', width: 300, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '入职日期', dataIndex: 'entryTime', width: 120, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '姓名', dataIndex: 'userName', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '身份证号码/通行证/护照号', dataIndex: 'idCard', width: 300, render: (text:string, recode:any) => { return <span>{text || recode.passportCard || '- - -'}</span> } },
        // { title: '护照号码', dataIndex: 'passportCard', width: 300, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '员工类型', dataIndex: 'roleType', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '合同类型', dataIndex: 'contractType', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '法人主体', dataIndex: 'mainBody', width: 200, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '试用期起始日期', dataIndex: 'probationStart', width: 130, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '试用期结束时间', dataIndex: 'probationEnd', width: 130, render: (text:string) => (<span>{text || '- - -'}</span>) }
      ]
    } else if (props.formType === '合同到期名单汇总表') { // 5
      this.scroll = { x: 2700, y: 640 }
      this.columnData = [
        { title: '', dataIndex: 'index', align: 'center', width: 100 },
        { title: '项目', dataIndex: 'projectName', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '工号', dataIndex: 'projectNumber', width: 120, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '管理编号', dataIndex: 'sjNumber', width: 140, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '组织', dataIndex: 'organize', width: 300, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '入职日期', dataIndex: 'entryTime', width: 120, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '姓名', dataIndex: 'userName', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '身份证号码/通行证/护照号', dataIndex: 'idCard', width: 300, render: (text:string, recode:any) => { return <span>{text || recode.passportCard || '- - -'}</span> } },
        // { title: '护照号码', dataIndex: 'passportCard', width: 300, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '员工类型', dataIndex: 'roleType', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '合同类型', dataIndex: 'contractType', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '法人主体', dataIndex: 'mainBody', width: 140, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '工时类型', dataIndex: 'manHourType', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '计税类型', dataIndex: 'taxationType', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '合同起始日期', dataIndex: 'contractStart', width: 150, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '合同终止日期', dataIndex: 'contractEnd', width: 150, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '初签/续签', dataIndex: 'baseType', width: 150, render: (text:string) => (<span>{text || '- - -'}</span>) }
      ]
    } else if (props.formType === '合同信息汇总表') { // 6
      this.scroll = { x: 2700, y: 640 }
      this.columnData = [
        { title: '', dataIndex: 'index', align: 'center', width: 100 },
        { title: '项目', dataIndex: 'projectName', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '工号', dataIndex: 'projectNumber', width: 120, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '管理编号', dataIndex: 'sjNumber', width: 140, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '组织', dataIndex: 'organize', width: 300, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '入职日期', dataIndex: 'entryTime', width: 120, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '姓名', dataIndex: 'userName', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '身份证号码/通行证/护照号', dataIndex: 'idCard', width: 300, render: (text:string, recode:any) => { return <span>{text || recode.passportCard || '- - -'}</span> } },
        // { title: '护照号码', dataIndex: 'passportCard', width: 300, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '员工类型', dataIndex: 'roleType', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '合同类型', dataIndex: 'contractType', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '法人主体', dataIndex: 'mainBody', width: 140, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '工时类型', dataIndex: 'manHourType', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '计税类型', dataIndex: 'taxationType', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '合同初始日期', dataIndex: 'contractStart', width: 150, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '合同终止日期', dataIndex: 'contractEnd', width: 150, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '初签/续签', dataIndex: 'baseType', width: 150, render: (text:string) => (<span>{text || '- - -'}</span>) }
      ]
    } else if (props.formType === '异动信息汇总表') { // 7
      this.scroll = { x: 5970, y: 640 }
      this.columnData = [
        { title: '', dataIndex: 'index', align: 'center', width: 100 },
        { title: '项目', dataIndex: 'projectName', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '工号', dataIndex: 'projectNumber', width: 120, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '管理编号', dataIndex: 'sjNumber', width: 140, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '姓名', dataIndex: 'userName', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '入职日期', dataIndex: 'entryTime', width: 120, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '离职日期', dataIndex: 'quitTime', width: 120, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '异动生效日期', dataIndex: 'transactionDate', width: 150, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '在职状态', dataIndex: 'workCondition', width: 120, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '员工类型', dataIndex: 'roleType', width: 120, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '异动前-法人主体', dataIndex: 'beforeEntity', width: 200, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '异动后-法人主体', dataIndex: 'laterEntity', width: 200, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '异动前-组织', dataIndex: 'beforeOrganize', width: 120, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '异动后-组织', dataIndex: 'laterOrganize', width: 120, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '异动前-等级', dataIndex: 'beforeLevelName', width: 180, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '异动后-等级', dataIndex: 'laterLevelName', width: 180, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '异动前-档级', dataIndex: 'beforeGradeName', width: 180, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '异动后-档级', dataIndex: 'laterGradeName', width: 180, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '异动前-层级', dataIndex: 'beforeHierarchyName', width: 180, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '异动后-层级', dataIndex: 'laterHierarchyName', width: 180, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '异动前-职位', dataIndex: 'beforePosition', width: 180, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '异动后-职位', dataIndex: 'laterPosition', width: 180, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '异动前-职级', dataIndex: 'beforeRank', width: 180, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '异动后-职级', dataIndex: 'laterRank', width: 180, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '异动前-序列', dataIndex: 'beforeSequence', width: 180, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '异动后-序列', dataIndex: 'laterSequence', width: 180, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '异动前-职等', dataIndex: 'beforeOfficialRank', width: 180, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '异动后-职等', dataIndex: 'laterOfficialRank', width: 180, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '异动前-基本工资', dataIndex: 'beforeBaseSalary', width: 180, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '异动后-基本工资', dataIndex: 'laterBaseSalary', width: 180, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '异动前-绩效工资', dataIndex: 'beforePerformanceSalary', width: 180, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '异动后-绩效工资', dataIndex: 'laterPerformanceSalary', width: 180, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '异动前-层级工资', dataIndex: 'beforeHierarchySalary', width: 180, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '异动后-层级工资', dataIndex: 'laterHierarchySalary', width: 180, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '异动前-绩效奖金', dataIndex: 'beforePerformanceBonus', width: 180, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '异动后-绩效奖金', dataIndex: 'laterPerformanceBonus', width: 180, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '异动前-试用期基本工资', dataIndex: 'beforeProbationBaseSalary', width: 220, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '异动后-试用期基本工资', dataIndex: 'laterProbationBaseSalary', width: 220, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '异动前-试用期绩效工资', dataIndex: 'beforeProbationPerSalary', width: 220, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '异动后-试用期绩效工资', dataIndex: 'laterProbationPerSalary', width: 220, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) }
      ]
    } else if (props.formType === '参保明细汇总表') { // 8 有bug
      this.scroll = { x: 14900, y: 640 }
      this.columnData = [
        { title: '', dataIndex: 'index', align: 'center', width: 100 },
        { title: '项目', dataIndex: 'projectName', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '法人主体名称', dataIndex: 'entity', width: 140, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '工号', dataIndex: 'projectNumber', width: 120, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '管理编号', dataIndex: 'sjNumber', width: 140, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '姓名', dataIndex: 'userName', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '身份证号码/通行证/护照号', dataIndex: 'idCard', width: 300, render: (text:string) => { return <span>{text || '- - -'}</span> } },
        { title: '入职日期', dataIndex: 'entryTime', width: 120, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '离职日期', dataIndex: 'quitTime', width: 120, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '年度', dataIndex: 'computeYear', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '月份', dataIndex: 'computeMonth', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '社保起缴年度', dataIndex: 'insuranceStartYear', width: 140, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '社保起缴月份', dataIndex: 'insuranceStartMonth', width: 140, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '公积金起缴年度', dataIndex: 'housefundStartYear', width: 150, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '公积金起缴月份', dataIndex: 'housefundStartMonth', width: 150, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '社保停缴年度', dataIndex: 'insuranceShutYear', width: 140, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '社保停缴月份', dataIndex: 'insuranceShutMonth', width: 140, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '公积金停缴年度', dataIndex: 'housefundShutYear', width: 150, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '公积金停缴月份', dataIndex: 'housefundShutMonth', width: 150, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '参保城市', dataIndex: 'icName', width: 120, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '参保标准', dataIndex: 'standardName', width: 120, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '养老险缴费规则', dataIndex: 'pensionRulePay', width: 160, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '养老险缴费截止时间', dataIndex: 'pensionRuleTime', width: 180, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '养老险基数', dataIndex: 'pension', width: 130, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '养老险-个人', dataIndex: 'pensionIndividual', width: 130, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '养老险-公司', dataIndex: 'pensionCompany', width: 130, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '养老险补缴-个人', dataIndex: 'pensionIndividualSupplement', width: 180, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '养老险补缴-公司', dataIndex: 'pensionCompanySupplement', width: 180, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '医疗险缴费规则', dataIndex: 'medicalRulePay', width: 160, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '医疗险缴费截止时间', dataIndex: 'medicalRuleTime', width: 180, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '医疗险基数', dataIndex: 'medical', width: 130, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '医疗险-个人', dataIndex: 'medicalIndividual', width: 130, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '医疗险-公司', dataIndex: 'medicalCompany', width: 130, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '医疗险补缴-个人', dataIndex: 'medicalIndividualSupplement', width: 160, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '医疗险补缴-公司', dataIndex: 'medicalCompanySupplement', width: 160, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '失业险缴费规则', dataIndex: 'unemploymentRulePay', width: 160, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '失业险缴费截止时间', dataIndex: 'unemploymentRuleTime', width: 180, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '失业险基数', dataIndex: 'unemployment', width: 120, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '失业险-个人', dataIndex: 'unemploymentIndividual', width: 120, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '失业险-公司', dataIndex: 'unemploymentCompany', width: 120, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '失业险补缴-个人', dataIndex: 'unemploymentIndividualSupplement', width: 150, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '失业险补缴-公司', dataIndex: 'unemploymentCompanySupplement', width: 150, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '生育险缴费规则', dataIndex: 'fertilityRulePay', width: 160, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '生育险缴费截止时间', dataIndex: 'fertilityRuleTime', width: 180, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '生育险基数', dataIndex: 'fertility', width: 130, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '生育险-个人', dataIndex: 'fertilityIndividual', width: 130, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '生育险-公司', dataIndex: 'fertilityCompany', width: 130, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '生育险补缴-个人', dataIndex: 'fertilityIndividualSupplement', width: 160, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '生育险补缴-公司', dataIndex: 'fertilityCompanySupplement', width: 160, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '工伤险缴费规则', dataIndex: 'workhurtRulePay', width: 160, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '工伤险缴费截止时间', dataIndex: 'workhurtRuleTime', width: 180, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '工伤险基数', dataIndex: 'workhurt', width: 130, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '工伤险-个人', dataIndex: 'workhurtIndividual', width: 130, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '工伤险-公司', dataIndex: 'workhurtCompany', width: 130, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '工伤险补缴-个人', dataIndex: 'workhurtIndividualSupplement', width: 150, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '工伤险补缴-公司', dataIndex: 'workhurtCompanySupplement', width: 150, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '补充医疗险缴费规则', dataIndex: 'supMedicalRulePay', width: 180, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '补充医疗险缴费截止时间', dataIndex: 'supMedicalRuleTime', width: 210, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '补充医疗险基数', dataIndex: 'supMedical', width: 150, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '补充医疗险-个人', dataIndex: 'supMedicalIndividual', width: 150, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '补充医疗险-公司', dataIndex: 'supMedicalCompany', width: 150, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '补充医疗险补缴-个人', dataIndex: 'supMedicalIndividualSupplement', width: 180, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '补充医疗险补缴-公司', dataIndex: 'supMedicalCompanySupplement', width: 180, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '大病医疗险缴费规则', dataIndex: 'bigMedicalRulePay', width: 180, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '大病医疗险缴费截止时间', dataIndex: 'bigMedicalRuleTime', width: 210, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '大病医疗险基数', dataIndex: 'bigMedical', width: 140, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '大病医疗险-个人', dataIndex: 'bigMedicalIndividual', width: 140, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '大病医疗险-公司', dataIndex: 'bigMedicalCompany', width: 140, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '大病医疗险补缴-个人', dataIndex: 'bigMedicalIndividualSupplement', width: 180, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '大病医疗险补缴-公司', dataIndex: 'bigMedicalCompanySupplement', width: 180, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '公积金缴费规则', dataIndex: 'accFundRulePay', width: 140, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '公积金缴费截止时间', dataIndex: 'accFundRuleTime', width: 160, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '公积金基数', dataIndex: 'accFund', width: 120, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '公积金-个人', dataIndex: 'accFundIndividual', width: 120, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '公积金-公司', dataIndex: 'accFundCompany', width: 120, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '公积金补缴-个人', dataIndex: 'accFundIndividualSupplement', width: 160, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '公积金补缴-公司', dataIndex: 'accFundCompanySupplement', width: 160, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '残保金', dataIndex: 'residualPremium', width: 120, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '残保金补缴', dataIndex: 'residualPremiumSupplement', width: 140, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '服务费', dataIndex: 'serve', width: 140, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '服务费补缴', dataIndex: 'serveSupplement', width: 140, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '补充公积金缴费规则', dataIndex: 'supAccFundRulePay', width: 160, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '补充公积金缴费截止时间', dataIndex: 'supAccFundRuleTime', width: 190, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '补充公积金基数', dataIndex: 'supAccFund', width: 140, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '补充公积金-个人', dataIndex: 'supAccFundIndividual', width: 140, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '补充公积金-公司', dataIndex: 'supAccFundCompany', width: 140, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '补充公积金补缴-个人', dataIndex: 'supAccFundIndividualSupplement', width: 160, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '补充公积金补缴-公司', dataIndex: 'supAccFundCompanySupplement', width: 160, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '社保个人小计', dataIndex: 'insuranceIndividualSubtotal', width: 140, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '社保补缴-个人小计', dataIndex: 'insuranceSupplementIndividualSubtotal', width: 160, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '社保-公司小计', dataIndex: 'insuranceCompanySubtotal', width: 140, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '社保补缴-公司小计', dataIndex: 'insuranceSupplementCompanySubtotal', width: 160, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '社保-个人合计', dataIndex: 'insuranceIndividualTotal', width: 140, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '社保-公司合计', dataIndex: 'insuranceCompanyTotal', width: 140, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '公积金-个人合计', dataIndex: 'accFundIndividualTotal', width: 160, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '公积金-公司合计', dataIndex: 'accFundCompanyTotal', width: 160, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '社保-个人公司总计', dataIndex: 'insuranceIndividualCompanyTotal', width: 170, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '公积金-个人公司总计', dataIndex: 'accFundIndividualCompanyTotal', width: 170, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '残保金-总计', dataIndex: 'residualPremiumTotal', width: 130, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '服务费-总计', dataIndex: 'serveTotal', width: 130, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) }
      ]
    } else if (props.formType === '参保费用拆分汇总表') { // 9
      this.scroll = { x: 7800, y: 640 }
      this.columnData = [
        { title: '', dataIndex: 'index', align: 'center', width: 100 },
        { title: '项目', dataIndex: 'projectName', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '法人主体名称', dataIndex: 'entity', width: 140, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '核算年', dataIndex: 'computeYear', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '核算月', dataIndex: 'computeMonth', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '社保参保人数', dataIndex: 'insuranceInsuredCount', width: 140, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '养老险-基数汇总', dataIndex: 'pensionTotal', width: 180, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '养老险-个人汇总', dataIndex: 'pensionIndividualTotal', width: 180, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '养老险-公司汇总', dataIndex: 'pensionCompanyTotal', width: 180, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '医疗险-基数汇总', dataIndex: 'medicalTotal', width: 180, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '医疗险-个人汇总', dataIndex: 'medicalIndividualTotal', width: 180, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '医疗险-公司汇总', dataIndex: 'medicalCompanyTotal', width: 180, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '失业险-基数汇总', dataIndex: 'unemploymentTotal', width: 180, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '失业险-个人汇总', dataIndex: 'unemploymentIndividualTotal', width: 180, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '失业险-公司汇总', dataIndex: 'unemploymentCompanyTotal', width: 180, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '生育险-基数汇总', dataIndex: 'fertilityTotal', width: 180, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '生育险-个人汇总', dataIndex: 'fertilityIndividualTotal', width: 180, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '生育险-公司汇总', dataIndex: 'fertilityCompanyTotal', width: 180, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '工伤险-基数汇总', dataIndex: 'workhurtTotal', width: 180, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '工伤险-个人汇总', dataIndex: 'workhurtIndividualTotal', width: 180, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '工伤险-公司汇总', dataIndex: 'workhurtCompanyTotal', width: 180, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '大病医疗险-基数汇总', dataIndex: 'bigMedicalTotal', width: 220, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '大病医疗险-个人汇总', dataIndex: 'bigMedicalIndividualTotal', width: 220, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '大病医疗险-公司汇总', dataIndex: 'bigMedicalCompanyTotal', width: 220, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '补充医疗险-基数汇总', dataIndex: 'supMedicalTotal', width: 220, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '补充医疗险-个人汇总', dataIndex: 'supMedicalIndividualTotal', width: 220, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '补充医疗险-公司汇总', dataIndex: 'supMedicalCompanyTotal', width: 220, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '社保个人汇总', dataIndex: 'insuranceIndividualTotal', width: 220, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '社保公司汇总', dataIndex: 'insuranceCompanyTotal', width: 220, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '社保合计', dataIndex: 'insuranceIndividualCompanyTotal', width: 220, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '公积金参保人数', dataIndex: 'accFundInsuredCount', width: 180, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '公积金-基数汇总', dataIndex: 'accFundTotal', width: 180, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '公积金-个人汇总', dataIndex: 'accFundIndividualTotal', width: 180, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '公积金-公司汇总', dataIndex: 'accFundCompanyTotal', width: 180, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '公积金合计', dataIndex: 'accFundIndividualCompanyTotal', width: 220, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '补充公积金-基数汇总', dataIndex: 'supAccFundTotal', width: 220, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '补充公积金-个人汇总', dataIndex: 'supAccFundIndividualTotal', width: 220, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '补充公积金-公司汇总', dataIndex: 'supAccFundCompanyTotal', width: 220, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '残保金参保人数', dataIndex: 'residualPremiumInsuredCount', width: 180, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '残保金-公司汇总', dataIndex: 'residualPremiumCompanyCount', width: 180, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '服务费-公司汇总', dataIndex: 'serveCount', width: 180, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) }
      ]
    } else if (props.formType === '参保费用付款汇总表') { // 10
      this.scroll = { x: 2390, y: 640 }
      this.columnData = [
        { title: '', dataIndex: 'index', align: 'center', width: 100 },
        { title: '项目', dataIndex: 'projectName', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '法人主体名称', dataIndex: 'entity', width: 140, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '组织', dataIndex: 'organize', width: 300, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '核算年', dataIndex: 'computeYear', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '核算月', dataIndex: 'computeMonth', width: 110, render: (text:string) => (<span>{text || '- - -'}</span>) },
        { title: '社保费用-职工薪酬', dataIndex: 'insuranceCostEmolument', width: 200, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '社保费用-公司', dataIndex: 'insuranceCostCompany', width: 180, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '公积金费用-职工薪酬', dataIndex: 'accFundCostEmolument', width: 200, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '公积金费用-公司', dataIndex: 'accFundCostCompany', width: 200, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '残保金费用-公司', dataIndex: 'residualPremiumCostCompany', width: 200, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) },
        { title: '服务费用-公司', dataIndex: 'serveCostCompany', width: 200, render: (text:string) => (<span>{NumberFormat.doubleFormat(text, 2) || '- - -'}</span>) }
      ]
    }
  }

  componentDidMount () {
    this.initData()
  }

  initData = () => {
    const { requestUrl, searchParams, onChanges } = this.props
    this.axios.request(requestUrl, searchParams).then((res:any) => {
      // 消息提示 路径跳转
      let data = res.data.data
      data.forEach((item: any, i: number) => {
        item.index = (i + 1)
      })
      this.setState({
        tableData: data
      })
      onChanges(data, false)
    }).catch((err:any) => {
      console.log(err)
    })
  }

  render () {
    const { ReportTable, requestUrl, searchParams, dataSourcePic } = this.props
    return (
      <div className="reportform-common">
        <TableItem
          filterKey="index"
          rowKey={({ index }) => index}
          searchParams={searchParams}
          rowSelection={false}
          URL={requestUrl}
          columns={this.columnData}
          scroll={this.scroll}
          dataSourcePic={dataSourcePic}
        />
      </div>
    )
  }
}
const WrappedRegistrationForms = Form.create<ReportformCommonProps>()(ReportformCommon)
export default WrappedRegistrationForms
