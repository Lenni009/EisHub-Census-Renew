<script setup lang="ts">
import { useWikiPageDataStore } from '@/stores/wikiPageDataStore';
import { storeToRefs } from 'pinia';
import MultipleChoice from './MultipleChoice.vue';
import GlyphInput from './GlyphInput.vue';
import { reactive, toRefs } from 'vue';
import { isUpdatingPage } from '@/variables/formMode';
import { platforms, modes } from '@/variables/saveData';
import Gallery from './Gallery.vue';

const wikiPageData = useWikiPageDataStore();
const { baseData, imageData, isAxesValid, sectionData } = storeToRefs(wikiPageData);
const { landingpad, terminal, geobay, farm, racetrack, arena } = toRefs(baseData.value);
const { image } = toRefs(imageData.value);

const featureList = reactive([
  {
    label: 'Landing Pad',
    value: landingpad,
  },
  {
    label: 'Trade Terminal',
    value: terminal,
  },
  {
    label: 'Geobay',
    value: geobay,
  },
  {
    label: 'Farm',
    value: farm,
  },
  {
    label: 'Racetrack',
    value: racetrack,
  },
  {
    label: 'Arena',
    value: arena,
  },
]);

function uploadMainFile(e: Event) {
  const { target } = e;
  if (!(target instanceof HTMLInputElement)) return;
  image.value = target.files?.[0] ?? null; // target.files could be null, and since optional chaining returns undefined, we have to specify null as fallback ourselves. The image variable can also take null as value.
}
</script>

<template>
  <article>
    <p class="question required">What is the name of your base?</p>
    <input
      v-model.trim="baseData.baseName"
      type="text"
    />
  </article>
  <template v-if="!isUpdatingPage">
    <article>
      <p class="question required">What is the name of the system where your base is?</p>
      <p class="subtitle">The name of the system can be seen by looking at the galaxy map in space.</p>
      <input
        v-model.trim="baseData.system"
        type="text"
      />
    </article>
    <article>
      <p class="question required">
        What is the name of the planet on which your base is or that is orbited by the moon on which your base is?
      </p>
      <input
        v-model.trim="baseData.planet"
        type="text"
      />
    </article>
    <article>
      <p class="question">If your base is on a moon (else leave empty): What is the name of the moon?</p>
      <input
        v-model.trim="baseData.moon"
        type="text"
      />
    </article>
    <article>
      <p class="question required">What are the planetary coordinates of your base?</p>
      <p class="subtitle">You can find the coordinates when you look through your visor. Example: -14.24, +121.12</p>
      <input
        v-model.trim.lazy="baseData.axes"
        :aria-invalid="!isAxesValid || undefined"
        type="text"
      />
      <p
        v-if="!isAxesValid"
        class="error"
      >
        Please give the coordinates like in the example above, including + and -
      </p>
    </article>
    <article>
      <p class="question required">What are the glyphs?</p>
      <p class="subtitle">Glyphs can be found in photo mode</p>
      <GlyphInput v-model.trim="baseData.glyphs" />
    </article>
  </template>
  <article>
    <p class="question">Base Features: Check all that apply:</p>
    <div class="checkboxes">
      <label v-for="feature in featureList">
        <input
          v-model.trim="feature.value"
          type="checkbox"
        />
        <span>{{ feature.label }}</span>
      </label>
    </div>
  </article>
  <template v-if="!isUpdatingPage">
    <article>
      <p class="question required">On which platform was the base built?</p>
      <MultipleChoice
        v-model.trim="baseData.platform"
        :items="platforms"
        name="platform"
      />
    </article>
    <article>
      <p class="question required">On which Game Mode was the base built?</p>
      <MultipleChoice
        v-model.trim="baseData.mode"
        :items="modes"
        name="mode"
      />
    </article>
  </template>
  <article>
    <p class="question">What type of base is it? What is its purpose?</p>
    <p class="subtitle">Some examples are Artistic, Embassy, Farm, Industrial, Memorial and Residential.</p>
    <input
      v-model.trim="baseData.type"
      type="text"
    />
  </article>
  <article
    v-for="item in sectionData"
    :key="item.heading"
  >
    <p
      :class="{ required: item.required }"
      class="question"
    >
      {{ item.heading }}
    </p>
    <p
      v-if="item.explanation"
      class="subtitle"
    >
      {{ item.explanation }}
    </p>
    <textarea v-model.trim="item.body"></textarea>
  </article>
  <article>
    <p class="question">Main picture</p>
    <p class="subtitle">Picture clearly showing the entire base</p>
    <input
      accept="image/*"
      type="file"
      @change="uploadMainFile"
    />
  </article>
  <article>
    <p class="question">Gallery</p>
    <p class="subtitle">Other pictures</p>
    <Gallery />
  </article>
</template>

<style scoped lang="scss">
.checkboxes {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

@media (width < 576px) {
  .checkboxes {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
}
</style>
