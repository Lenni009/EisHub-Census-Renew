<script setup lang="ts">
import { storeEntry } from '@/helpers/localStorage';
import { encodePlayerName } from '@/helpers/nameTranscode';
import type { CensusEntry } from '@/types/censusQueryResponse';

defineProps<{
  text: string;
  entry: CensusEntry;
}>();
</script>

<template>
  <a
    :href="`./form.html?new=${encodePlayerName(entry.CensusPlayer)}`"
    role="button"
    @click="storeEntry(entry)"
    >{{ text }}</a
  >
</template>
