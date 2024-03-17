import React from 'react';
import { Route, Routes } from 'react-router-dom';

import ResetPasswordPage from '../app/auth/reset-password/page';
import SignInPage from '../app/auth/sign-in/page';
import AccountPage from '../app/dashboard/account/page';
import CustomersPage from '../app/dashboard/customers/page';
import IntegrationsPage from '../app/dashboard/integrations/page';
import Layout from '../app/dashboard/layout';
import DashboardPage from '../app/dashboard/page';
import SettingsPage from '../app/dashboard/settings/page';
import NotFoundPage from '../app/errors/not-found/page';
import { paths } from './paths';

export function Router() {
  return (
    <Layout>
      <Routes>
        <Route path={paths.home} element={<SignInPage />} />
        <Route path={paths.auth.signIn} element={<SignInPage />} />
        <Route path={paths.auth.resetPassword} element={<ResetPasswordPage />} />
        <Route path={paths.dashboard.overview} element={<DashboardPage />} />
        <Route path={paths.dashboard.account} element={<AccountPage />} />
        <Route path={paths.dashboard.customers} element={<CustomersPage />} />
        <Route path={paths.dashboard.integrations} element={<IntegrationsPage />} />
        <Route path={paths.dashboard.settings} element={<SettingsPage />} />
        <Route path={paths.errors.notFound} element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}
