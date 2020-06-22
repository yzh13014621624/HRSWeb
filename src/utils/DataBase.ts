/*
 * @description: indexedDB 管理
 * @author: minjie
 * @createTime: 2019/5/7
 * @copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
export default class DataBase {
  static openData (callback:Function) {
    let db:any
    let openRequest:any = indexedDB.open('test', 1)
    openRequest.onupgradeneeded = (e:any) => { // 数据库升级
      db = e.target.result
      let objectStore
      if (!db.objectStoreNames.contains('locadb')) {
        objectStore = db.createObjectStore('locadb', { keyPath: 'key' })
        objectStore.createIndex('value', 'value', { unique: false })
      }
      callback(db)
    }
    openRequest.onsuccess = (e:any) => {
      db = openRequest.result
      callback(db)
    }
    openRequest.onerror = (e:any) => {
      console.log('本地数据库打开失败')
    }
  }

  static closeData (db:any) {
    db.close()
  }

  static add (key:any, val:any) {
    DataBase.openData((db:any) => {
      let objectStore = db.transaction(['locadb'], 'readwrite')
        .objectStore('locadb').put({ key: key, value: val })
      objectStore.onsuccess = function (event:any) {
        DataBase.closeData(db)
      }
      objectStore.onerror = function (event:any) {
        DataBase.closeData(db)
      }
    })
  }

  static delete (key:any) {
    DataBase.openData((db:any) => {
      let objectStore = db.transaction(['locadb'], 'readwrite')
        .objectStore('locadb').delete(key)
      objectStore.onsuccess = function (event:any) {
        DataBase.closeData(db)
      }
      objectStore.onerror = function (event:any) {
        DataBase.closeData(db)
      }
    })
  }

  /**
   * 读取数据
   * @param key  key 值
   * @param callback 回调方法
   */
  static read (key:any, callback:Function) {
    DataBase.openData((db:any) => {
      let request = db.transaction(['locadb']).objectStore('locadb').get(key)
      request.onerror = (event:any) => {
        DataBase.closeData(db)
      }
      request.onsuccess = (event:any) => {
        if (request.result) {
          callback(request.result.value)
        } else {
          console.log('未获得数据记录')
        }
        DataBase.closeData(db)
      }
    })
  }
}
