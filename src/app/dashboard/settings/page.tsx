import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Notifications } from '../../../components/dashboard/settings/notifications';
import { UpdatePasswordForm } from '../../../components/dashboard/settings/update-password-form';

export default function SettingsPage() {
  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Settings</Typography>
      </div>
      <Notifications />
      <UpdatePasswordForm />
    </Stack>
  );
}
