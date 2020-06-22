/*
 * @description: 操作表格的基本功能按钮：新增、删除、导入、导出、下载模板
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-04-10 18:00:34
 * @LastEditTime: 2019-05-07 16:26:30
 * @copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, FileUpload, BasicDowload } from '@components/index'
import { Button, Row, Col, Icon } from 'antd'

import { IconTj, IconSc, IconDr, IconDc, IconXz } from '@components/icon/BasicIcon'

import { KeyValue } from 'typings/global'

interface OperateProps {
  add?: boolean // 新增
  del?: boolean // 删除
  im?: boolean // 导入
  ex?: boolean // 导出
  download?: boolean // 下载
  importAction?: KeyValue // 导入路径
  exportAction?: KeyValue // 导出路径
  exportParams?: KeyValue // 导出数据
  exportFileName?: string // 导出文件名称
  downloadAction?: KeyValue // 下载模板路径
  downloadFileName?: string // 下载文件名称
  submit?: (t: number) => void
}

export default class TableOperateComponent extends RootComponent<OperateProps> {
  render () {
    const [, adds, , , dels, ims, exs, dls] = this.AuthorityList.companyInsured
    const {
      add, del, im, ex, download,
      importAction,
      exportAction, exportParams, exportFileName,
      downloadAction, downloadFileName,
      submit
    } = this.props
    const isShowAll = !(add || del || im || ex || download)
    return (
      <div className="table_button_wrapper" style={{ paddingTop: 0 }}>
        <Row>
          <Col>
            {
              this.isAuthenticated(adds) &&
              (add || isShowAll) &&
              <Button type="primary" onClick={() => (submit as Function)(1)}>
                <Icon component={IconTj} />新增
              </Button>
            }
            {/* {
              this.isAuthenticated(dels) &&
              (del || isShowAll) &&
              <Button className="custom-page-btn" type="primary" onClick={() => (submit as Function)(2)}>
                <Icon component={IconSc} />批量删除
              </Button>
            } */}
            {
              this.isAuthenticated(ims) &&
              (im || isShowAll) &&
              <FileUpload action={(importAction as KeyValue).path}>
                <Button className="custom-page-btn" type="primary">
                  <Icon component={IconDr} />导入
                </Button>
              </FileUpload>
            }
            {
              this.isAuthenticated(exs) &&
              (ex || isShowAll) &&
              <BasicDowload
                fileName={exportFileName}
                className="custom-page-btn"
                btntype="primary"
                dowloadURL='URL'
                action={exportAction}
                parmsData={exportParams}>
                <Icon component={IconDc} />导出
              </BasicDowload>
            }
            {
              this.isAuthenticated(dls) &&
              (download || isShowAll) &&
              <BasicDowload
                fileName={downloadFileName}
                className="custom-page-btn"
                btntype="primary"
                action={downloadAction}
                parmsData={{ type: '.xlsx' }}>
                <Icon component={IconXz} />下载导入模版
              </BasicDowload>
            }
          </Col>
        </Row>
      </div>
    )
  }
}
