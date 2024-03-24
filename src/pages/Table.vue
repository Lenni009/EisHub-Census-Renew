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

    <!--
    <div class="census-table">
      <div class="heading">Player Name</div>
      <div class="heading">Social Media Link</div>
      <div class="heading">Discord Name</div>
      <div class="heading">Friend Code</div>
      <div class="heading">Home Base</div>
      <div class="heading">System</div>
      <div class="heading">Platform</div>
      <div class="heading">Game Mode</div>
      <div class="heading">Date of Arrival</div>
      <div class="heading">Renewed</div>
      <div class="heading">Release</div>
      <div class="heading">Renew Entry</div>
      <div class="heading">Update Base</div>
      <template v-for="entry in filteredEntries">
        <div>{{ entry.CensusPlayer }}</div>
        <div>
          <a
            :href="parseUserLink(entry.CensusReddit ?? '').link"
            rel="noopener noreferrer"
            target="_blank"
            >{{ parseUserLink(entry.CensusReddit ?? '').text }}</a
          >
        </div>
        <div>{{ entry.CensusDiscord }}</div>
        <div>{{ entry.CensusFriend }}</div>
        <div>
          <a
            :href="`${wikiLink}${entry.Name}`"
            rel="noopener noreferrer"
            target="_blank"
            >{{ entry.Name }}</a
          >
        </div>
        <div>{{ entry.System }}</div>
        <div>{{ entry.Platform }}</div>
        <div>{{ entry.Mode }}</div>
        <div>{{ entry.CensusArrival.toLocaleDateString() }}</div>
        <div>{{ entry.CensusRenewal.join(', ') }}</div>
        <div>{{ entry.GameRelease }}</div>
        <div><button>Renew</button></div>
        <div>
          <a
            href="./form"
            role="button"
            >Update</a
          >
        </div>
      </template>
    </div>-->
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

.census-table {
  display: grid;
  grid-template-columns: repeat(13, auto);
  gap: 0.5rem;
  overflow: auto;

  & * {
    border-block-end: 1px solid var(--pico-table-border-color);
  }

  .heading {
    font-weight: bold;
  }
}

.census-items {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;

}
</style>
