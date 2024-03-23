<script setup lang="ts">
import { useRequestStore } from '@/stores/requestStore';
import { storeToRefs } from 'pinia';

const pageData = useRequestStore();
const { censusData, censusCount } = storeToRefs(pageData);
</script>

<template>
  <p>Census count: {{ censusCount }}</p>
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
    <div class="heading">Renew</div>
    <div class="heading">Update Census Base</div>
    <template v-for="entry in censusData">
      <div>{{ entry.CensusPlayer }}</div>
      <div>{{ entry.CensusReddit }}</div>
      <div>{{ entry.CensusDiscord }}</div>
      <div>{{ entry.CensusFriend }}</div>
      <div>{{ entry.Name }}</div>
      <div>{{ entry.System }}</div>
      <div>{{ entry.Platform }}</div>
      <div>{{ entry.Mode }}</div>
      <div>{{ entry.CensusArrival.toLocaleDateString() }}</div>
      <div>{{ entry.CensusRenewal.join(', ') }}</div>
      <div>{{ entry.GameRelease }}</div>
      <div><button>Renew</button></div>
      <div><a href="./form" role="button">Update Census Base</a></div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.census-table {
  display: grid;
  grid-template-columns: repeat(13, auto);
  gap: 0.5rem;

  .heading {
    font-weight: bold;
  }
}
</style>
