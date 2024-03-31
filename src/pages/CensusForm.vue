<script setup lang="ts">
import { isUpdating, isNewPage } from '@/helpers/censusForm';
// import { parseTemplate } from '@/helpers/wikiTemplateParser';
// import { useWikiPageDataStore } from '@/stores/wikiPageDataStore';
// import { storeToRefs } from 'pinia';
import { computed, ref, type Component } from 'vue';
import PlayerData from '@/components/form/PlayerData.vue';
import BaseData from '@/components/form/BaseData.vue';
import { submitCensus } from '@/helpers/censusSubmission';
import { useWikiPageDataStore } from '@/stores/wikiPageDataStore';
import { useFormValidation } from '@/composables/useFormValidation';
// import { onMounted } from 'vue';

const isUpdatingPage = isUpdating();
const isMakingNewPage = isNewPage();

const skipVerification = isUpdatingPage || isMakingNewPage;

const hasPageOneCompleted = ref(false);
const hash = ref(window.location.hash);

if (hash.value && !hasPageOneCompleted.value) window.location.hash = '';

onhashchange = () => (hash.value = window.location.hash);

const page = computed(() => ((hash.value === '#2' && hasPageOneCompleted.value) || skipVerification ? 2 : 1));

const isSending = ref(false);

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

const wikiPageDataStore = useWikiPageDataStore();

function replacer(key: string, value: unknown) {
  if (value instanceof File) return null;
  if (key === 'gallery') return [];
  return value;
}

// persist the whole state to the local storage whenever it changes
wikiPageDataStore.$subscribe((_, state) => {
  localStorage.setItem('censusForm', JSON.stringify(state, replacer));
});

async function sendForm() {
  isSending.value = true;
  await submitCensus();
  wikiPageDataStore.resetStore();
  isSending.value = false;
  localStorage.removeItem('censusForm');
}

function validateInputs() {
  hasPageOneCompleted.value = true;
  scrollTo(0, 0);
}

const router: Record<number, Component> = {
  1: PlayerData,
  2: BaseData,
};

const RenderComponent = computed(() => router[page.value]);

const { isDataValid } = useFormValidation();
</script>

<template>
  <h1 class="title">Eisvana Census Form</h1>
  <form
    class="questions"
    @submit.prevent="sendForm"
  >
    <RenderComponent />
    <div>
      <a
        v-if="page === 1"
        :href="hasPageOneCompleted ? '#2' : undefined"
        role="button"
        @click="validateInputs"
      >
        Continue
      </a>
      <button
        :disabled="!isDataValid"
        :aria-busy="isSending"
        v-if="page === 2"
      >
        {{ isSending ? '' : 'Submit' }}
      </button>
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
