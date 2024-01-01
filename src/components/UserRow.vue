<script setup lang="ts">
import { computed, ref } from 'vue';
import ConfirmDialog from './ConfirmDialog.vue';
import { type CensusEntry } from '@/types/query';

const props = defineProps<{
  userObject: CensusEntry;
  tries: number;
  currentYear: string;
  alreadyRequested: boolean;
}>();

const emit = defineEmits(['renew']);

const webhook = atob(import.meta.env.VITE_DISCORD_WEBHOOK ?? '');
const wikiLink = 'https://nomanssky.fandom.com/wiki/Special:EditPage/';
const userName = computed(() => props.userObject.CensusPlayer);

const confirmDialog = ref<InstanceType<typeof ConfirmDialog> | null>(null);

const renewed = computed(() => props.userObject.CensusRenewal === props.currentYear);
const renewRequested = ref(props.alreadyRequested);

const renewText = computed(() => {
  if (renewed.value) return 'Already Renewed';
  if (renewRequested.value) return 'Renewal Requested';
  return 'Request Renewal';
});

async function requestRenewal() {
  if (renewRequested.value || !webhook) return;
  await fetch(webhook, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: `${userName.value} requested renewal.\n<${new URL(wikiLink + props.userObject.Name)}>`,
    }),
  });
  renewRequested.value = true;
  emit('renew', userName.value);
}

const openDialog = () => confirmDialog.value?.toggleModal();
</script>

<template>
  <ConfirmDialog
    :user-name="userName"
    ref="confirmDialog"
    @confirm.once="requestRenewal"
  />
  <div>{{ userName }}</div>
  <button
    :disabled="renewed || renewRequested"
    ref="renewButton"
    type="button"
    @click="openDialog"
  >
    {{ renewText }}
  </button>
</template>
