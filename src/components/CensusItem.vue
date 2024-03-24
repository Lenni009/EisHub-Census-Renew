<script setup lang="ts">
import type { CensusEntry } from '@/types/query';
import LinkItem from './LinkItem.vue';

defineProps<{
  entry: CensusEntry;
}>();
</script>

<template>
  <article class="census-item">
    <p class="player-name">{{ entry.CensusPlayer }}</p>
    <div class="table-items">
      <div
        v-if="entry.CensusDiscord"
        class="item-group"
      >
        <div class="heading">Discord:</div>
        <div>{{ entry.CensusDiscord }}</div>
      </div>
      <div
        v-if="entry.CensusReddit"
        class="item-group"
      >
        <div class="heading">Social Media:</div>
        <div class="link is-social">
          <LinkItem :wikitext="entry.CensusReddit" />
        </div>
      </div>
      <div
        v-if="entry.CensusFriend"
        class="item-group"
      >
        <div class="heading">Friend Code:</div>
        <div>{{ entry.CensusFriend }}</div>
      </div>
      <div class="item-group">
        <div class="heading">Base:</div>
        <div class="link">
          <LinkItem :wikitext="entry.Name" />
        </div>
      </div>
    </div>

    <div class="action-buttons">
      <button>Renew</button>
      <button data-tooltip="New Census Base">Update</button>
    </div>
  </article>
</template>

<style scoped lang="scss">
.census-item {
  width: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-width: 450px;
  gap: 0.75rem;

  .table-items {
    // display: grid;
    // grid-template-columns: repeat(2, auto);
    gap: 0.5rem 1rem;
    display: flex;
    flex-wrap: wrap;

    & > * {
      flex-grow: 1;
      flex-shrink: 1;
      width: 40%;
    }

    .heading {
      font-weight: bold;
      white-space: nowrap;
    }

    .link {
      // max-width: 300px;
      text-wrap: balance;
      overflow-wrap: anywhere;
    }
  }

  .action-buttons {
    display: flex;
    gap: 0.5rem;
    justify-content: space-between;
  }

  .player-name {
    text-align: center;
    font-weight: bold;
    margin: 0;
  }
}
</style>
