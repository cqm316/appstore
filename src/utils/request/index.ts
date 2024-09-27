/*
 * @Author: chenqiaomin
 * @Date: 2024-09-25 01:09:12
 * @LastEditors: chenqiaomin@bxqqedu.com chenqiaomin@bxqqedu.com
 * @LastEditTime: 2024-09-27 17:13:08
 * @FilePath: appstore\src\utils\request\index.ts
 * @Description: 请求API 封装
 */
import type { InternalAxiosRequestConfig, AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import axios from 'axios';
import qs from 'qs';
import { getAPI } from '@/utils';
import { type CustomRequestConfig, type ServiceResult, ContentTypeEnum } from './types';
import { httpErrorHandle, serviceErrorHandle } from './handler';

/**
 * 创建 axios 实例
 */
const instance: AxiosInstance = axios.create({
  // 基础接口地址
  baseURL: getAPI(),
  // 请求超时事件
  timeout: 5 * 1000,
  // 使用 form-urlencoded 格式，即伪表单
  headers: {
    'Content-Type': ContentTypeEnum.FORM_URLENCODED,
  },
});

/**
 * 请求拦截器
 */
instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const joinPayloadData = (data: any) => {
    return { ...data };
  };

  // 序列化数据
  const contentType = config.headers?.['Content-Type'];
  if (contentType === ContentTypeEnum.FORM_URLENCODED) {
    if (['post', 'put', 'patch'].includes(config.method as string)) {
      config.data = qs.stringify(joinPayloadData(config.data));
    }

    if (['delete', 'get', 'head'].includes(config.method as string)) {
      config.params = joinPayloadData(config.params);
    }
  }

  return config;
});

/**
 * 响应拦截器
 */
instance.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    return response?.data;
  },
  (error: AxiosError) => {
    // 处理服务端错误
    const result = error?.response?.data;
    const statusText = error?.response?.statusText; 
    if (result && statusText) {
      serviceErrorHandle({msg: statusText, code: error?.response?.status});
    } else {
      httpErrorHandle(error);
    }

    return Promise.reject(error);
  },
);

/**
 * 通用请求函数
 */
export function request<T = ServiceResult>(config: CustomRequestConfig): Promise<T> {

  return new Promise((resolve, reject) => {
    instance
      .request<any, AxiosResponse<ServiceResult>>(config)
      .then((res: AxiosResponse<ServiceResult>) => {
        resolve(res as unknown as Promise<T>);
      })
      .catch((e: Error | AxiosError) => {
        reject(e);
      });
  });
}
