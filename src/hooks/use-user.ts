import { useRecoilValue } from 'recoil';

import { userState } from '../states/user.state';

export function useUser() {
  const user = useRecoilValue(userState);

  if (!user) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return user;
}
