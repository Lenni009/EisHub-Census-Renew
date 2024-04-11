import { getLocalStorageAmount, getLocalStorageArray } from '@/helpers/localStorage';
import { maximumAllowedTries } from '@/variables/abuseGuards';
import { defineStore } from 'pinia';

interface RenewData {
  tries: number;
  requested: string[];
}

export const useRenewDataStore = defineStore('renewData', {
  state: (): RenewData => ({
    tries: getLocalStorageAmount(),
    requested: getLocalStorageArray(),
  }),

  getters: {
    triesExceeded: (state) => state.tries >= maximumAllowedTries,
  },
});
