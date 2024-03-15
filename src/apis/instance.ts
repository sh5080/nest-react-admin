import axios, { AxiosError } from 'axios';

import { RequestTimeoutException } from '../types/error.type';

const axiosApi = (url: string, options?: any) => {
  const instance = axios.create({
    baseURL: url,
    ...options,
  });

  instance.defaults.timeout = 10000;

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        throw new RequestTimeoutException(`요청시간이 초과되었습니다. \n지속될 경우 관리자에게 문의해주세요.`);
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const defaultInstance = axiosApi(process.env.REACT_APP_API_URL);
