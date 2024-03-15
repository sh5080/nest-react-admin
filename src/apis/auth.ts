import { defaultInstance } from './instance';

const defaultUrl = 'auth';

export const loginApi = async (email: string, password: string) => {
  try {
    const response = await defaultInstance.post(
      `/${defaultUrl}/login`,
      {
        email,
        password,
      },
      { withCredentials: true }
    );
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const logout = async () => {
  try {
    const response = await defaultInstance.delete(`/${defaultUrl}/logout`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const authCheck = async () => {
  try {
    const response = await defaultInstance.get(`/${defaultUrl}/check`, {
      withCredentials: true,
    });
    console.log('api에서 서버 연결', response);
    return response.data;
  } catch (err) {
    console.error('api에서 에러', err);
    throw err;
  }
};