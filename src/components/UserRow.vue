<script setup lang="ts">
import { type CensusEntry } from '@/types/query';
import RenewButton from './RenewButton.vue';
import { computed } from 'vue';

const props = defineProps<{
  userObject: CensusEntry;
  tries: number;
  renewalRevision: string;
  alreadyRequested: boolean;
}>();

const userName = computed(() => props.userObject.CensusPlayer);

const emit = defineEmits(['renew']);
</script>

<template>
  <div>{{ userName }}</div>
  <RenewButton
    :user-name="userName"
    :user-object="userObject"
    :renewal-revision="renewalRevision"
    :already-requested="alreadyRequested"
  />
</template>

<style scoped lang="scss">
.failed {
  background-color: indianred;
}
</style>
