<script setup lang="ts">
import { useCensusDataStore } from '@/stores/censusDataStore';
import { storeToRefs } from 'pinia';
// import { parseUserLink } from '../helpers/wikitextParser';
import { computed, ref } from 'vue';
// import { wikiLink } from '../variables/wikiLink';
import CensusItem from '../components/CensusItem.vue';

const censusDataStore = useCensusDataStore();
const { censusData, availableRevisions } = storeToRefs(censusDataStore);

const revision = ref('');

const filteredEntries = computed(() =>
  revision.value ? censusData.value.filter((item) => item.CensusRenewal.includes(revision.value)) : censusData.value
);
const filteredCensusCount = computed(() => filteredEntries.value.length);
</script>

<template>
  <h1 class="title">Eisvana Census Table</h1>

  <div class="layout-table">
    <div class="top-row">
      <p>Census count: {{ filteredCensusCount }}</p>
      <div>
        <select v-model="revision">
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

    <div class="census-items">
      <CensusItem
        v-for="entry in filteredEntries"
        :entry
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.title {
  text-align: center;
}

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
}

.census-items {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
</style>
