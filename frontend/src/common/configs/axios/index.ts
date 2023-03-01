import Axios, { AxiosResponse } from 'axios';
import { axiosErrorHandler } from '@/common/util/error';

export const createInstance = () => {
  const googleUrl: RegExpExecArray | null = /.*(du.r.appspot.com)/g.exec(window.location.href);
  const urlExe: RegExpExecArray | null = /(http(s)?:\/\/)([a-z0-9\w]+\.*)+[a-z0-9]{2,4}(:8001|:8000)?/g.exec(
    window.location.href,
  );
  const url: string = googleUrl ? googleUrl[0] : urlExe ? urlExe[0] : '';

  const instance = Axios.create({
    baseURL: process.env.NODE_ENV === 'development' ? `${process.env.VUE_APP_DEVHOST}/api` : `${url}/api`,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  });

  return instance;
};

export const createIT = createInstance();

export const request = async (
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  url: string,
  data?: any,
): Promise<AxiosResponse | undefined | void> => {
  try {
    const response = await createIT[method](url, data);
    return response?.data;
  } catch (err) {
    axiosErrorHandler(err);
    return undefined;
  }
};
