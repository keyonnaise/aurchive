import { create } from 'zustand';
import { IAccount } from '~lib/api/auth/types';

interface Store {
  myAccount: IAccount | null;
  setMyAccount(account: IAccount | null): void;
}

const useMyAccountStore = create<Store>((set) => ({
  myAccount: null,

  setMyAccount(account) {
    if (account !== null) {
      localStorage.setItem('myAccount', JSON.stringify(account));
    } else {
      localStorage.removeItem('myAccount');
    }

    set((prev) => ({ ...prev, myAccount: account }));
  },
}));

export default useMyAccountStore;
