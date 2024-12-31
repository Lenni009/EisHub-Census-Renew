<script setup lang="ts">
import { computed, ref } from 'vue';
import UserRow from './UserRow.vue';
import Pagination from '../Pagination.vue';
import { storeToRefs } from 'pinia';
import { useCensusDataStore } from '@/stores/censusDataStore';
import { renewPageSize } from '@/variables/paginationData';
import type { CensusEntry } from '@/types/censusQueryResponse';

const props = defineProps<{
  filter: string;
}>();

const censusDataStore = useCensusDataStore();
const { censusData } = storeToRefs(censusDataStore);

const paginatedEntries = ref<CensusEntry[]>([]);

const filteredCensusData = computed(() =>
  censusData.value.filter((item) => item.CensusPlayer.toLowerCase().includes(props.filter.toLowerCase()))
);

const updateEntries = (newPaginatedArray: CensusEntry[]) => (paginatedEntries.value = newPaginatedArray);
</script>

<template>
  <template v-if="censusData.length">
    <Pagination
      :data="filteredCensusData"
      :page-size="renewPageSize"
      @change="updateEntries"
    />

    <div class="table">
      <UserRow
        v-for="dataObj in paginatedEntries"
        :key="dataObj.CensusPlayer"
        :user-object="dataObj"
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

<style scoped>
.table {
  display: grid;
  grid-template-columns: repeat(2, auto);
  align-items: center;
  gap: 1rem;
}

.register-cta {
  text-align: center;
  font-size: 1.5rem;
}
</style>
