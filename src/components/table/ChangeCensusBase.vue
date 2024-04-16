<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import LoadingSpinner from '../LoadingSpinner.vue';
import NewBaseButton from './NewBaseButton.vue';
import { apiCall, getPlayerBasesQueryUrl } from '@/helpers/wikiApi';
import { civilized } from '@/variables/civilized';
import { isCargoResponse } from '@/helpers/typeGuards';
import type { CargoQueryBaseNameResponse } from '@/types/queryResponse';
import type { CensusEntry } from '@/types/censusQueryResponse';
import { sendBaseChangeRequest } from '@/helpers/censusSubmission';
import { buildWikiPageLink } from '@/helpers/wikiLinkConstructor';

const props = defineProps<{
  entry: CensusEntry;
  items?: string[];
  requested?: string;
}>();

const requestedBase = computed(() => (props.requested === props.entry.Name ? '' : props.requested));
const activeBase = computed(() => props.requested ?? props.entry.Name);

const items = ref<string[]>(props.items ?? []);
const isError = ref(false);

const selectedBase = ref(activeBase.value);
const reason = ref('');

const emit = defineEmits<{
  close: [];
  ready: [items: string[]];
  submit: [request: string];
}>();

onMounted(async () => {
  if (items.value.length) return;
  try {
    const apiResponse = await apiCall(getPlayerBasesQueryUrl(props.entry.CensusPlayer, civilized));
    if (!isCargoResponse<CargoQueryBaseNameResponse>(apiResponse)) {
      isError.value = true;
      return;
    }
    items.value = apiResponse.cargoquery.map((item) => item.title.Name);
    emit('ready', items.value);
    isError.value = false;
  } catch (e) {
    isError.value = true;
    console.error('Something went wrong:', e);
  }
});

function submit() {
  if (selectedBase.value === activeBase.value) return;
  emit('submit', selectedBase.value);
  sendBaseChangeRequest(props.entry, selectedBase.value, reason.value);
}
</script>

<template>
  <article>
    <header class="text-bold">
      <button
        aria-label="Close"
        class="close"
        form="request-close-form"
      ></button>
      <p>Change Census Base for {{ entry.CensusPlayer }}</p>
    </header>
    <div
      v-if="items.length === 1"
      class="text-center"
    >
      <p>There's currently only one base on the wiki.</p>
      <NewBaseButton
        :entry
        text="Create New Base"
      />
    </div>
    <template v-else-if="items.length">
      <div
        v-for="item in items"
        class="base-item"
      >
        <label
          :for="item"
          :aria-disabled="item === requestedBase || (item === activeBase && !requestedBase)"
          class="base-selector"
        >
          <input
            v-model="selectedBase"
            :disabled="item === requestedBase || (item === activeBase && !requestedBase)"
            :id="item"
            :value="item"
            name="bases"
            type="radio"
          />
          <span
            >{{ item }} {{ item === requestedBase ? '[Requested]' : '' }}
            {{ item === activeBase && !requestedBase ? '[Active]' : '' }}</span
          >
        </label>
        <a
          :href="buildWikiPageLink(item)"
          rel="noopener noreferrer"
          target="_blank"
          >View Wiki Page</a
        >
      </div>
      <input
        v-model="reason"
        aria-label="Reason"
        class="reason-input"
        placeholder="Reason"
        type="text"
      />
    </template>
    <LoadingSpinner v-else-if="!isError" />
    <p v-else>Something went wrong!</p>
    <footer v-show="items.length > 1">
      <form
        id="request-close-form"
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

.reason-input {
  margin: 0;
  margin-block-start: 0.5rem;
}

.base-item {
  display: flex;
  justify-content: space-between;

  .base-selector {
    flex-grow: 1;
  }
}
</style>
