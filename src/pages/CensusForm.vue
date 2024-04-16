<script setup lang="ts">
import { isMakingNewPage, isNewCitizen, isUpdatingPage } from '@/variables/formMode';
import { onMounted, computed, ref } from 'vue';
import BaseForm from '@/components/form/BaseForm.vue';
import { submitCensus } from '@/helpers/censusSubmission';
import { useWikiPageDataStore } from '@/stores/wikiPageDataStore';
import { useFormValidation } from '@/composables/useFormValidation';
import type { CensusEntry } from '@/types/censusQueryResponse';
import { buildWikiEditLink } from '@/helpers/wikiLinkConstructor';
import { delay } from '@/variables/delay';
import { fileReplacer } from '@/helpers/localStorage';

const { isAllDataValid, allMissingProps, isPageOneValid, missingPageOneProps } = useFormValidation();
const hash = ref(window.location.hash);

const wikiPageDataStore = useWikiPageDataStore();

if (hash.value && !isPageOneValid.value) window.location.hash = '';

addEventListener('hashchange', () => (hash.value = window.location.hash));

const page = computed(() => (hash.value === '#2' && isPageOneValid.value ? 2 : 1));

const hasUpdated = ref(false);
const isSending = ref(false);
const isFailed = ref(false);
const isSuccess = ref(false);

const localStorageKeyIsNotNew = isMakingNewPage ? 'newBase' : 'updateBase';
const localStorageKey = isNewCitizen ? 'censusForm' : localStorageKeyIsNotNew;

onMounted(async () => {
  wikiPageDataStore.fetchVersionTemplate();
  if (!isUpdatingPage) return;
  await wikiPageDataStore.fetchBaseWikiData();
  wikiPageDataStore.$subscribe(() => (hasUpdated.value ||= true));
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
  try {
    await submitCensus(message);
    wikiPageDataStore.resetStore();
    localStorage.removeItem('censusForm');
    localStorage.removeItem('updateBase');
    localStorage.removeItem('newBase');
    localStorage.removeItem('lastUpdated');
    sessionStorage.removeItem('update');
    isSuccess.value = true;
  } catch (e) {
    isFailed.value = true;
    console.error('Something went wrong:', e);
  } finally {
    isSending.value = false;
    setTimeout(() => {
      isFailed.value = false;
    }, delay);
  }
}

function scrollToTop() {
  if (isPageOneValid.value) scrollTo(0, 0);
}

const buttonText = computed(() => {
  if (isSending.value) return '';
  if (isFailed.value) return 'Failed!';
  return 'Submit';
});

// persist the whole state to the local storage whenever it changes
wikiPageDataStore.$subscribe((_, state) => {
  localStorage.setItem(localStorageKey, JSON.stringify(state, fileReplacer));
  localStorage.setItem('lastUpdated', Date.now().toString());
});
</script>

<template>
  <h1 class="title">Eisvana Census Form</h1>
  <form
    class="questions"
    @submit.prevent="sendForm"
  >
    <template v-if="!isSuccess">
      <BaseForm :page />

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
          <a
            class="secondary"
            href="#"
            role="button"
            >Back</a
          >
          <button
            :aria-busy="isSending"
            :class="{ 'is-danger': isFailed }"
            :disabled="!isAllDataValid || (isUpdatingPage && !hasUpdated)"
            class="submit-button"
            type="submit"
          >
            {{ buttonText }}
          </button>
          <p v-if="allMissingProps.length">Missing Data: {{ allMissingProps.join(', ') }}</p>
        </template>
      </div>
    </template>

    <article v-else-if="isNewCitizen">
      <header class="thank-you-wrapper">
        <p class="text-bold thank-you">Thank you for registering!</p>
      </header>
      <p>
        We're excited to have you join us in Eisvana!<br />We'll let you know when your submission has been processed.
      </p>
      <p>If you want to learn more about Eisvana, <a href="https://eisvana.com/">Visit our website</a>!</p>
    </article>

    <article v-else>
      <header class="thank-you-wrapper">
        <p class="text-bold thank-you">Thank you for updating your census entry!</p>
      </header>
      <p>We'll let you know when your submission has been processed.</p>
      <p>You can now close this window.</p>
    </article>
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

button.submit-button[type='submit'] {
  width: auto;
  margin: 0;
  margin-inline-start: 0.5rem;
}

.thank-you-wrapper {
  background-color: green;

  .thank-you {
    color: white;
    margin: 0;
  }
}
</style>
