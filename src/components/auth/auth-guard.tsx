import React, { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';

import { useUser } from '../../hooks/use-user';
import { logger } from '../../lib/default-logger';
import { paths } from '../../paths';

export interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps): React.ReactElement | null {
  const navigate = useNavigate();
  const { nickname, role } = useUser();
  const [isChecking, setIsChecking] = useState<boolean>(true);

  const checkPermissions = async (): Promise<void> => {
    if (!nickname || !role) {
      logger.debug('[AuthGuard]: User is not logged in, redirecting to sign in');
      navigate(paths.auth.signIn);
      return;
    }

    setIsChecking(false);
  };

  useEffect(() => {
    checkPermissions().catch(() => {
      // noop
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Expected
  }, [nickname, role]);

  if (isChecking) {
    return null;
  }

  // if (error) {
  //   return <Alert color="error">{error}</Alert>;
  // }

  return <React.Fragment>{children}</React.Fragment>;
}
