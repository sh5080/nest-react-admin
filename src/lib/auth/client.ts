'use client';

import { loginApi, logoutApi } from '../../apis/auth';
import { ClientError, ServerError } from '../../types/error.type';
import type { User } from '../../types/user';

const user = {
  id: 'USR-000',
  avatar: '/assets/avatar.png',
  firstName: 'Sofia',
  lastName: 'Rivers',
  email: 'sofia@devias.io',
} satisfies User;

export interface loginParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  async login(params: loginParams): Promise<{ error?: string; nickname?: string; role?: string }> {
    try {
      const { email, password } = params;

      const loginRes = await loginApi(email, password);
      console.log('로그인시 확인되는 값: ', loginRes);

      const { nickname, role } = loginRes.data;
      return { nickname, role };
    } catch (err) {
      const data = err.response.data;
      if (data.statusCode < 500) {
        throw new ClientError(data.message);
      } else throw new ServerError(err.message);
    }
  }

  async resetPassword(params: ResetPasswordParams) {
    const { email } = params;
    console.log('여기: ', email);
    return { error: 'Password reset not implemented' };
  }

  // async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
  //   return { error: 'Update reset not implemented' };
  // }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    // Make API request

    // We do not handle the API, so just check if we have a token in localStorage.
    const token = localStorage.getItem('custom-auth-token');

    if (!token) {
      return { data: null };
    }

    return { data: user };
  }

  async logout(): Promise<{ error?: string }> {
    await logoutApi();

    return {};
  }
}

export const authClient = new AuthClient();
