<script setup lang="ts">
import type { CensusEntry } from '@/types/censusQueryResponse';
import { encodePlayerName } from '@/helpers/nameTranscode';
import LinkItem from './LinkItem.vue';
import { computed } from 'vue';
import RenewButton from '../RenewButton.vue';
import { currentYearString } from '@/variables/dateTime';
import { useRenewDataStore } from '@/stores/renewDataStore';
import { storeToRefs } from 'pinia';

const props = defineProps<{
  entry: CensusEntry;
}>();

const renewDataStore = useRenewDataStore();
const { triesExceeded } = storeToRefs(renewDataStore);

function storeData() {
  sessionStorage.setItem('update', JSON.stringify(props.entry));
}

const tooltipText = computed(() => {
  if (props.entry.renewed) return 'Already renewed';
  if (props.entry.renewRequested) return 'Renewal Requested';
  if (triesExceeded.value) return 'Too Many Requests';
  return `Request Renewal for ${currentYearString}`;
});
</script>

<template>
  <article class="census-item">
    <p class="player-name text-bold">{{ entry.CensusPlayer }}</p>
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
        <div class="friend-code">{{ entry.CensusFriend }}</div>
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
      <div :data-tooltip="tooltipText">
        <RenewButton
          :user-object="entry"
          button-text="Renew"
          button-text-failed="Failed!"
          button-text-success="Renewed!"
        />
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
  min-width: min(100%, 300px);
  transition: background-color var(--pico-transition), border-color var(--pico-transition);

  header,
  footer {
    text-align: center;
    transition: background-color var(--pico-transition), border-color var(--pico-transition);
  }

  p {
    text-wrap: balance;
    transition: background-color var(--pico-transition), border-color var(--pico-transition);
  }

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
    margin: 0;
  }

  .friend-code {
    font-family: consolas, monospace;
  }
}
</style>
@/variables/date
