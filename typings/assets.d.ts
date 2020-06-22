/**
 * @author minjie
 * @createTime 2019/03/22
 * @description typescipt 资源文件的加载 ts
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

declare module '*.less' {
  const content: any
  export = content
}

declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'

// @types/ 中的文件的信息 自定义可一个分装组件 时使用
declare module 'rc-upload'

declare module 'react-pdf'
