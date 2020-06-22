/*
 * @description: 权限配置主页面
 * @author: qiuyang
 * @lastEditors: qiuyang
 * @Date: 2020-05-08 15:50:07
 * @LastEditTime: 2020-06-12 11:14:26
 * @Copyright: Copyright  2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { FormComponentProps } from 'antd/lib/form'
import { RootComponent, TableItem, BasicDowload, BasicModal } from '@components/index'
import { Button, Form, Row, Input, Tabs, Modal, Col, Checkbox, Radio, Spin } from 'antd'
import { IconAddbtn, IconJbtn, IconTj } from '@components/icon/BasicIcon'
import { BaseProps, KeyValue } from 'typings/global'
import { BaseCommonModal } from '@shared/modal/Modal'
import SharedStructure from '../components/SharedStructure'
import { HttpUtil, JudgeUtil } from '@utils/index'
import moment from 'moment'
import './index.styl'

const { TabPane } = Tabs
const { Item } = Form

interface State {
  authType: number
  dataList: KeyValue
  moduleList: KeyValue[]
  entityList: KeyValue[]
  organizeList: KeyValue[]
  organizeArr: KeyValue[]
  disabled: boolean
  loading: boolean
}

interface AuthConfigProps extends BaseProps, FormComponentProps {}

class AuthConfig extends RootComponent<AuthConfigProps, State> {
  necessary: KeyValue = HttpUtil.parseUrl(this.props.location.search)
  constructor (props: AuthConfigProps) {
    super(props)
    this.state = {
      authType: 1, // 数据权限类型（1：组织，2：法人主体
      dataList: {}, //  数据权限详情存储
      moduleList: [], // 模块权限详情存储
      entityList: [], // 法人主体存储
      organizeList: [], // 组织选项存储
      organizeArr: [], // 组织回显数据
      disabled: true,
      loading: true
    }
  }

  componentDidMount = async () => {
    const {
      props: { match: { params: { arid } } },
      necessary: { arId, roleName },
      axios: { request },
      api: { SystemGetAuthCode, SystemGetAuthDetails }
    } = this
    let datas: any = {}
    if (typeof arid === 'undefined') {
      const { data } = await request(SystemGetAuthCode)
      datas = data
    } else {
      const { data } = await request(SystemGetAuthDetails, { arId, roleName })
      datas = data
    }
    let { moduleList, entityList, organizeList, authType } = datas
    // entityList.children = this.recursion(entityList.children)
    const newOrganize = this.recursionAuth(organizeList.children, 'authID', [])
    this.setState({
      moduleList: this.recursion(moduleList),
      entityList: this.entityCheckedBol(this.recursion(entityList)),
      authType: authType || 1,
      organizeList: organizeList.children,
      organizeArr: newOrganize || [],
      disabled: arid === 'undefined',
      loading: false
    })
  }

  // 初始化checked
  recursion = (data: KeyValue[]) => {
    data.map((v: any, i: any) => {
      if (typeof v.checked === 'undefined' || !v.checked) {
        v.checked = false
      }
      if (!JudgeUtil.isEmpty(v.children)) {
        this.recursion(v.children)
      }
    })
    return data
  }

  // 递归置更改子级check
  recursionChildren = (data: KeyValue[], checked: boolean) => {
    data.map((value: any, index: any) => {
      value.checked = checked
      if (value.children) {
        this.recursionChildren(value.children, checked)
      }
    })
    return data
  }

  // 递归返回所有选中子级的id(data：原数据数组，auth：所需要的数组中的id，idArr返回id数组)
  recursionAuth = (data: KeyValue[], auth: string, idArr: KeyValue[], fatherId?: string, fatherIdArr?: KeyValue[]) => {
    data.map((item: any, i: number) => {
      if (item.checked) {
        idArr.push(item[auth])
        if (fatherIdArr) {
          typeof item[fatherId || 'projectId'] === 'number' && fatherIdArr.push(item[fatherId || 'projectId'])
        }
      }
      if (item.children) {
        this.recursionAuth(item.children, auth, idArr, fatherId, fatherIdArr)
      }
    })
    return idArr
  }

  // 一级check
  titleChange = (i: any, e: any) => {
    let { moduleList } = this.state
    let tabTitleArr = []
    for (let j = 0; j < moduleList[i].children.length; j++) {
      tabTitleArr.push(e.target.checked)
      let childLength = moduleList[i].children[j].children.length
      let child = []
      for (let k = 0; k < childLength; k++) {
        child.push(e.target.checked)
      }
      this.props.form.setFieldsValue({
        [`children${i}${j}`]: child
      })
    }
    this.props.form.setFieldsValue({
      [`tabTitle${i}`]: tabTitleArr
    })
    const list = this.recursionChildren([moduleList[i]], e.target.checked)
    moduleList[i] = list[0]
    this.isGreyBtn()
    this.setState({
      moduleList
    })
  }

  // 三级check
  checkboxChange = (i: any, ix: any, index: any, e: any) => {
    let { moduleList } = this.state
    moduleList[i].children[ix].children[index].checked = e.target.checked
    this.setState({
      moduleList
    })
  }

  // 二级check
  tabTitleChange = (i: any, ix: any, e: any) => {
    let { moduleList } = this.state
    let list = this.recursionChildren([moduleList[i].children[ix]], e.target.checked)
    moduleList[i].children[ix] = list[0]
    let childrenArr = []
    const childLength: number = moduleList[i].children[ix].children.length
    for (let i = 0; i < childLength; i++) {
      childrenArr.push(e.target.checked)
    }
    this.props.form.setFieldsValue({
      [`children${i}${ix}`]: childrenArr
    })
    this.isGreyBtn()
    this.setState({
      moduleList
    })
  }

  // 判断按钮是否置灰
  isGreyBtn = () => {
    const { state: { moduleList, authType, entityList }, props: { form: { getFieldsValue } } } = this
    const { organizeArr }: any = getFieldsValue()
    let moduleCode = this.recursionAuth(moduleList, 'authID', [])
    let dataCode = authType === 1 ? organizeArr : this.recursionAuth(entityList, 'authID', [])
    this.setState({
      disabled: moduleCode.length === 0 || dataCode.length === 0
    })
  }

  organizeArrChange = (i: number, ix: number, e: any) => {
    let { entityList } = this.state
    entityList[i].children[ix].checked = e.target.checked
    let checkedTitle = true
    entityList[i].children.map((v: any) => {
      if (!v.checked) checkedTitle = v.checked
    })
    entityList[i].checked = checkedTitle
    this.props.form.setFieldsValue({
      [`entityListTabTitle${i}`]: checkedTitle
    })
    this.setState({
      entityList
    }, () => {
      this.isGreyBtn()
    })
  }

  entityCheckedBol = (entityList: any) => {
    entityList.map((v: any) => {
      let entityChecked = true
      if (!JudgeUtil.isEmpty(v.children)) {
        v.children.map((vl: any) => {
          if (!vl.checked) {
            entityChecked = vl.checked
          }
        })
      }
      v.checked = entityChecked
    })
    return entityList
  }

  radioChange = (e: any) => {
    let { entityList } = this.state
    this.setState({
      authType: e.target.value,
      entityList
    }, () => {
      this.isGreyBtn()
    })
  }

  // 判断子级是否选中，返回选中的子级id数组
  isChildren = (data: KeyValue[], organizeArr: any, bol: any[]) => {
    for (let i = 0; i < data.length; i++) {
      // 判断元素是否选中
      if (organizeArr.indexOf(data[i].authID) > -1) {
        bol.push(data[i].authID)
      }
      if (data[i].children) {
        this.isChildren(data[i].children, organizeArr, bol)
      }
    }
    return bol
  }

  // 提交按钮
  confirm = async () => {
    const {
      api: { SystemGrantPerms, GetProject },
      axios: { request },
      props: { form: { getFieldsValue }, history: { push } },
      state: { moduleList, authType, entityList, organizeList },
      $message: { success, warn },
      necessary: { arId } } = this
    const { organizeArr }: any = getFieldsValue()
    this.setState({
      loading: true
    })
    let projectAuthList: any = []
    let entityDataCode: KeyValue[] = []
    let isAuthCheck = false
    moduleList.map((v: any) => {
      if (v.authName === '系统管理' && v.checked) {
        moduleList.map((vx: any) => {
          if (vx.authName === '权限管理' && !vx.checked) {
            isAuthCheck = true
          }
        })
      }
    })
    if (isAuthCheck) {
      this.setState({
        loading: false
      })
      warn('分配系统管理相关权限必须全选权限管理的权限！')
      return
    }
    let moduleCode = this.recursionAuth(moduleList, 'authID', [])
    let dataCode = authType === 1 ? organizeArr : this.recursionAuth(entityList, 'authID', [], 'projectId', projectAuthList)
    // set去重
    projectAuthList = Array.from(new Set(projectAuthList))
    // authType === 1 按组织 2 按法人主体
    if (authType === 1) {
      const { code, data } = await request(GetProject)
      // 返回项目id
      data.map((v: any) => {
        // 遍历组织原数组
        organizeList.map((vx: any, i: number) => {
          // 判断元素组一级元素是否选中
          if (this.isChildren([organizeList[i]], organizeArr, []).length > 0) {
            if (Number(vx.authCode) === v.zoId) {
              projectAuthList.push(v.projectId)
            }
          }
        })
      })
    } else {
      projectAuthList.map((v: any) => {
        entityList.map((vx: any) => {
          if (vx.children[0].projectId === v) {
            let obj: any = {}
            obj[v] = this.recursionAuth(vx.children, 'authID', [])
            entityDataCode.push(obj)
          }
        })
      })
    }
    let param = {
      moduleCode,
      authType,
      dataCode,
      arId,
      projectAuthList,
      entityDataCode: authType !== 1 ? entityDataCode : undefined
    }
    request(SystemGrantPerms, param).then(({ code }) => {
      push('/home/roleManagement')
    }).catch((error) => {
      if (error) {
        this.setState({
          loading: false
        })
      }
    })
  }

  treeSelectChange = (selDate: any) => {
    this.setState({
      organizeArr: selDate
    }, () => {
      this.isGreyBtn()
    })
  }

  entityListTabTitle = (i: number, e: any) => {
    let { entityList } = this.state
    let checkedArr: any = []
    entityList[i].checked = e.target.checked
    entityList[i].children.map((v: any) => {
      v.checked = e.target.checked
      checkedArr.push(e.target.checked)
    })
    this.props.form.setFieldsValue({
      [`entityList${i}`]: checkedArr
    })
    this.setState({
      entityList
    }, () => {
      this.isGreyBtn()
    })
  }

  render () {
    const {
      props: { form: { getFieldDecorator }, match: { params: { arid } } },
      state: { moduleList, entityList, authType, organizeList, organizeArr, disabled, loading }
    } = this
    return (
      <div id='authConfig'>
        <Spin spinning={loading} tip="Loading...">
          <Form>
            <div className='headerTitle'>权限配置</div>
            <p className='title'>模块权限</p>
            {
              moduleList.length > 0 && moduleList.map((v, i) => {
                return (
                  <div className='tableDiv' key={i}>
                    <Row className='tableTitleRow'>
                      <Item>
                        { getFieldDecorator(`title[${i}]`, {
                          initialValue: v.checked,
                          valuePropName: 'checked'
                        })(<Checkbox value={v.authID} onChange={(e) => this.titleChange(i, e)}>{v.authName}</Checkbox>)}
                      </Item>
                    </Row>
                    <div className='tabsDiv'>
                      <Tabs type="card">
                        {
                          v.children.map((el: any, ix: any) => {
                            return (
                              <TabPane tab={
                                <Item style={{ height: '40px' }}>
                                  { getFieldDecorator(`tabTitle${i}[${ix}]`, {
                                    initialValue: el.checked,
                                    valuePropName: 'checked'
                                  })(<Checkbox value={el.authID} disabled={!v.checked} onChange={(e) => this.tabTitleChange(i, ix, e)}></Checkbox>)}
                                  <span style={{ marginLeft: '5px' }}>{el.authName}</span>
                                </Item>} key={1000 + ix}>
                                <div className='tabPaneDiv'>
                                  {
                                    el.children.map((value: any, index: any) => {
                                      return (
                                        <Row className='childrenRow' key={10000 + index}>
                                          <Item>
                                            { getFieldDecorator(`children${i}${ix}[${index}]`, {
                                              initialValue: value.checked,
                                              valuePropName: 'checked'
                                            })(<Checkbox value={value.authID} disabled={!el.checked} onChange={(e) => this.checkboxChange(i, ix, index, e)}>{value.authName}</Checkbox>)}
                                          </Item>
                                        </Row>
                                      )
                                    })
                                  }
                                </div>
                              </TabPane>
                            )
                          })
                        }
                      </Tabs>
                    </div>
                  </div>
                )
              })
            }
            <p className='title'>数据权限</p>
            <div className='tableDiv' style={{ padding: '30px' }}>
              <Row className='radioRow'>
                <Item>
                  { getFieldDecorator('authType', {
                    initialValue: authType || 1
                    // valuePropName: 'checked'
                  })(
                    <Radio.Group name="radiogroup" onChange={(e) => this.radioChange(e)}>
                      <Radio value={1} style={{ marginRight: '150px' }}>按组织</Radio>
                      <Radio value={2}>按法人主体</Radio>
                    </Radio.Group>
                  )}
                </Item>
              </Row>
              {
                authType !== 2
                  ? <Row>
                    <Item className="contract-com-margin-r">
                      {getFieldDecorator('organizeArr', {
                        initialValue: organizeArr
                      })(<SharedStructure defaultTree={organizeList} onChange={this.treeSelectChange}/>)}
                    </Item>
                  </Row>
                  : <div>
                    <Tabs type="card">
                      {
                        entityList.map((va: any, inx: any) => {
                          return (
                            <TabPane tab={<Item style={{ height: '40px' }}>
                              { getFieldDecorator(`entityListTabTitle${inx}`, {
                                initialValue: va.checked,
                                valuePropName: 'checked'
                              })(<Checkbox onChange={(e) => this.entityListTabTitle(inx, e)}></Checkbox>)}
                              <span style={{ marginLeft: '5px' }}>{va.authName}</span>
                            </Item>} key={inx + 100}>
                              {
                                va.children.map((vx: any, ixa: any) => {
                                  return (
                                    <Row className='childrenRow' key={ixa + 1000}>
                                      <Item>
                                        { getFieldDecorator(`entityList${inx}[${ixa}]`, {
                                          initialValue: vx.checked,
                                          valuePropName: 'checked'
                                        })(<Checkbox onChange={(e) => this.organizeArrChange(inx, ixa, e)}>{vx.authName}</Checkbox>)}
                                      </Item>
                                    </Row>
                                  )
                                })
                              }
                            </TabPane>
                          )
                        })
                      }
                    </Tabs>
                  </div>
              }
            </div>
            <div className='authBtn'>
              <Button type='primary' onClick={this.confirm} disabled={disabled}>{typeof arid === 'undefined' ? '确定' : '保存'}</Button>
              <Button onClick={() => this.props.history.push('/home/roleManagement')}>取消</Button>
            </div>
          </Form>
        </Spin>
      </div>
    )
  }
}
const RoleManagements = Form.create<AuthConfigProps>()(AuthConfig)
export default RoleManagements
