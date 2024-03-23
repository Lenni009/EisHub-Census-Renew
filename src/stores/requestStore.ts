import type { CensusEntry } from '@/types/query';
import { defineStore } from 'pinia';

interface RequestStore {
  requestSent: boolean;
  requestSucceeded: boolean;
  requestFailed: boolean;
  censusData: CensusEntry[];
}

export const useRequestStore = defineStore('requests', {
  state: (): RequestStore => ({
    requestSent: false,
    requestSucceeded: false,
    requestFailed: false,
    censusData: [],
  }),

  getters: {
    censusCount: (state) => state.censusData.length,
  },
});
