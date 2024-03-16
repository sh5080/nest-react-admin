import { atom } from 'recoil';

import { persistAtom } from './index';

export const userState = atom({
  key: 'userState',
  default: { nickname: '', role: '' },
  effects_UNSTABLE: [persistAtom],
});
