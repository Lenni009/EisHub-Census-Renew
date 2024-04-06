<script setup lang="ts">
import { useRequestStore } from './stores/requestStore';
import { storeToRefs } from 'pinia';
import { useRouteDataStore } from './stores/routeDataStore';
import Router from './components/Router.vue';
import LoadingError from './components/LoadingError.vue';
import LoadingSpinner from './components/LoadingSpinner.vue';
import ThemeSwitch from './components/ThemeSwitch.vue';
import { computed } from 'vue';
import { useCensusDataStore } from './stores/censusDataStore';

const isEisvanaHost = window.location.host === 'census.eisvana.com';

const requestData = useRequestStore();
const { requestSent, requestFailed } = storeToRefs(requestData);

const censusDataStore = useCensusDataStore();
const { censusData } = storeToRefs(censusDataStore);

const routeData = useRouteDataStore();
const { route, isFormRoute } = storeToRefs(routeData);

const isLoading = computed(() => requestSent.value && !censusData.value.length && !requestFailed.value);

const hasSearchParams = Boolean(window.location.search);
</script>

<template>
  <header class="header">
    <nav>
      <ul>
        <li class="navigation-items">
          <div>
            <a :href="isEisvanaHost && !route ? 'https://eisvana.com' : '..'">&larr; Back to main page</a>
          </div>
          <div v-if="isFormRoute && hasSearchParams">
            <a href="./table.html">&larr; Table</a>
          </div>
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
    <Suspense>
      <div>
        <Router />
        <LoadingSpinner v-if="isLoading" />
        <LoadingError v-if="requestFailed" />
      </div>

      <template #fallback>
        <LoadingSpinner />
      </template>
    </Suspense>
  </main>
</template>

<style scoped lang="scss">
.navigation-items {
  display: flex;
  flex-direction: column;
}
</style>
