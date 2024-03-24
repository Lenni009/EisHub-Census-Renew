import type { CensusEntry } from '@/types/query';
import { defineStore } from 'pinia';

interface CensusData {
  year: number;
  censusData: CensusEntry[];
}

export const useCensusDataStore = defineStore('censusData', {
  state: (): CensusData => ({
    year: new Date().getUTCFullYear(),
    censusData: [],
  }),

  getters: {
    censusCount: (state) => state.censusData.length,
    availableRevisions: (state) => {
      const revisionArray = state.censusData.flatMap((item) => item.CensusRenewal);
      const uniqueRevisions = new Set(revisionArray);
      return Array.from(uniqueRevisions);
    },
  },
});
