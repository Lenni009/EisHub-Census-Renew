<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useRouteDataStore } from '@/stores/routeDataStore';
import { defineAsyncComponent, type Component } from 'vue';
import LoadingSpinner from './LoadingSpinner.vue';
import LoadingError from './LoadingError.vue';

const routeData = useRouteDataStore();
const { route } = storeToRefs(routeData);

const router: Record<string, string> = {
  form: 'Form',
  renew: 'Renew',
  table: 'Table',
};

const RouteComponent = defineAsyncComponent<Component>({
  loader: () => import(`../pages/${getRouteComponent()}.vue`),
  loadingComponent: LoadingSpinner,
  errorComponent: LoadingError,
});

function getRouteComponent() {
  const currentRoute = route.value;
  if (!currentRoute || !router[currentRoute]) return router.table;
  return router[currentRoute];
}
</script>

<template>
  <RouteComponent />
</template>
