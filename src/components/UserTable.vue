<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue';
import UserRow from './UserRow.vue';
import type { CensusEntry, QueryEntry } from '@/types/query';

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
  where: `CensusShow IS NOT NULL AND Civilized="${civilized}"`,
  order_by: 'CensusRenewal',
};

const censusQuery = `${apiPath}?${Object.entries(query)
  .map((param) => param.join('='))
  .join('&')}`;

const renewalRevision = new Date().getUTCFullYear().toString();
const censusData = ref<CensusEntry[]>([]);
const requestFailed = ref(false);
const maximumAllowedTries = 3;
const tries = ref(getLocalStorageAmount());
const triesExceeded = computed(() => tries.value >= maximumAllowedTries);

onMounted(async () => {
  if (triesExceeded.value) return;
  try {
    const res = await fetch(censusQuery);
    const data = await res.json();
    censusData.value = data.cargoquery.map(({ title: item }: QueryEntry) => ({
      Name: item.Name,
      CensusPlayer: item.CensusPlayer,
      CensusRenewal: item.CensusRenewal.split(',')?.map((item) => item.trim()) ?? [],
    }));
  } catch (e) {
    console.warn(e);
    requestFailed.value = true;
  }
});

const isRequested = (dataObj: CensusEntry) => getLocalStorageSet().has(dataObj.CensusPlayer);

const filteredCensusData = computed(() =>
  censusData.value.filter((item) => item.CensusPlayer.toLowerCase().includes(props.filter.toLowerCase()))
);

function getLocalStorageData(): { requested: string[]; amount: number } {
  const localStorageDataString = localStorage.getItem(renewalRevision) ?? '{"requested": [], "amount": 0}';
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
  localStorage.setItem(renewalRevision, localStorageDataString);
}

watchEffect(() => {
  if (triesExceeded.value) emit('exceeded');
});
</script>

<template>
  <template v-if="censusData.length">
    <div class="table">
      <UserRow
        v-for="dataObj in filteredCensusData"
        :already-requested="isRequested(dataObj)"
        :renewal-revision="renewalRevision"
        :key="dataObj.CensusPlayer"
        :tries="tries"
        :user-object="dataObj"
        @renew="incrementData"
      />
    </div>
    <div
      v-if="!filteredCensusData.length"
      class="register-cta"
    >
      Not on the census?<br /><a href="./form.html">Register now!</a>
    </div>
  </template>
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

.register-cta {
  text-align: center;
  font-size: 1.5rem;
}
</style>
