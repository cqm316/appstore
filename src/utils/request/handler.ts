import type { AxiosError } from 'axios';
import type { ServiceResult } from './types';
import { showToast } from 'vant';

/**
 * 业务错误
 * @param {ServiceResult} res 业务约定的返回数据
 * @param {number} res.code 业务约定的错误码
 * @param {string} res.msg 业务上的错误信息
 * @param {*} res.data
 */
export function serviceErrorHandle(res: ServiceResult) {
  const { msg } = res;
  showToast({
    message: msg || 'Result Error',
    duration: 3 * 1000,
  });
}

/**
 * HTTP 错误
 */
export function httpErrorHandle(error: AxiosError) {

  let errMessage = ''; // Http Error

  if (error?.response) {
    const { status } = error.response;

    switch (status) {
      case 403:
        errMessage = `${status} 网络请求被拒绝`;
        break;
      case 404:
        errMessage = `${status} 网络请求不存在`;
        break;
      case 500:
        errMessage = `${status} 服务器内部错误`;
        break;
      default:
        errMessage = `${status || error.message}`;
        break;
    }
  }

  // 网络出错
  if (error?.message) {
    if (error.message.includes('timeout')) {
      errMessage = '请求超时';
    }
    if (error.message.includes('Network Error')) {
      errMessage = '当前网络不可用，请检查你的网络设置';
    }
  }

  if (errMessage) {
    showToast({
      message: errMessage,
      duration: 3 * 1000,
    });
  }
}
