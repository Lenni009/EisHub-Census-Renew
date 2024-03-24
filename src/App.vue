<script setup lang="ts">
import { useRequestStore } from './stores/requestStore';
import { storeToRefs } from 'pinia';
import { useRouteDataStore } from './stores/routeDataStore';
import Router from './components/Router.vue';
import LoadingError from './components/LoadingError.vue';
import LoadingSpinner from './components/LoadingSpinner.vue';
import ThemeSwitch from './components/ThemeSwitch.vue';
import { computed } from 'vue';

const isEisvanaHost = window.location.host === 'census.eisvana.com';

const requestData = useRequestStore();
const { requestSent, requestSucceeded, requestFailed } = storeToRefs(requestData);

const routeData = useRouteDataStore();
const { route } = storeToRefs(routeData);

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
