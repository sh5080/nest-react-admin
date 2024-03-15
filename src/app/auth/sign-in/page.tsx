import React from 'react';

import { SignInForm } from '../../../components/auth/sign-in-form';
import Layout from '../../layout';

export default function SignInPage() {
  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ width: '50%', maxWidth: '400px' }}>
          {' '}
          {/* 폼의 너비와 최대 너비를 설정 */}
          <SignInForm /> {/* 로그인 폼 */}
        </div>
      </div>
    </Layout>
  );
}
