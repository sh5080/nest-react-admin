import { recoilPersist } from 'recoil-persist';

export const { persistAtom } = recoilPersist({
  key: 'sixteen-persist',
  storage: localStorage,
});
