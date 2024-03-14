import axios from 'axios';

const axiosApi = (url: string, options?: any) => {
  const instance = axios.create({
    baseURL: url,
    ...options,
  });
  return instance;
};

export const defaultInstance = axiosApi(process.env.REACT_APP_API_URL!);
