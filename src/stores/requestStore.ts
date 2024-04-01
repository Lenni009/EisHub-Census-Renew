import type { QueryEntry, CensusEntry } from '@/types/censusQueryResponse';
import { getCensusQueryUrl } from '@/helpers/wikiApi';
import { defineStore, storeToRefs } from 'pinia';
import { useCensusDataStore } from './censusDataStore';
import { civilized } from '@/variables/civilized';
import { currentYearString } from '@/variables/dateTime';
import { useRenewDataStore } from './renewDataStore';

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
      const renewDataStore = useRenewDataStore();
      const { requested } = storeToRefs(renewDataStore);
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
          }: QueryEntry): CensusEntry => {
            const censusRenewalArray = CensusRenewal?.split(',')?.map((item) => item.trim()) ?? [];
            return {
              renewals: censusRenewalArray,
              renewed: censusRenewalArray.includes(currentYearString),
              renewRequested: requested.value.includes(CensusPlayer),
              CensusArrival: new Date(CensusArrival),
              CensusRenewal: censusRenewalArray,
              CensusDiscord,
              CensusFriend,
              CensusPlayer,
              CensusReddit,
              Mode,
              Name,
              Platform,
              System,
            };
          }
        );

        this.requestSucceeded = true;
      } catch (e) {
        console.warn(e);
        this.requestFailed = true;
      }
    },
  },
});
