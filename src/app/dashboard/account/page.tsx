import React from 'react';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { AccountDetailsForm } from '../../../components/dashboard/account/account-details-form';
import { AccountInfo } from '../../../components/dashboard/account/account-info';

export default function AccountPage() {
  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Account</Typography>
      </div>
      <Grid container spacing={3}>
        <Grid item lg={4} md={6} xs={12}>
          <AccountInfo />
        </Grid>
        <Grid item lg={8} md={6} xs={12}>
          <AccountDetailsForm />
        </Grid>
      </Grid>
    </Stack>
  );
}
