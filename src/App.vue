<script setup lang="ts">
import type { Component } from 'vue';
import Table from './pages/Table.vue';
import Renew from './pages/Renew.vue';
import Form from './pages/Form.vue';

const isEisvanaHost = window.location.host === 'census.eisvana.com';

const router: { [key: string]: Component } = {
  form: Form,
  renew: Renew,
};

const route = window.location.pathname.split('/')?.at(-1)?.slice(0, -5); // NoSonar getting the current filename without the "html" ending
const routeComponent = getRouteComponent();

function getRouteComponent() {
  if (!route) return Table;
  return router[route] ?? Table;
}
</script>

<template>
  <header class="header">
    <nav>
      <a :href="isEisvanaHost ? 'https://eisvana.com' : '..'">&larr; View other pages</a>
    </nav>
  </header>

  <main>
    <component :is="routeComponent"></component>
  </main>
</template>

<style scoped lang="scss">
.header {
  margin-block-start: 2rem;
}
</style>
