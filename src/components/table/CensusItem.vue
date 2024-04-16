<script setup lang="ts">
import type { CensusEntry } from '@/types/censusQueryResponse';
import { encodePlayerName } from '@/helpers/nameTranscode';
import LinkItem from './LinkItem.vue';
import { computed, ref } from 'vue';
import RenewButton from '../RenewButton.vue';
import NewBaseButton from './NewBaseButton.vue';
import ChangeCensusBase from './ChangeCensusBase.vue';
import { currentYearString } from '@/variables/dateTime';
import { useRenewDataStore } from '@/stores/renewDataStore';
import { storeToRefs } from 'pinia';
import { storeEntry } from '@/helpers/localStorage';
import { blurActiveElement } from '@/helpers/domHelpers';
import { localStorageRequestKey } from '@/variables/localStorage';

const props = defineProps<{
  entry: CensusEntry;
}>();

const localStorageString = localStorage.getItem(localStorageRequestKey) ?? '{}';
const localStorageData: Record<string, string> = JSON.parse(localStorageString);

const requestedBase = ref(localStorageData[props.entry.CensusPlayer]);
if (requestedBase.value === props.entry.Name) {
  delete localStorageData[props.entry.CensusPlayer];
  localStorage.setItem(localStorageRequestKey, JSON.stringify(localStorageData));
}

const changeBaseModal = ref<HTMLDialogElement | null>(null);
const modalShown = ref(false);

const renewDataStore = useRenewDataStore();
const { triesExceeded } = storeToRefs(renewDataStore);

const tooltipText = computed(() => {
  if (props.entry.renewed) return 'Already renewed';
  if (props.entry.renewRequested) return 'Renewal Requested';
  if (triesExceeded.value) return 'Too Many Requests';
  return `Request Renewal for ${currentYearString}`;
});

const openModal = () => {
  blurActiveElement();
  modalShown.value = true;
  changeBaseModal.value?.showModal();
};
const closeModal = () => {
  changeBaseModal.value?.close();
  modalShown.value = false;
};

const playerBases = ref<string[]>();
const setPlayerBases = (items: string[]) => (playerBases.value = items);

function requestBaseChange(requested: string) {
  requestedBase.value = requested;
  localStorageData[props.entry.CensusPlayer] = requested;
  localStorage.setItem(localStorageRequestKey, JSON.stringify(localStorageData));
}
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

    <details>
      <summary role="button">Actions</summary>
      <article class="action-buttons">
        <RenewButton
          :user-object="entry"
          :data-tooltip="tooltipText"
          button-text="Renew"
          button-text-failed="Failed!"
          button-text-success="Renewed!"
        />
        <button
          data-tooltip="Change Census Base"
          type="button"
          @click="openModal"
        >
          Change
        </button>
        <a
          :href="`./form.html?update=${encodePlayerName(entry.CensusPlayer)}`"
          data-tooltip="Update Census Base"
          role="button"
          @click="storeEntry(entry)"
          >Update</a
        >
        <NewBaseButton
          :entry
          data-tooltip="New Census Base"
          text="New"
        />
      </article>
    </details>
  </article>
  <dialog
    ref="changeBaseModal"
    @click.self="closeModal"
  >
    <ChangeCensusBase
      v-if="modalShown"
      :entry
      :items="playerBases"
      :requested="requestedBase"
      @close="closeModal"
      @ready="setPlayerBases"
      @submit="requestBaseChange"
    />
  </dialog>
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
    margin-block-end: auto;

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

  details {
    container-type: inline-size;

    &,
    summary {
      margin: 0;
    }

    .action-buttons {
      position: absolute;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(max(45%, 100px), 1fr));
      gap: 0.5rem;
      margin-block-start: 0.6rem;
      width: 100cqw;

      > * {
        margin: 0;
        width: 100%;
        flex-grow: 1;
      }

      [data-tooltip]:not(button) {
        border: none;

        &:has([disabled]) {
          cursor: not-allowed;
        }
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
