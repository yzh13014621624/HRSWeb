/**
 * @author minjie
 * @class FileUtil
 * @createTime 2019/05/05
 * @description file 文件工具类
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default class FileUtil {
  /**
   * 将base64 的转回file 对象
   */
  static dataURLtoBlob = (dataurl:string) => {
    let arr:any = dataurl.split(',')
    let mime = arr[0].match(/:(.*?);/)[1]
    let suffer = mime.split('/')[1]
    let bstr = atob(arr[1])
    let n = bstr.length
    let u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    let blob = new Blob([u8arr], { type: mime })
    return new File([blob], `${new Date().getTime()}.${suffer}`, { type: mime })
  }
}
