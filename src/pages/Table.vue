<script setup lang="ts">
import { useCensusDataStore } from '@/stores/censusDataStore';
import { storeToRefs } from 'pinia';
import { computed, ref, watchEffect } from 'vue';
import CensusItem from '@/components/table/CensusItem.vue';
import type { CensusEntry } from '@/types/censusQueryResponse';
import { pageSize } from '@/variables/paginationData';

const censusDataStore = useCensusDataStore();
const { censusData, availableRevisions } = storeToRefs(censusDataStore);

const revision = ref('');
const searchTerm = ref('');

watchEffect(() => (revision.value = availableRevisions.value[0]?.toString()));

function filterEntry({
  Name,
  CensusPlayer,
  CensusDiscord,
  CensusReddit,
  Mode,
  Platform,
  System,
  CensusFriend,
  CensusRenewal,
}: CensusEntry): boolean {
  if (revision.value && !CensusRenewal.includes(revision.value)) return false;
  const allItems = [Name, CensusPlayer, CensusDiscord, CensusReddit, Mode, Platform, System, CensusFriend];
  const allItemsLowerCase = allItems.map((item) => item?.trim().toLowerCase());
  const includesSome = allItemsLowerCase.some((item) => item?.includes(searchTerm.value.toLowerCase()));
  return includesSome;
}

// only list the entries that are renewed for the currently selected year
const currentRevisionEntries = computed(() =>
  revision.value ? censusData.value.filter((item) => item.CensusRenewal.includes(revision.value)) : censusData.value
);

// count the entries that are renewed for the currently selected year
const currentRevisionCensusCount = computed(() => currentRevisionEntries.value.length);

// filter the entries that are renewed for the currently selected year, then reverse that array
const filteredEntries = computed(() => currentRevisionEntries.value.filter(filterEntry).toReversed());

const currentPage = ref(1);
const currentPageZeroIndexed = computed(() => currentPage.value - 1);
const availablePages = computed(() => Math.ceil(filteredEntries.value.length / pageSize));
const paginatedEntries = computed(() =>
  filteredEntries.value.slice(
    currentPageZeroIndexed.value * pageSize,
    currentPageZeroIndexed.value * pageSize + pageSize
  )
);

watchEffect(() => {
  if (currentPage.value > availablePages.value) currentPage.value = 1;
});
</script>

<template>
  <h1 class="title">Eisvana Census Table</h1>

  <div class="layout-table">
    <div class="top-row">
      <p>Census count: {{ currentRevisionCensusCount }}</p>
      <div>
        <input
          v-model.trim="searchTerm"
          aria-label="Search Name"
          type="search"
        />
      </div>
      <div>
        <select
          v-model.trim="revision"
          aria-label="Select Revision"
        >
          <option value="">All</option>
          <option
            v-for="revision in availableRevisions"
            :value="revision"
          >
            {{ revision }}
          </option>
        </select>
      </div>
    </div>

    <hr />

    <div class="page-select">
      <button
        v-for="n in availablePages"
        :class="{ outline: currentPage !== n }"
        role="button"
        @click="currentPage = n"
      >
        {{ n }}
      </button>
    </div>

    <Transition>
      <div
        class="census-items"
        v-if="censusData.length"
      >
        <CensusItem
          v-for="entry in paginatedEntries"
          :entry
          :key="entry.CensusPlayer"
        />
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.layout-table {
  display: flex;
  flex-direction: column;

  .top-row {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    align-items: center;

    * {
      margin: 0;
    }
  }

  .page-select {
    display: flex;
    gap: 0.5rem;
    margin-block-end: 1rem;

    button {
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .census-items {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
}

.v-enter-active {
  transition:
    opacity 0.5s ease-out,
    translate 0.5s ease-out;
}

.v-enter-from {
  opacity: 0;
  translate: 0 30px;
}
</style>
