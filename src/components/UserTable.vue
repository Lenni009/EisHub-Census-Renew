<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue';
import UserRow from './UserRow.vue';
import { type QueryEntry } from '@/types/query';

const props = defineProps<{
  filter: string;
}>();

const emit = defineEmits(['exceeded']);

const apiPath = 'https://nomanssky.fandom.com/api.php';
const civilized = 'Eisvana';
const query = {
  action: 'cargoquery',
  format: 'json',
  origin: '*',
  limit: '500',
  tables: 'Bases',
  fields: ['Name', 'CensusPlayer', 'CensusRenewal'],
  civilized,
  where: `CensusShow IS NOT NULL AND Civilized="${civilized}"`,
  orderBy: 'CensusRenewal',
};

const censusQuery = `${apiPath}?${Object.entries(query)
  .map((param) => param.join('='))
  .join('&')}`;

const currentYear = new Date().getUTCFullYear().toString();
const censusData = ref<QueryEntry[]>([]);
const requestFailed = ref(false);
const tries = ref(getLocalStorageAmount());

onMounted(async () => {
  try {
    const res = await fetch(censusQuery);
    const data = await res.json();
    censusData.value = data.cargoquery;
  } catch (e) {
    console.warn(e);
    requestFailed.value = true;
  }
});

const filteredCensusData = computed(() =>
  censusData.value.filter((item) => item.title.CensusPlayer.toLowerCase().includes(props.filter.toLowerCase()))
);

function getLocalStorageData(): { requested: string[]; amount: number } {
  const localStorageDataString = localStorage.getItem(currentYear) ?? '{"requested": [], "amount": 0}';
  return JSON.parse(localStorageDataString);
}

function getLocalStorageSet(): Set<string> {
  const localStorageData = getLocalStorageData();
  if (!Array.isArray(localStorageData.requested)) return new Set();
  return new Set(localStorageData.requested);
}

function getLocalStorageAmount(): number {
  const localStorageData = getLocalStorageData();
  return typeof localStorageData.amount === 'number' ? localStorageData.amount : 0;
}

function incrementData(userName: string) {
  tries.value++;
  const localStorageData = getLocalStorageData();
  const localStorageDataSet = getLocalStorageSet();
  localStorageDataSet.add(userName);
  const localStorageArray = Array.from(localStorageDataSet);
  localStorageData.requested = localStorageArray;
  localStorageData.amount = tries.value;
  const localStorageDataString = JSON.stringify(localStorageData);
  localStorage.setItem(currentYear, localStorageDataString);
}

watchEffect(() => {
  if (tries.value >= 3) emit('exceeded');
});
</script>

<template>
  <div
    v-if="censusData.length"
    class="table"
  >
    <UserRow
      v-for="dataObj in filteredCensusData"
      :already-requested="getLocalStorageSet().has(dataObj.title.CensusPlayer)"
      :current-year="currentYear"
      :key="dataObj.title.CensusPlayer"
      :tries="tries"
      :user-object="dataObj"
      @renew="incrementData"
    />
  </div>

  <div
    v-else-if="!requestFailed"
    aria-busy="true"
  ></div>

  <div v-else>Something went wrong :/</div>
</template>

<style lang="scss">
.table {
  display: grid;
  grid-template-columns: repeat(2, auto);
  align-items: center;
}
</style>
