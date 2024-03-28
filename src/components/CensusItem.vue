<script setup lang="ts">
import type { CensusEntry } from '@/types/query';
import { encodePlayerName } from '@/helpers/nameTranscode';
import { getCurrentYear } from '@/helpers/date';
import LinkItem from './LinkItem.vue';
import { computed } from 'vue';

const props = defineProps<{
  entry: CensusEntry;
}>();

const currentYear = getCurrentYear();

function storeData() {
  sessionStorage.setItem('update', JSON.stringify(props.entry));
}

const isRenewed = computed(() => props.entry.CensusRenewal.includes(currentYear.toString()));
</script>

<template>
  <article class="census-item">
    <p class="player-name">{{ entry.CensusPlayer }}</p>
    <div class="table-items">
      <div v-if="entry.CensusDiscord">
        <div class="heading">Discord:</div>
        <div>{{ entry.CensusDiscord }}</div>
      </div>
      <div v-if="entry.CensusReddit">
        <div class="heading">Social Media:</div>
        <div class="link is-social">
          <LinkItem :wikitext="entry.CensusReddit" />
        </div>
      </div>
      <div v-if="entry.CensusFriend">
        <div class="heading">Friend Code:</div>
        <div>{{ entry.CensusFriend }}</div>
      </div>
      <div>
        <div class="heading">Base:</div>
        <div class="link">
          <LinkItem :wikitext="entry.Name" />
        </div>
      </div>
      <div>
        <div class="heading">System:</div>
        <div>{{ entry.System }}</div>
      </div>
      <div>
        <div class="heading">Platform:</div>
        <div>{{ entry.Platform }}</div>
      </div>
      <div>
        <div class="heading">Mode:</div>
        <div>{{ entry.Mode }}</div>
      </div>
      <div>
        <div class="heading">Arrival:</div>
        <div>{{ entry.CensusArrival.toLocaleDateString() }}</div>
      </div>
    </div>

    <div class="action-buttons">
      <div :data-tooltip="isRenewed ? `Already renewed!` : `Renew entry for ${currentYear}`">
        <button :disabled="isRenewed">Renew</button>
      </div>
      <a
        :href="`./form.html?update=${encodePlayerName(entry.CensusPlayer)}`"
        data-tooltip="Update Census Base"
        role="button"
        @click="storeData"
        >Update</a
      >
      <a
        :href="`./form.html?new=${encodePlayerName(entry.CensusPlayer)}`"
        data-tooltip="New Census Base"
        role="button"
        @click="storeData"
        >New</a
      >
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
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1rem;

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
      text-wrap: balance;
      overflow-wrap: anywhere;
    }
  }

  .action-buttons {
    display: flex;
    gap: 0.5rem;
    justify-content: space-around;

    [data-tooltip] {
      border: none;

      &:has([disabled]) {
        cursor: not-allowed;
      }
    }
  }

  .player-name {
    text-align: center;
    font-weight: bold;
    margin: 0;
  }
}
</style>
