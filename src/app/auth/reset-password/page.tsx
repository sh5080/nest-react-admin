import React from 'react';

import { Layout } from '../../../components/auth/layout';
import { ResetPasswordForm } from '../../../components/auth/reset-password-form';
import { config } from '../../../config';

const metadata = { title: `Reset password | Auth | ${config.site.name}` };

function Page() {
  return (
    <Layout>
      <ResetPasswordForm />
    </Layout>
  );
}

export { Page as default, metadata };
