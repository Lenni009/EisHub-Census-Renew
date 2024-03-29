<script setup lang="ts">
import { type CensusEntry } from '@/types/censusQueryResponse';
import RenewButton from './RenewButton.vue';
import { computed } from 'vue';

const props = defineProps<{
  userObject: CensusEntry;
}>();

const userName = computed(() => props.userObject.CensusPlayer);

const buttonText = computed(() => {
  if (props.userObject.renewed) return 'Already renewed';
  if (props.userObject.renewRequested) return 'Renewal Requested';
  return 'Request Renewal';
});
</script>

<template>
  <div>{{ userName }}</div>
  <RenewButton
    :button-text
    :user-object="userObject"
    button-text-failed="Request Failed!"
  />
</template>

<style scoped lang="scss">
.failed {
  background-color: indianred;
}
</style>
