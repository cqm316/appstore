/*
 * @Author: chenqiaomin
 * @Date: 2024-09-25 01:13:04
 * @LastEditors: chenqiaomin@bxqqedu.com chenqiaomin@bxqqedu.com
 * @LastEditTime: 2024-09-27 18:04:47
 * @FilePath: appstore\src\utils\index.ts
 * @Description: 公共方法
 */

import { resultData } from '@/types'
import { addData, getAllData, deleteData, deleteAllData } from './db';
import { showConfirmDialog, showToast } from "vant";

interface ExtendedWindow extends Window {
  deferredPrompt?: any;
  mozIndexedDB?: IDBFactory;
  webkitIndexedDB?: IDBFactory;
  msIndexedDB?: IDBFactory;
}

declare const window: ExtendedWindow;

/**
 * 判断浏览器是否支持indexedDB
 */

export const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

/**
 * 判断LocalStorage是否可用
 */
function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * LocalStorage 结合 indexedDB 实现 数据缓存
 */
class Storage {
  private storage: Storage | Record<string, any>;

  constructor() {
    if (isLocalStorageAvailable() && !indexedDB) {
      this.storage = localStorage;
    } else {
      this.storage = {};
    }
  }

  setItem(key: string, value: string | object | Array<any>): void {
    if (indexedDB) {
      addData(key, value)
    } else {
      value = typeof value === 'object' ? JSON.stringify(value) : value;
      this.storage.setItem ? this.storage.setItem(key, value) : (this.storage[key] = value);
    }
  }

  async getItem(key: string): Promise<any> {
    if (indexedDB) {
      const dataDB = await getAllData(key);
      return dataDB?.value || null;
    } else {
      const data = this.storage.getItem ? this.storage.getItem(key) : this.storage[key] || null;
      return JSON.parse(data);
    }
  }

  async removeItem(key: string): Promise<void> {
    if (indexedDB) {
      const dataDB = await getAllData(key);
      const id = dataDB?.id;
      deleteData(id);
    } else {
      this.storage.removeItem ? this.storage.removeItem(key) : delete this.storage[key];
    }
  }

  async clear(): Promise<void> {
    if (indexedDB) {
      await deleteAllData();
    } else {
      this.storage.clear ? this.storage.clear() : (this.storage = {});
    }
  }
}

export const storage = new Storage();


/**
 * 对列表数据进行数据类型转换
 */
export function convertDataTypes(arr: Array<any>, otherArr?: Array<any>): Array<any> {

  if (!Array.isArray(arr) || arr.length === 0) {
    return [];
  }
  const newArr: resultData[] = [];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    let rate = 0;
    let commentsNum = 0;
    const id = item.id?.attributes['im:id'];
    const name = item['im:name']?.label;
    const category = item.category?.attributes?.label;
    const description = `${item.title?.label};${item.summary?.label}`
    if (otherArr && Array.isArray(otherArr) && otherArr.length > 0) {
      const otherItem = otherArr.find(e => e.trackId.toString() === id);
      if (otherItem) {
        rate = otherItem.averageUserRating;
        commentsNum = otherItem.userRatingCount.toString(); // 避免数据太大页面展示出错，JS原生问题大数据Number类型会进行换算，这里转成字符串
      }
    }

    const imageUrl = item['im:image'][2]?.label;
    const detailUrl = item.id?.label;
    const newItem: resultData = { id, name, category, rate, commentsNum, imageUrl, detailUrl, description };
    newArr.push(newItem);
  }
  return newArr;
}

/**
 * 获取接口前缀
 */
export function getAPI(code = 'api') {
  const host: string = import.meta.env.PROD ? import.meta.env.VITE_APP_API_HOST : location.host;
  const origin = `${location.protocol}//${host}`;
  const basePath = import.meta.env.PROD ? `/${import.meta.env.VITE_APP_SUB_DOMAIN}` : '/dev-api';
  const api = `${origin}${basePath}`; // 基础接口

  switch (code) {
    case 'host':
      return host;
    case 'origin':
      return origin;
    default:
      return api;
  }
}

/**
 *  判断是否是偶数
 */
export function isEven(number) {
  return number % 2 === 0;
}

/**
 * pwa 实现
 */
export function pwaInit() {
  setTimeout(() => {
    if (window.deferredPrompt) {
      try {
        showConfirmDialog({
          message: "是否下载pwa离线文件",
        })
          .then(() => {
            addPwa();
          })
      } catch {
        showToast("当前环境不支持 pwa");
      }
    }
  }, 1000);
}

/**
 * 用户点击确定安装 pwa
 */
const addPwa = () => {
  try {
    window.deferredPrompt.prompt();
    window.deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        showToast("已下载PWA离线文件，请在桌面上找到并安装");
      } else {
        showToast("用户拒绝安装PWA--可打印");
      }
      window.deferredPrompt.deferredPrompt = null;
    });
  } catch {
    showToast("当前环境不支持 pwa");
  }
};

/**
 * 转换成大写字母
 */
export function toUpperCaseFn(str?: string): string {
  if (!str) return '';
  str = str.toString();
  return str.toUpperCase();
}