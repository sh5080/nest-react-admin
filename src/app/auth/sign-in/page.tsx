import React from 'react';

import { SignInForm } from '../../../components/auth/sign-in-form';
import Layout from '../../layout';

export default function SignInPage() {
  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ width: '50%', maxWidth: '400px' }}>
          {' '}
          <SignInForm />
        </div>
      </div>
    </Layout>
  );
}
