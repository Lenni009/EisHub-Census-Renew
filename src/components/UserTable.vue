<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import UserRow from './UserRow.vue';
import type { CensusEntry } from '@/types/query';
import { storeToRefs } from 'pinia';
import { useCensusDataStore } from '@/stores/censusDataStore';

const props = defineProps<{
  filter: string;
}>();

const censusDataStore = useCensusDataStore();
const { censusData } = storeToRefs(censusDataStore);

const emit = defineEmits<(e: 'exceeded') => void>();

const renewalRevision = new Date().getUTCFullYear().toString();
const maximumAllowedTries = 3;
const tries = ref(getLocalStorageAmount());
const triesExceeded = computed(() => tries.value >= maximumAllowedTries);

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
  <template v-if="censusData.length && !triesExceeded">
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
