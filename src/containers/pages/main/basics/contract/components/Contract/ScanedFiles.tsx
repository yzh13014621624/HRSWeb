/*
 * @description: 合同扫描件组件
 * @author: qiuyang
 * @lastEditors: qiuyang
 * @Date: 2020-03-23 13:31:11
 * @LastEditTime: 2020-04-03 10:46:48
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, BaseUpload } from '@components/index'
import { Button, Card } from 'antd'

import './contract.styl'

const btnText = '上传合同扫描件'

interface ImgItem {
  uid: number
  url: string
  tempUrl: string
  file?: File
}

interface BaseProps {
  value?: ImgItem[]
  onChange?: (v: ImgItem[]) => void
}

interface BaseState {
  txt: string
  picList: ImgItem[]
}

export default class extends RootComponent<BaseProps, BaseState> {
  static getDerivedStateFromProps (props: BaseProps) {
    const { value } = props
    if (value) return { picList: [...value], txt: value.length ? '继续上传' : btnText }
    return null
  }

  state = {
    txt: btnText,
    picList: []
  }

  getUploadedPics = (picList: ImgItem[]) => {
    const { onChange } = this.props
    onChange && onChange(picList)
    if (picList.length) this.setState({ txt: '继续上传' })
    else this.setState({ txt: btnText })
  }

  render () {
    const {
      getUploadedPics,
      state: { txt, picList }
    } = this
    return (
      <div className="upload_contract_wrapper">
        <Card title="合同-扫描件（jpg/png）">
          <BaseUpload multiple value={picList} fileSize={20} onChange={getUploadedPics}>
            <Button icon="upload" className="upload_btn">{txt}</Button>
            <span className="upload_tips">（按住ctrl键可多选，建议尺寸为580*820PX,大小不超过20M）</span>
          </BaseUpload>
        </Card>
      </div>
    )
  }
}
