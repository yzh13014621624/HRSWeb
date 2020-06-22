/**
 * @author minjie
 * @createTime 2019/10/24
 * @description 链接到教学视频
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import RootComponent from '@components/root/RootComponent'
import './index.styl'

const linkAry = [
  {
    title: '连接扫描仪',
    key: 'scaner_connect',
    url: 'https://hrs.sj56.com.cn/videos/scaner_connect.mp4'
  },
  {
    title: '扫描合同',
    key: 'scan_contract',
    url: 'https://hrs.sj56.com.cn/videos/scan_contract.mp4'
  },
  {
    title: '上传合同',
    key: 'upload_contract',
    url: 'https://hrs.sj56.com.cn/videos/upload_contract.mp4'
  }
]

interface LinkVideoProps {
  color?: 'cus-version-color' | 'cus-version-color-b'
}

interface LinkVideoState {
}

export default class LinkVideo extends RootComponent<LinkVideoProps, LinkVideoState> {
  static defaultProps = {
    color: 'cus-version-color'
  }
  constructor (props:LinkVideoProps) {
    super(props)
  }

  /** 链接到视频的地址 */
  linkVideo = () => {
    const win = window as any
    if (win.previewWindow) {
      win.previewWindow.close()
    }
    win.previewWindow = window.open()
    win.previewWindow.document.write(this.buildPreviewHtml(linkAry))
    win.previewWindow.document.close()
  }

  buildPreviewHtml (linkAry:any[]) {
    let li = ''
    linkAry.forEach((el:any) => {
      li += `<li><h3><a href="#${el.key}">${el.title}</a></h3></li>`
    })
    let video = ''
    linkAry.forEach((el:any) => {
      video += `<div class="video-content" id="${el.key}">
        <h2>${el.title}</h2>
        <video src="${el.url}" controls="controls" height='100%'>
          您的浏览器不支持 video 标签。
        </video>
      </div>`
    })
    return `
    <!Doctype html>
    <html>
      <head>
        <title>友情链接: 合同扫描及上传教程</title>
        <style>
          html,body{
            height: 100%;
            margin: 0;
            padding: 0;
            overflow: auto;
            background-color: #fff;
          }
          .container{
            box-sizing: border-box;
            max-width: 100%;
            height: 100%;
            margin: 0 auto;
            overflow: hidden;
            background-color: #fff;
            text-align: center;
          }
          .left {
            float: left;
            width: 15%;
            height: 100%;
            box-sizing: border-box;
            border-right: 1px solid #F0F0F0;
          }
          .left ul li {
            list-style: none;
            text-align: center;
          }
          .left ul li a {
            text-decoration: none;
            color: black;
          }
          .right {
            float: left;
            width: 85%;
            height: 100%;
            overflow-y: scroll;
            box-sizing: border-box;
          }
          .right .video-content {
            height: 100%;
          }
          .right .video-content h2 {
            margin: 0 0 20px;
            padding-top: 20px;
          }
          .right .video-content video {
            max-width: 80%;
            height: 80%;
            margin: 0px auto 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class='left'>
            <ul>${li}</ul>
          </div>
          <div class='right'>${video}</div>
        </div>
      </body>
    </html>
    `
  }

  render () {
    const { color } = this.props
    return (
      <div id='linkvideo-container' onClick={this.linkVideo}>
        <span className='cus-version-color'>友情链接: 合同扫描及上传教程 </span>
      </div>
    )
  }
}
