/*
 * @Author: chenqiaomin
 * @Date: 2024-09-25 01:14:29
 * @LastEditors: chenqiaomin@bxqqedu.com chenqiaomin@bxqqedu.com
 * @LastEditTime: 2024-09-27 17:18:54
 * @FilePath: appstore\src\apis\index.ts
 * @Description: 接口配置
 */

import { request } from '@/utils/request';

/**
 * 获取推荐APP列表
 */

export function getGrossingApplications(limit?: Number | Recordable) {
  return request({
    url: `/rss/topgrossingapplications/limit=${limit}/json`,
    method: 'get',
  });
}

/**
 * 获取免费APP列表
 */
export function getFreeApplications(limit?: Number |Recordable) {
  return request({
    url: `/rss/topfreeapplications/limit=${limit}/json`,
    method: 'get',
  });
}

/**
 * 获取应用星级和用户评论数
 */
export function getRateCount(ids?: String | Recordable) {
  return request({
    url: `/lookup?id=${ids}`,
    method: 'get',
  });
}

export default {
  getGrossingApplications,
  getFreeApplications
};
