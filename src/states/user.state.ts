import { atom } from 'recoil';

import { persistAtom } from './index';

export const userState = atom({
  key: 'user',
  default: { nickname: null, role: null },
  effects_UNSTABLE: [persistAtom],
});
