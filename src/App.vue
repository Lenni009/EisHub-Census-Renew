<script setup lang="ts">
import { onMounted, type Component } from 'vue';
import Table from './pages/Table.vue';
import Renew from './pages/Renew.vue';
import Form from './pages/Form.vue';
import { censusQuery } from './variables/wikiRequest';
import type { QueryEntry } from './types/query';
import { useRequestStore } from './stores/requestStore';
import { storeToRefs } from 'pinia';

const isEisvanaHost = window.location.host === 'census.eisvana.com';

const router: { [key: string]: Component } = {
  form: Form,
  renew: Renew,
};

const route = window.location.pathname.split('/')?.at(-1)?.slice(0, -5); // NoSonar getting the current filename without the "html" ending
const routeComponent = getRouteComponent();

const isFormRoute = route === 'form';

function getRouteComponent() {
  if (!route) return Table;
  return router[route] ?? Table;
}

const pageData = useRequestStore();
const { censusData, requestFailed, requestSucceeded, requestSent } = storeToRefs(pageData);

onMounted(async () => {
  if (isFormRoute) return;
  try {
    requestSent.value = true;
    const res = await fetch(censusQuery);
    const data = await res.json();
    censusData.value = data.cargoquery.map(({ title: item }: QueryEntry) => ({
      Name: item.Name,
      CensusPlayer: item.CensusPlayer,
      CensusRenewal: item.CensusRenewal.split(',')?.map((item) => item.trim()) ?? [],
    }));
    requestSucceeded.value = true;
  } catch (e) {
    console.warn(e);
    requestFailed.value = true;
  }
});
</script>

<template>
  <header class="header">
    <nav>
      <a :href="isEisvanaHost && !route ? 'https://eisvana.com' : '..'">&larr; View other pages</a>
    </nav>
  </header>

  <main>
    <component
      v-if="requestSucceeded || isFormRoute"
      :is="routeComponent"
    />
    <div v-else-if="requestFailed">Something went wrong :/</div>
    <div
      v-else
      aria-busy="true"
    ></div>
  </main>
</template>

<style scoped lang="scss">
.header {
  margin-block-start: 2rem;
}
</style>
