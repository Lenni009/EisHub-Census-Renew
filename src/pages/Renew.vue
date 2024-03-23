<script setup lang="ts">
import { ref } from 'vue';
import UserTable from '../components/UserTable.vue';

const filter = ref<string>('');

const missingWebhook = !import.meta.env.VITE_DISCORD_RENEW_WEBHOOK;

const tooManyTries = ref(false);
</script>

<template>
  <h1 class="title">Eisvana Census Renewal</h1>

  <p
    v-if="missingWebhook"
    class="warning"
  >
    No Webhook URL found, no message will be sent!
  </p>
  <template v-if="!tooManyTries">
    <input
      id="searchBar"
      name="searchBar"
      placeholder="Search Name"
      type="text"
      v-model="filter"
    />
    <UserTable
      :filter="filter"
      @exceeded="tooManyTries = true"
    />
  </template>
  <p
    v-else
    class="tries-exceeded-error"
  >
    You have requested too many renewals. Please contact Lenni on Discord for help.
  </p>
</template>

<style scoped lang="scss">
.title {
  margin-block-end: 2rem;
  text-align: center;
}

.warning {
  background-color: red;
  color: white;
  border-radius: var(--pico-border-radius);
  padding: 0.5rem;
}

.tries-exceeded-error {
  text-align: center;
}
</style>
