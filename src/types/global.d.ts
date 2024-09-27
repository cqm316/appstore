/*
 * @Author: chenqiaomin
 * @Date: 2024-09-25 22:20:33
 * @LastEditors: chenqiaomin@bxqqedu.com chenqiaomin@bxqqedu.com
 * @LastEditTime: 2024-09-27 17:10:20
 * @FilePath: appstore\src\types\global.d.ts
 * @Description: 全局声明
 */
export {};
declare global {

  declare type Recordable<T = any> = Record<string, T>;

  interface window {
    deferredPrompt: Event | any;
  }
}