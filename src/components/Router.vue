<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useRouteDataStore } from '@/stores/routeDataStore';
import { defineAsyncComponent, type Component } from 'vue';
import { useRequestStore } from '@/stores/requestStore';

const routeData = useRouteDataStore();
const { route } = storeToRefs(routeData);

const requestData = useRequestStore();

interface RouterObj {
  component: string;
  requiresData: boolean;
}

const router: Record<string, RouterObj> = {
  form: { component: 'CensusForm', requiresData: false },
  renew: { component: 'Renew', requiresData: true },
  table: { component: 'CensusTable', requiresData: true },
  index: { component: 'Home', requiresData: false },
};

const routeComponentObj = getRouteComponent();

const RouteComponent = defineAsyncComponent<Component>(() => import(`../pages/${routeComponentObj.component}.vue`));

if (routeComponentObj.requiresData) requestData.getCensusData();

function getRouteComponent() {
  const currentRoute = route.value;
  if (!currentRoute || !router[currentRoute]) return router.index;
  return router[currentRoute];
}
</script>

<template>
  <RouteComponent />
</template>
