import type { QueryEntry } from '@/types/query';
import { censusQuery } from '@/variables/wikiRequest';
import { defineStore, storeToRefs } from 'pinia';
import { useCensusDataStore } from './censusDataStore';

interface RequestStore {
  requestSent: boolean;
  requestSucceeded: boolean;
  requestFailed: boolean;
}

export const useRequestStore = defineStore('requests', {
  state: (): RequestStore => ({
    requestSent: false,
    requestSucceeded: false,
    requestFailed: false,
  }),

  actions: {
    async getCensusData() {
      const censusDataStore = useCensusDataStore();
      const { censusData } = storeToRefs(censusDataStore);
      const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));
      try {
        this.requestSent = true;
        const res = await fetch(censusQuery);
        const data = await res.json();
        await sleep(3000);
        censusData.value = data.cargoquery.map(
          ({
            title: {
              CensusArrival,
              CensusDiscord,
              CensusFriend,
              CensusPlayer,
              CensusReddit,
              CensusRenewal,
              Mode,
              Name,
              Platform,
              System,
            },
          }: QueryEntry) => ({
            CensusArrival: new Date(CensusArrival),
            CensusRenewal: CensusRenewal.split(',')?.map((item) => item.trim()) ?? [],
            CensusDiscord,
            CensusFriend,
            CensusPlayer,
            CensusReddit,
            Mode,
            Name,
            Platform,
            System,
          })
        );

        this.requestSucceeded = true;
      } catch (e) {
        console.warn(e);
        this.requestFailed = true;
      }
    },
  },
});
