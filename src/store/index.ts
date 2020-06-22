/**
 * @author minjie
 * @createTime 2019/03/28
 * @description 将 mobx 导出
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

const files = (require as any).context('./moudle', false, /\.ts$/)
const modules:any = {}

files.keys().forEach((key:any, i:number) => {
  if (key === './index.ts') return
  modules[(key.replace(/(\.\/|\.ts)/g, ''))] = files(key).default
})

export default modules
