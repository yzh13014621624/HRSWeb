/**
 * @description 对应的搜索的组件
 * @author minjie
 * @createTime 2019/05/14
 * @editTime 2020/01/15
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from '@components/index'
import { Form, Input, Select, Button } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import SharedStructure from '@shared/structure/SharedStructure'

interface SearchItemProps extends FormComponentProps {
  serachParam: any
  setSerachParam: (serachParam:any) => void
}

interface SearchItemState {
  numberType: string
}

class SearchItem extends RootComponent<SearchItemProps, SearchItemState> {
  constructor (props:SearchItemProps) {
    super(props)
    const { numberType } = this.props.serachParam
    this.state = {
      numberType: numberType || '管理编号'
    }
  }

  componentDidMount () {
  }

  onChange = (numberType:string) => {
    this.setState({ numberType })
  }

  setSerachParam = () => {
    const { setSerachParam, form: { getFieldsValue } } = this.props
    const { numberType } = this.state
    let values = getFieldsValue()
    const { organizeArr } = values
    // 搜索优化，当组织为全选的时候，则传递项目 编号
    values['projectIdList'] = []
    values.numberType = numberType
    if (organizeArr.includes('上嘉集团')) values.projectIdList.push(1)
    if (organizeArr.includes('盒马')) values.projectIdList.push(2)
    if (organizeArr.includes('物美')) values.projectIdList.push(3)
    if (setSerachParam) setSerachParam(values)
  }

  render () {
    const { form: { getFieldDecorator }, serachParam: { projectNumber, sjNumber, userName, organizeArr } } = this.props
    let { numberType } = this.state
    return (
      <Form layout="inline">
        <Form.Item>
          <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} defaultValue={numberType} style={{ width: '0.625rem' }} onChange={this.onChange} placeholder="请选择工号">
            <Select.Option value="管理编号">管理编号</Select.Option>
            <Select.Option value="工号">工号</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          {numberType === '管理编号' ? getFieldDecorator('sjNumber', {
            initialValue: sjNumber
          })(
            <Input style={{ width: '1.145rem' }} allowClear placeholder='请输入管理编号' />
          ) : getFieldDecorator('projectNumber', {
            initialValue: projectNumber
          })(
            <Input style={{ width: '1.145rem' }} allowClear placeholder='请输入工号' />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('userName', {
            initialValue: userName
          })(
            <Input style={{ width: '1.145rem' }} allowClear placeholder="请输入姓名" />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('organizeArr', {
            initialValue: organizeArr || []
          })(<SharedStructure type="string" multiple/>)}
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={this.setSerachParam}>搜索</Button>
        </Form.Item>
      </Form>
    )
  }
}

export default Form.create<SearchItemProps>()(SearchItem)
