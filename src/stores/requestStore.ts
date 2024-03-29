import type { QueryEntry } from '@/types/censusQueryResponse';
import { getCensusQueryUrl } from '@/helpers/wikiApi';
import { defineStore, storeToRefs } from 'pinia';
import { useCensusDataStore } from './censusDataStore';
import { civilized } from '@/variables/civilized';

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
      try {
        this.requestSent = true;
        const censusQueryUrl = getCensusQueryUrl(civilized);
        const res = await fetch(censusQueryUrl);
        const data = await res.json();
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
