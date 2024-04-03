<script setup lang="ts">
import { isUpdatingPage, isMakingNewPage, isNewCitizen } from '@/variables/formMode';
// import { parseTemplate } from '@/helpers/wikiTemplateParser';
// import { useWikiPageDataStore } from '@/stores/wikiPageDataStore';
// import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import BaseForm from '@/components/form/BaseForm.vue';
import UpdateBase from '@/components/form/UpdateBase.vue';
import { submitCensus } from '@/helpers/censusSubmission';
import { useWikiPageDataStore } from '@/stores/wikiPageDataStore';
import { useFormValidation } from '@/composables/useFormValidation';
import type { CensusEntry } from '@/types/censusQueryResponse';
import { buildWikiEditLink } from '@/helpers/wikiLinkConstructor';
// import { onMounted } from 'vue';

const { isAllDataValid, allMissingProps, isPageOneValid, missingPageOneProps } = useFormValidation();
const hash = ref(window.location.hash);

if (hash.value && !isPageOneValid.value) window.location.hash = '';

addEventListener('hashchange', () => (hash.value = window.location.hash));

const page = computed(() => (hash.value === '#2' && isPageOneValid.value ? 2 : 1));

const isSending = ref(false);

const localStorageKeyIsNotNew = isMakingNewPage ? 'newBase' : 'updateBase';
const localStorageKey = isNewCitizen ? 'censusForm' : localStorageKeyIsNotNew;

// const localStorageCensusData = localStorage.getItem('censusForm');

// const wikiPageData = useWikiPageDataStore();
// const { sectionData, pageName } = storeToRefs(wikiPageData);

// pageName.value = 'Eisvana Research Outpost';

// if (isUpdatingPage || isMakingNewPage) wikiPageData.fetchWikiText();
// wikiPageData.fetchWikiText();

// onMounted(async () => {
//   const data = await fetch(
//     'https://nomanssky.fandom.com/api.php?action=parse&format=json&origin=*&page=Eisvana%20Research%20Outpost&prop=sections%7Cwikitext&section=0'
//   );
//   const jsonData = await data.json();
//   console.log(jsonData)
//   parseTemplate(jsonData.parse.wikitext['*']);
// });

async function sendForm() {
  isSending.value = true;
  const wikiPageDataStore = useWikiPageDataStore();
  const sessionStorageItem = sessionStorage.getItem('update');
  const sessionStorageData: CensusEntry = JSON.parse(sessionStorageItem ?? '{}');
  const oldBaseName = sessionStorageData.Name;
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
  isSending.value = false;
}

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
  </form>

  <!--
<article
    v-for="section in sectionData"
    :key="section.name"
  >
    <label :for="section.name">
      <span>{{ section.name }}</span>
      <span :aria-busy="section.loading"></span>
    </label>
    <textarea
      :id="section.name"
      v-model="section.text"
    ></textarea>
  </article> -->
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
