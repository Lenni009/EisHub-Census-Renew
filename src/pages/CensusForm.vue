<script setup lang="ts">
import { isMakingNewPage, isNewCitizen, isUpdatingPage } from '@/variables/formMode';
import { onMounted, computed, ref } from 'vue';
import BaseForm from '@/components/form/BaseForm.vue';
import { submitCensus } from '@/helpers/censusSubmission';
import { useWikiPageDataStore } from '@/stores/wikiPageDataStore';
import { useFormValidation } from '@/composables/useFormValidation';
import type { CensusEntry } from '@/types/censusQueryResponse';
import { buildWikiEditLink } from '@/helpers/wikiLinkConstructor';

const { isAllDataValid, allMissingProps, isPageOneValid, missingPageOneProps } = useFormValidation();
const hash = ref(window.location.hash);

const wikiPageDataStore = useWikiPageDataStore();

if (hash.value && !isPageOneValid.value) window.location.hash = '';

addEventListener('hashchange', () => (hash.value = window.location.hash));

const page = computed(() => (hash.value === '#2' && isPageOneValid.value ? 2 : 1));

const isSending = ref(false);
const successDialog = ref<HTMLDialogElement | null>(null);

const localStorageKeyIsNotNew = isMakingNewPage ? 'newBase' : 'updateBase';
const localStorageKey = isNewCitizen ? 'censusForm' : localStorageKeyIsNotNew;

onMounted(() => {
  if (!isUpdatingPage) return;
  wikiPageDataStore.fetchBaseWikiData();
});

async function sendForm() {
  isSending.value = true;
  const sessionStorageItem = sessionStorage.getItem('update');
  const sessionStorageData: CensusEntry = JSON.parse(sessionStorageItem ?? '{}');
  const oldBaseName = sessionStorageData.Name ?? '';
  const messageExistingCitizen = isMakingNewPage
    ? `New Page for existing citizen. Old page: ${buildWikiEditLink(oldBaseName)}`
    : 'Updated Base Page';
  const message = isNewCitizen ? 'New Citizen' : messageExistingCitizen;
  await submitCensus(message);
  wikiPageDataStore.resetStore();
  localStorage.removeItem('censusForm');
  localStorage.removeItem('updateBase');
  localStorage.removeItem('newBase');
  localStorage.removeItem('lastUpdated');
  sessionStorage.removeItem('update');
  window.location.hash = '';
  isSending.value = false;
  successDialog.value?.showModal();
}

const closeModal = () => successDialog.value?.close();

function scrollToTop() {
  if (isPageOneValid.value) scrollTo(0, 0);
}
</script>

<template>
  <h1 class="title">Eisvana Census Form</h1>
  <form
    class="questions"
    @submit.prevent="sendForm"
  >
    <BaseForm
      :local-storage-key
      :page
    />

    <div>
      <template v-if="page === 1">
        <a
          :href="isPageOneValid ? '#2' : undefined"
          :aria-disabled="!isPageOneValid"
          role="button"
          @click="scrollToTop"
        >
          Continue
        </a>
        <p v-if="missingPageOneProps.length">Missing Data: {{ missingPageOneProps.join(', ') }}</p>
      </template>
      <template v-if="page === 2">
        <button
          :aria-busy="isSending"
          :disabled="!isAllDataValid"
        >
          {{ isSending ? '' : 'Submit' }}
        </button>
        <p v-if="allMissingProps.length">Missing Data: {{ allMissingProps.join(', ') }}</p>
      </template>
    </div>

    <dialog
      ref="successDialog"
      @click.self="closeModal"
    >
      <article>
        <header>
          <form method="dialog">
            <button
              aria-label="Close"
              class="close"
            ></button>
          </form>
          <p class="text-bold">Thank you for registering!</p>
        </header>
        <p>
          We're excited to have you join us in Eisvana!<br />We'll let you know when your submission has been processed.
        </p>
      </article>
    </dialog>
  </form>
</template>

<style lang="scss">
a:not([href]) {
  opacity: 0.5;
  pointer-events: none;
}

.questions {
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin-inline: auto;

  article {
    container-type: inline-size;
  }

  label {
    display: flex;
    align-items: end;
    gap: 0.5rem;
  }

  .question {
    font-weight: bold;
    margin-block-end: 0.5rem;

    &.required::after {
      content: '*';
      color: red;
      margin-inline-start: 0.25rem;
    }

    &:only-child {
      margin: 0;
    }
  }

  [type='checkbox'] {
    margin: 0;
    aspect-ratio: 1;
  }

  .subtitle {
    font-size: large;
  }

  .error {
    color: crimson;
    font-size: smaller;
    margin: 0;
  }
}
</style>
