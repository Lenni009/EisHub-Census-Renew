import type { QueryEntry, CensusEntry } from '@/types/censusQueryResponse';
import { apiCall, getCensusQueryCountUrl, getCensusQueryDataUrl } from '@/helpers/wikiApi';
import { defineStore, storeToRefs } from 'pinia';
import { useCensusDataStore } from './censusDataStore';
import { civilized } from '@/variables/civilized';
import { currentYearString } from '@/variables/dateTime';
import { useRenewDataStore } from './renewDataStore';
import { limit } from '@/variables/apiLimit';

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
        const censusCountQueryUrl = getCensusQueryCountUrl(civilized);
        const { cargoquery } = await apiCall(censusCountQueryUrl);
        const countString = Object.values(cargoquery[0].title)[0];
        const count = Number(countString);
        const requiredApiCalls = Math.ceil(count / limit);
        censusData.value = [];
        const apiData = Array.from({ length: requiredApiCalls }).map(async (_item, index) => {
          const censusQueryUrl = getCensusQueryDataUrl(civilized, index * limit);

          const data = await apiCall(censusQueryUrl);
          censusData.value.push(
            ...data.cargoquery.map(
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
                  Builderlink,
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
                  Builderlink,
                };
              }
            )
          );
        });
        await Promise.all(apiData);
        this.requestSucceeded = true;
      } catch (e) {
        console.warn(e);
        this.requestFailed = true;
      }
    },
  },
});
