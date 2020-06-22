/**
 * @author minjie
 * @createTime 2019/04/07
 * @description 参保城市
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent, FileUpload, BasicDowload } from '@components/index'
import { hot } from 'react-hot-loader'
import { Button, Icon, Row, Col } from 'antd'
import { Link } from 'react-router-dom'

import { IconSc, IconDc, IconDr, IconXz, IconTj } from '@components/icon/BasicIcon'

import { BaseProps } from 'typings/global'
interface SearchItemPageProps extends BaseProps {
  removeFun: Function
  searchParams: any // 条件查询的参数
  apiObj:any // 下载导出的api
  addPath?:string
  type?:string
}

@hot(module)
export default class SearchItemPage extends RootComponent<SearchItemPageProps, any> {
  constructor (props:any) {
    super(props)
  }
  render () {
    const { addPath, removeFun, apiObj, searchParams, type } = this.props
    const { importApi, exportApi, exportTemplte, fileName, fileNameTemplte } = apiObj
    let toPath = {
      pathname: addPath,
      search: ''
    }
    const { AuthorityList, isAuthenticated } = this
    return (
      <Row style={{ marginTop: 10, marginBottom: 20 }}>
        <Col>
          {isAuthenticated(AuthorityList.parameters[type === 'city' ? 10 : 2]) && <Button type="primary">
            <Link to={toPath}><Icon component={IconTj}/>
              <span style={{ margin: '0 0.02rem', letterSpacing: 0 }}>新增</span>
            </Link>
          </Button>}
          {isAuthenticated(AuthorityList.parameters[type === 'city' ? 13 : 5]) && <Button className="custom-page-btn" type="primary" onClick={() => removeFun(1)}>
            <Icon component={IconSc}/>批量删除
          </Button>}
          {isAuthenticated(AuthorityList.parameters[type === 'city' ? 14 : 6]) && <FileUpload action={importApi.path}>
            <Button className="custom-page-btn" type="primary">
              <Icon component={IconDr}/>导入
            </Button>
          </FileUpload> }
          {isAuthenticated(AuthorityList.parameters[type === 'city' ? 15 : 7]) && <BasicDowload action={exportApi}
            parmsData={searchParams} fileName={fileName} dowloadURL='URL'
            className="custom-page-btn" btntype="primary">
            <Icon component={IconDc}/>导出
          </BasicDowload> }
          {isAuthenticated(AuthorityList.parameters[type === 'city' ? 16 : 8]) && <BasicDowload action={exportTemplte}
            parmsData={{ type: '.xlsx' }} fileName={fileNameTemplte}
            className="custom-page-btn" btntype="primary">
            <Icon component={IconXz}/>下载导入模版
          </BasicDowload>}
        </Col>
      </Row>
    )
  }
}
