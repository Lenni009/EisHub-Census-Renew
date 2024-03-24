<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { censusQuery } from './variables/wikiRequest';
import type { QueryEntry } from './types/query';
import { useRequestStore } from './stores/requestStore';
import { storeToRefs } from 'pinia';
import { useCensusDataStore } from './stores/censusDataStore';
import { useRouteDataStore } from './stores/routeDataStore';
import Router from './components/Router.vue';
import LoadingError from './components/LoadingError.vue';
import LoadingSpinner from './components/LoadingSpinner.vue';
import ThemeSwitch from './components/ThemeSwitch.vue';

const isEisvanaHost = window.location.host === 'census.eisvana.com';

const requestData = useRequestStore();
const { requestFailed, requestSucceeded, requestSent } = storeToRefs(requestData);

const censusDataStore = useCensusDataStore();
const { censusData } = storeToRefs(censusDataStore);

const routeData = useRouteDataStore();
const { route, isFormRoute } = storeToRefs(routeData);

onMounted(async () => {
  if (isFormRoute.value) return;
  try {
    requestSent.value = true;
    const res = await fetch(censusQuery);
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

    requestSucceeded.value = true;
  } catch (e) {
    console.warn(e);
    requestFailed.value = true;
  }
});

const isLoading = computed(() => requestSent.value && !requestSucceeded.value && !requestFailed.value);
</script>

<template>
  <header class="header">
    <nav>
      <ul>
        <li>
          <a :href="isEisvanaHost && !route ? 'https://eisvana.com' : '..'">&larr; Back to main page</a>
        </li>
      </ul>
      <ul>
        <li>
          <ThemeSwitch />
        </li>
      </ul>
    </nav>
  </header>

  <main>
    <div v-show="requestSucceeded || isFormRoute">
      <Router />
    </div>
    <LoadingSpinner v-if="isLoading" />
    <LoadingError v-if="requestFailed" />
  </main>
</template>

