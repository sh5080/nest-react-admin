import React from 'react';

import { Layout } from '../../../components/auth/layout';
import { SignInForm } from '../../../components/auth/sign-in-form';
import { config } from '../../../config';

const metadata = { title: `Sign in | Auth | ${config.site.name}` };

function Page() {
  return (
    <Layout>
      <SignInForm />
    </Layout>
  );
}

export { Page as default, metadata };
