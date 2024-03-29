<script setup lang="ts">
import { computed, ref } from 'vue';
import ConfirmDialog from './ConfirmDialog.vue';
import type { CensusEntry } from '@/types/censusQueryResponse';

const props = defineProps<{
  userObject: CensusEntry;
  renewalRevision: string;
  userName: string;
  alreadyRequested: boolean;
}>();

const webhook = atob(import.meta.env.VITE_DISCORD_RENEW_WEBHOOK ?? '');
const wikiLink = 'https://nomanssky.fandom.com/wiki/Special:EditPage/';
const isSending = ref(false);
const isFailed = ref(false);

const renewText = computed(() => {
  if (isSending.value) return '';
  if (renewed.value) return 'Already Renewed';
  if (isFailed.value) return 'Request Failed!';
  if (renewRequested.value) return 'Renewal Requested';
  return 'Request Renewal';
});

const confirmDialog = ref<InstanceType<typeof ConfirmDialog> | null>(null);

const emit = defineEmits<(e: 'renew', value: string) => void>();

const renewed = computed(() => props.userObject.CensusRenewal.includes(props.renewalRevision));
const renewRequested = ref(props.alreadyRequested);

async function requestRenewal() {
  if (renewRequested.value || !webhook) return;
  isSending.value = true;
  try {
    await fetch(webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: `${props.userName} requested renewal.\n<${new URL(wikiLink + props.userObject.Name)}>`,
      }),
    });
    emit('renew', props.userName);
    renewRequested.value = true;
  } catch (error) {
    isFailed.value = true;
    console.warn(error);
    setTimeout(() => {
      isFailed.value = false;
    }, 1500); // NoSonar wait 1.5 seconds
  }
  isSending.value = false;
}

const openDialog = () => confirmDialog.value?.toggleModal();
</script>

<template>
  <button
    :aria-busy="isSending"
    :class="{ failed: isFailed }"
    :disabled="renewed || renewRequested"
    ref="renewButton"
    type="button"
    @click="openDialog"
  >
    {{ renewText }}
  </button>
  <ConfirmDialog
    :user-name="userName"
    ref="confirmDialog"
    @confirm="requestRenewal"
  />
</template>
