<script setup lang="ts">
import { computed } from 'vue';
import UserRow from './UserRow.vue';
import { storeToRefs } from 'pinia';
import { useCensusDataStore } from '@/stores/censusDataStore';

const props = defineProps<{
  filter: string;
}>();

const censusDataStore = useCensusDataStore();
const { censusData } = storeToRefs(censusDataStore);

const filteredCensusData = computed(() =>
  censusData.value.filter((item) => item.CensusPlayer.toLowerCase().includes(props.filter.toLowerCase()))
);
</script>

<template>
  <template v-if="censusData.length">
    <div class="table">
      <UserRow
        v-for="dataObj in filteredCensusData"
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

<style lang="scss">
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
