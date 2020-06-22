/**
 * @author maqian
 * @createTime 2019/04/02
 * @description 路由的， 面包屑展示
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import { observable, action } from 'mobx'

export class BreadcrumbRouter {
  @observable.struct
  breadcrumbAry: any[] = []

  @observable.struct
  selectedKeys: string[] = []

  @action
  setBreadcrumbAry = (list: any[]) => {
    this.breadcrumbAry = list
  }

  @action
  setSelectedKeys = (path: string) => {
    this.selectedKeys = [path]
  }
}

export default new BreadcrumbRouter()
