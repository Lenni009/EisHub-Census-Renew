<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import LoadingSpinner from '../LoadingSpinner.vue';
import { apiCall, getPlayerBasesQueryUrl } from '@/helpers/wikiApi';
import { civilized } from '@/variables/civilized';
import { isCargoResponse } from '@/helpers/typeGuards';
import type { CargoQueryBaseNameResponse } from '@/types/queryResponse';
import type { CensusEntry } from '@/types/censusQueryResponse';
import { storeEntry } from '@/helpers/localStorage';
import { encodePlayerName } from '@/helpers/nameTranscode';
import { sendBaseChangeRequest } from '@/helpers/censusSubmission';

const props = defineProps<{
  entry: CensusEntry;
  items?: string[];
}>();

const activeBase = computed(() => props.entry.Name);

const items = ref<string[]>(props.items ?? []);
const selectedBase = ref(activeBase.value);
const isError = ref(false);

const emit = defineEmits<{
  close: [];
  ready: [items: string[]];
}>();

onMounted(async () => {
  selectedBase.value = activeBase.value;
  if (items.value.length) return;
  const apiResponse = await apiCall(getPlayerBasesQueryUrl(props.entry.CensusPlayer, civilized));
  if (!isCargoResponse<CargoQueryBaseNameResponse>(apiResponse)) {
    // TODO: '#' is a forbidden symbol in cargo queries. Some of our players have that in their name. Find a way to circumvent that!
    isError.value = true;
    return;
  }
  items.value = apiResponse.cargoquery.map((item) => item.title.Name);
  emit('ready', items.value);
});

function submit() {
  if (selectedBase.value === activeBase.value) return;
  sendBaseChangeRequest(props.entry, selectedBase.value);
}
</script>

<template>
  <article>
    <header class="text-bold">Change Census Base for {{ entry.CensusPlayer }}</header>
    <div
      v-if="items.length === 1"
      class="new-base-wrapper"
    >
      <p>There's currently only one base on the wiki.</p>
      <a
        :href="`./form.html?new=${encodePlayerName(entry.CensusPlayer)}`"
        role="button"
        @click="storeEntry(entry)"
        >Create New Base</a
      >
    </div>
    <label
      v-else-if="items.length"
      v-for="item in items"
      :for="item"
    >
      <input
        v-model="selectedBase"
        :id="item"
        :value="item"
        name="bases"
        type="radio"
      />
      <span>{{ item }}</span>
    </label>
    <LoadingSpinner v-else-if="!isError" />
    <p v-else>Something went wrong!</p>
    <footer v-if="items.length > 1">
      <form
        method="dialog"
        @submit="$emit('close')"
      >
        <button @click="submit">Submit</button>
        <button class="secondary">Cancel</button>
      </form>
    </footer>
  </article>
</template>

<style scoped lang="scss">
footer button {
  margin: 0;
}

.new-base-wrapper {
  text-align: center;
}
</style>
