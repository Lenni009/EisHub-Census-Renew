<script setup lang="ts">
import { ref } from 'vue';
import UserTable from '../components/UserTable.vue';
import { renewWebhook } from '@/variables/env';
import { useRenewDataStore } from '@/stores/renewDataStore';
import { storeToRefs } from 'pinia';

const filter = ref<string>('');

const renewDataStore = useRenewDataStore();
const { triesExceeded } = storeToRefs(renewDataStore);
</script>

<template>
  <h1 class="title">Eisvana Census Renewal</h1>

  <p
    v-if="!renewWebhook"
    class="warning"
  >
    No Webhook URL found, no message will be sent!
  </p>
  <input
    v-model="filter"
    id="searchBar"
    name="searchBar"
    placeholder="Search Name"
    type="search"
  />
  <p
    v-if="triesExceeded"
    class="warning"
  >
    You have requested too many renewals. Please contact Lenni on Discord for help.
  </p>
  <UserTable :filter="filter" />
</template>

<style scoped lang="scss">
.warning {
  background-color: red;
  color: white;
  border-radius: var(--pico-border-radius);
  padding: 0.5rem;
  text-align: center;
}
</style>
