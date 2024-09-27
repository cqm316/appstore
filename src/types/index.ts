/*
 * @Author: chenqiaomin
 * @Date: 2024-09-25 22:50:21
 * @LastEditors: chenqiaomin@bxqqedu.com chenqiaomin@bxqqedu.com
 * @LastEditTime: 2024-09-27 17:43:39
 * @FilePath: appstore\src\types\index.ts
 * @Description: 常用类型定义
 */

export interface resultData {
  id: number | string;
  name: string;
  category?: string | undefined;
  rate?: number;
  commentsNum?: number | string;
  imageUrl?: string;
  detailUrl?: string;
  description?: string | undefined;
}