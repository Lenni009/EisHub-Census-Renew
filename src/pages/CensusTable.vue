<script setup lang="ts">
import { useCensusDataStore } from '@/stores/censusDataStore';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref, watchEffect } from 'vue';
import CensusItem from '@/components/table/CensusItem.vue';
import type { CensusEntry } from '@/types/censusQueryResponse';
import { tablePageSize } from '@/variables/paginationData';
import Pagination from '../components/Pagination.vue';

const censusDataStore = useCensusDataStore();
const { censusData, availableRevisions } = storeToRefs(censusDataStore);

const revision = ref('');
const searchTerm = ref('');
const paginatedEntries = ref<CensusEntry[]>([]);
const paramRevision = ref<string | null>(null);

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);

  const searchParam = urlParams.get('name') ?? '';
  searchTerm.value = searchParam;
  const revParam = urlParams.get('rev');
  paramRevision.value = revParam;
});

watchEffect(() => (revision.value = paramRevision.value ?? availableRevisions.value[0]?.toString()));

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

const updateEntries = (newPaginatedArray: CensusEntry[]) => (paginatedEntries.value = newPaginatedArray);
</script>

<template>
  <h1 class="title">Eisvana Census Table</h1>

  <div class="layout-table">
    <div class="top-row">
      <p>Census count: {{ currentRevisionCensusCount }}</p>
      <search class="search-wrapper">
        <input
          v-model.trim="searchTerm"
          aria-label="Search Name"
          placeholder="Search Player"
          type="search"
        />
      </search>
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

    <Pagination
      :data="filteredEntries"
      :page-size="tablePageSize"
      @change="updateEntries"
    />

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

<style scoped>
.layout-table {
  display: flex;
  flex-direction: column;
  container-type: inline-size;

  .top-row {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    align-items: center;

    * {
      margin: 0;
    }
  }

  .census-items {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-block-end: 3rem;
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

@container (width < 600px) {
  .top-row {
    flex-wrap: wrap;

    .search-wrapper {
      order: 3;
      width: 100%;
    }
  }
}
</style>
