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
const isSending = ref(false);
const isFailed = ref(false);

const confirmDialog = ref<InstanceType<typeof ConfirmDialog> | null>(null);

const renewed = computed(() => props.userObject.CensusRenewal === props.currentYear);
const renewRequested = ref(props.alreadyRequested);

const renewText = computed(() => {
  if (isSending.value) return '';
  if (renewed.value) return 'Already Renewed';
  if (isFailed.value) return 'Request Failed!';
  if (renewRequested.value) return 'Renewal Requested';
  return 'Request Renewal';
});

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
        content: `${userName.value} requested renewal.\n<${new URL(wikiLink + props.userObject.Name)}>`,
      }),
    });
    emit('renew', userName.value);
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
  <ConfirmDialog
    :user-name="userName"
    ref="confirmDialog"
    @confirm="requestRenewal"
  />
  <div>{{ userName }}</div>
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
</template>

<style scoped lang="scss">
.failed {
  background-color: indianred;
}
</style>
