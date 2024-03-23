import { defineStore } from 'pinia';

interface CensusData {
  year: number;
}

export const useRequestStore = defineStore('censusData', {
  state: (): CensusData => ({
    year: new Date().getUTCFullYear(),
  }),
});
