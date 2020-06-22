/**
 * @author maqian
 * @createTime 2019/03/28
 * @description 试用期
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { TableItem, RootComponent, BasicModal, BasicDowload } from '@components/index'
import { IconDc } from '@components/icon/BasicIcon'
import { hot } from 'react-hot-loader'
import { Form, Select, Input, Button, DatePicker, Row, Col, Icon, TreeSelect, Modal } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import '../contract.styl'
import moment from 'moment'
import date from '@assets/images/date.png'
import SharedStructure from '@shared/structure/SharedStructure'
import SysUtil from '@utils/SysUtil'

const Option = Select.Option
const { RangePicker } = DatePicker
const itemLayout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } }

interface FormProps extends FormComponentProps {
  searchData: Function
  searchParams?: any
}

// 试用期表单
@hot(module) // 热更新（局部刷新界面）
class FormTestCompoent extends RootComponent<FormProps, any> {
  constructor (props: any) {
    super(props)
    const { projectNumber, sjNumber, userName, organizeArr, placeholderText, tryEndTimeStart, tryEndTimeEnd } = this.props.searchParams
    this.state = {
      searchData: {
        projectNumber: projectNumber || '',
        sjNumber: sjNumber || projectNumber,
        userName: userName || '',
        organizeArr: organizeArr || []
      },
      dataList: Object,
      tryEndTimeStart: tryEndTimeStart || '',
      tryEndTimeEnd: tryEndTimeEnd || '',
      placeholderText: placeholderText || '管理编号'
    }
  }
  handleSumbit = (e:any) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll({
      first: true
    }, (err, values) => {
      if (!err) {
        const { tryEndTimeStart, tryEndTimeEnd } = this.state
        const { organizeArr, sjNumber, userName } = values
        if (this.state.placeholderText === '管理编号') {
          let dataParm = {
            organizeArr,
            projectNumber: '',
            sjNumber,
            userName,
            tryEndTimeStart,
            tryEndTimeEnd,
            placeholderText: '管理编号'
          }
          this.props.searchData(dataParm)
        } else {
          let dataParm = {
            organizeArr,
            projectNumber: sjNumber,
            sjNumber: '',
            userName,
            tryEndTimeStart,
            tryEndTimeEnd,
            placeholderText: '工号'
          }
          this.props.searchData(dataParm)
        }
      }
    })
  }

  placeholderChange = (val:string) => {
    this.setState({
      placeholderText: val
    })
  }

  RangeChange = (dates:any, dateStrings:any) => {
    this.setState({
      tryEndTimeStart: dateStrings[0],
      tryEndTimeEnd: dateStrings[1]
    })
  }
  render () {
    const { getFieldDecorator } = this.props.form
    const { searchData, placeholderText, tryEndTimeStart, tryEndTimeEnd } = this.state
    const { sjNumber, userName, organizeArr } = searchData
    return (
      <Form layout="inline" onSubmit={this.handleSumbit}>
        <Form.Item className="contract-com-margin-r-10">
          <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} defaultValue={placeholderText} onChange={this.placeholderChange} style={{ width: '0.63rem' }} >
            <Option value="工号">工号</Option>
            <Option value="管理编号">管理编号</Option>
          </Select>
        </Form.Item>
        <Form.Item className="contract-com-margin-r">
          {getFieldDecorator('sjNumber', {
            initialValue: sjNumber,
            rules: [{
              required: false,
              pattern: new RegExp(/^([a-zA-Z_]|[0-9]){1,14}$/, 'g'),
              message: '请输入字母或数字 长度在14位之内'
            }]
          })(
            <Input placeholder={`请输入${placeholderText}`} width="1.15rem" allowClear />
          )}
        </Form.Item>
        <Form.Item className="contract-com-margin-r">
          {getFieldDecorator('userName', {
            initialValue: userName,
            rules: [{
              required: false,
              pattern: new RegExp(/^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z_]){1,15}$/, 'g'),
              message: '请输入中文或英文 长度在15位之内'
            }]
          })(
            <Input placeholder="请输入姓名" width="1.15rem" allowClear />
          )}
        </Form.Item>
        <Form.Item className="contract-com-margin-r">
          {getFieldDecorator('organizeArr', {
            initialValue: organizeArr
          })(<SharedStructure type="string" multiple/>)}
        </Form.Item>
        <Form.Item label="试用期结束时间" className="contract-com-margin-r">
          {getFieldDecorator('tryEndTime', {
            initialValue: tryEndTimeStart && tryEndTimeEnd ? [moment(tryEndTimeStart), moment(tryEndTimeEnd)] : undefined
          })(
            <RangePicker onChange={this.RangeChange} format='YYYY-MM-DD' suffixIcon={(<img src={date}/>)} className="data-width" />
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" >搜索</Button>
        </Form.Item>
      </Form>
    )
  }
}

interface TrysFormCompoentProp extends FormComponentProps {
  detailData: any
  modalClose: Function
}

@hot(module) // 热更新（局部刷新界面）
class TrysFormCompoent extends RootComponent<TrysFormCompoentProp, any> {
  constructor (props:any) {
    super(props)
    const { detailData } = props
    this.state = {
      detailData: detailData || {},
      dataString: detailData.tryEndTime || ''
    }
  }
  UNSAFE_componentWillReceiveProps (nextProps:any) {
    this.setState({
      detailData: nextProps.detailData,
      dataString: nextProps.detailData.tryEndTime
    })
  }
  hadleSumbit = (e:any) => {
    e.preventDefault()
    const { dataString } = this.state
    const { id } = this.props.detailData
    let dataParmas = {
      tryEndTime: dataString,
      id: id
    }
    this.axios.request(this.api.tryUpdate, dataParmas).then((res:any) => {
      // 获取带数据放到数据中
      if (res.code === 200) {
        this.props.modalClose(false)
      }
    }).catch((err:any) => {
      this.error(err.msg[0])
      this.props.modalClose(false)
    })
  }
  cancelBtn = (e:any) => {
    this.props.modalClose(false)
  }
  disabledDate = (current:any) => {
    // 小于试用期开始时间进行禁用
    let { tryStartTime } = this.props.detailData
    let cur = moment(current).format('YYYY-MM-DD')
    return tryStartTime && cur <= tryStartTime
  }
  dataChange = (data:any, dataString:any) => {
    this.setState({
      dataString
    })
  }

  render () {
    let contract = this.AuthorityList.contract
    const { dataString, detailData } = this.state
    const { userInfo, typeName, tryStartTime, tryEndTime } = detailData
    return (
      <Form style={{ textAlign: 'left' }} layout="inline" {...itemLayout} onSubmit={this.hadleSumbit}>
        <Row>
          <Col span={12}>
            <Form.Item label="项目" className="cfrom-item">
              <span>{(userInfo ? userInfo.projectName : undefined) || '- - -'}</span>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="工号" className="cfrom-item">
              <span>{(userInfo ? userInfo.projectNumber : undefined) || '- - -'}</span>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label="管理编号" className="cfrom-item">
              <span>{(userInfo ? userInfo.sjNumber : undefined) || '- - -'}</span>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="姓名" className="cfrom-item">
              <span>{(userInfo ? userInfo.userName : undefined) || '- - -'}</span>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label="身份证/通行证/护照号" className="cfrom-item">
              <span>{(userInfo ? (userInfo.idCard || userInfo.passportCard) : undefined) || '- - -'}</span>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="组织" className="cfrom-item">
              <span>{(userInfo ? userInfo.organize : undefined) || '- - -'}</span>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label="法人主体" className="cfrom-item">
              <span>{(userInfo ? userInfo.entity : undefined) || '- - -'}</span>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="员工类型" className="cfrom-item">
              <span>{(userInfo ? userInfo.roleType : undefined) || '- - -'}</span>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label="合同类型" className="cfrom-item">
              <span>{typeName || '- - -'}</span>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="试用期开始时间" className="cfrom-item">
              <span>{tryStartTime || '- - -'}</span>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label="试用期结束时间" className="cfrom-item ">
              <DatePicker value={moment(dataString, 'YYYY-MM-DD')} disabledDate={this.disabledDate} allowClear={false} onChange={this.dataChange} suffixIcon={(<img src={date}/>)} />
            </Form.Item>
          </Col>
        </Row>
        <Row style={{ textAlign: 'center' }}>
          {
            this.isAuthenticated(contract[17]) &&
              <Button onClick={this.hadleSumbit} className="sumbit-btn" type="primary">确定</Button>
          }
          <Button onClick={this.cancelBtn} className="cancel-btn">取消</Button>
        </Row>
      </Form>
    )
  }
}

const WrappedFormTestCompoent = Form.create<FormProps>()(FormTestCompoent)
const WrappedTrysFormCompoent = Form.create<TrysFormCompoentProp>()(TrysFormCompoent)
interface ProbationPeriodProps {
  history?: any
  statusSelect?: any
}

@hot(module) // 热更新（局部刷新界面）
export default class ProbationPeriodPage extends RootComponent<ProbationPeriodProps, any> {
  tableItem = React.createRef<TableItem<any>>()
  constructor (props: any) {
    super(props)
    const searchData = SysUtil.getSessionStorage('ProbationPeriodPage_searchParams')
    this.state = {
      searchParams: searchData || {
        organizeArr: [],
        projectNumber: '',
        sjNumber: '',
        userName: '',
        tryEndTimeStart: '',
        tryEndTimeEnd: ''
      },
      tryVisible: false,
      detailData: {}
    }
  }
  showDetail = (record:any, e:any) => {
    e.preventDefault()
    // 请求接口，显示模态框
    this.axios.request(this.api.tryInfo, {
      id: record.id
    }).then((res:any) => {
      // 获取带数据放到数据中
      this.setState({
        detailData: res.data,
        tryVisible: true
      })
    }).catch((err:any) => {
      this.error(err.msg[0])
    })
  }
  searchData = async (data:any) => {
    await this.setState({
      searchParams: data
    })
  }
  modalClose = (data:boolean) => {
    this.setState({
      tryVisible: data
    })
    const { loadingTableData } = this.tableItem.current as TableItem<any>
    loadingTableData()
  }
  onCancel = () => {
    this.setState({
      tryVisible: false
    })
  }
  render () {
    const { searchParams, tryVisible, detailData } = this.state
    const { api, AuthorityList, isAuthenticated } = this
    const contract = AuthorityList.contract
    let tags:any = {
      title: '操作',
      key: 'tags',
      width: 80,
      fixed: 'right',
      // align: 'center',
      render: (text:string, record:any) => (
        <span>
          {
            isAuthenticated(contract[15]) &&
              <a onClick={(e) => this.showDetail(record, e)} title="用户查看" className="mgl10">查看</a>
          }
        </span>
      )
    }
    let columnData = [
      { title: '序号', dataIndex: 'index', width: 80 },
      {
        title: '项目',
        dataIndex: 'userInfo.projectName',
        width: 100,
        render: (text:string) => (<span>{text || '- - -'}</span>)
      },
      {
        title: '工号',
        dataIndex: 'userInfo.projectNumber',
        width: 120,
        render: (text:string) => (<span>{text || '- - -'}</span>)
      },
      {
        title: '管理编号',
        dataIndex: 'userInfo.sjNumber',
        width: 120,
        render: (text:string) => (<span>{text || '- - -'}</span>)
      },
      {
        title: '姓名',
        dataIndex: 'userInfo.userName',
        width: 120,
        render: (text:string) => (<span>{text || '- - -'}</span>)
      },
      {
        title: '组织',
        dataIndex: 'userInfo.organize',
        width: 300,
        render: (text:string) => (<span>{text || '- - -'}</span>)
      },
      {
        title: '身份证号码/通行证/护照号',
        dataIndex: 'userInfo.idCard',
        width: 200,
        render: (text:string, recode:any) => {
          return <span>{text || recode.userInfo.passportCard || '- - -'}</span>
        }
      },
      {
        title: '员工类型',
        dataIndex: 'userInfo.roleType',
        width: 120,
        render: (text:string) => (<span>{text || '- - -'}</span>)
      },
      {
        title: '合同类型',
        dataIndex: 'typeName',
        width: 170,
        render: (text:string) => (<span>{text || '- - -'}</span>)
      },
      {
        title: '法人主体',
        dataIndex: 'userInfo.entity',
        width: 200,
        render: (text:string) => (<span>{text || '- - -'}</span>)
      },
      {
        title: '试用期起始日期',
        dataIndex: 'tryStartTime',
        width: 140,
        sorter: (a:any, b:any) => Date.parse(a.tryStartTime.replace('-', '/').replace('-', '/')) - Date.parse(b.tryStartTime.replace('-', '/').replace('-', '/')),
        render: (text:string) => (<span>{text || '- - -'}</span>)
      },
      {
        title: '试用期终止日期',
        dataIndex: 'tryEndTime',
        width: 140,
        sorter: (a:any, b:any) => Date.parse(a.tryEndTime.replace('-', '/').replace('-', '/')) - Date.parse(b.tryEndTime.replace('-', '/').replace('-', '/')),
        render: (text:string) => (<span>{text || '- - -'}</span>)
      }
    ]
    if (isAuthenticated(contract[15])) {
      columnData.push(tags)
    }
    return (
      <div id="contract-try-box">
        <Row>
          <WrappedFormTestCompoent searchParams={searchParams} searchData={this.searchData} {...this.props} />
        </Row>
        {
          isAuthenticated(contract[16]) &&
            <Row className="row-margin">
              <Col>
                <BasicDowload action={api.tryExport}
                  parmsData={searchParams} fileName="试用期合同信息导出"
                  dowloadURL="URL"
                  className="contract-page-button" btntype="primary">
                  <Icon component={IconDc}/>导出
                </BasicDowload>
              </Col>
            </Row>
        }
        <TableItem
          ref={this.tableItem}
          mock={false}
          rowSelectionFixed
          filterKey="index"
          rowKey={({ index }) => index}
          searchParams={searchParams}
          URL={api.contractrylist}
          scroll={{ x: 1870 }}
          columns={columnData}
          bufferSearchParamsKey='ProbationPeriodPage_searchParams'
        />
        <Modal
          title="查看"
          style={{ textAlign: 'center' }}
          visible={tryVisible}
          footer={null}
          // closable={false}
          width='4.17rem'
          onCancel={this.onCancel}
          className="contract-try-modal"
          maskStyle={{ background: 'rgba(0,0,0,0.5)' }}
        >
          <WrappedTrysFormCompoent detailData={detailData} modalClose={this.modalClose} />
        </Modal>
      </div>
    )
  }
}
