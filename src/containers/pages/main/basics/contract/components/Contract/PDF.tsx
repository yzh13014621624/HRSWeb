/*
 * @description: 合同 PDF 组件
 * @author: qiuyang
 * @lastEditors: qiuyang
 * @Date: 2020-03-23 13:31:58
 * @LastEditTime: 2020-04-07 11:25:17
 * @Copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, BaseUpload } from '@components/index'
import { Button, Card } from 'antd'
import { OSSUtil } from '@utils/index'

import './contract.styl'

const btnText = '上传合同(PDF文件)'

interface ImgItem {
  uid: number
  url: string
  tempUrl: string
  file?: File
}

interface BaseProps {
  value?: ImgItem[]
  onChange?: (v: ImgItem[]) => void
  customeUpload?: (...arg: any) => Promise<{ url: string, tempUrl: string }>
}

interface BaseState {
  txt: string
  picList: ImgItem[]
}

export default class extends RootComponent<BaseProps, BaseState> {
  static getDerivedStateFromProps (props: BaseProps) {
    const { value } = props
    if (value) return { picList: [...value], txt: value.length ? '重新上传' : btnText }
    return null
  }

  state = {
    txt: btnText,
    picList: []
  }

  getUploadedPics = (picList: ImgItem[]) => {
    const { onChange } = this.props
    onChange && onChange(picList)
    if (picList.length) this.setState({ txt: '重新上传', picList })
    else this.setState({ txt: btnText, picList })
  }

  // 定制处理合同 pdf 文件上传函数
  customHandleContractPdf = async (file: File) => {
    const { insertOssPdfUpload } = this.api
    const { name } = await OSSUtil.multipartUpload(file, 'contract/pdf', '合同下载')
    const { data } = await this.axios.request(insertOssPdfUpload, { url: name })
    return {
      url: data,
      tempUrl: name
    }
  }

  render () {
    const {
      getUploadedPics,
      customHandleContractPdf,
      state: { txt, picList }
    } = this
    return (
      <div className="upload_contract_wrapper">
        <Card title="合同-PDF文件">
          <BaseUpload accept="application/pdf" value={picList} fileSize={20} maxlength={1} onChange={getUploadedPics} customeUpload={customHandleContractPdf}>
            <Button icon="upload" className="upload_btn">{txt}</Button>
            <span className="upload_tips">（PDF文件大小不超过20M）</span>
          </BaseUpload>
        </Card>
      </div>
    )
  }
}
