<script setup lang="ts">
import { useWikiPageDataStore } from '@/stores/wikiPageDataStore';
import { storeToRefs } from 'pinia';
import MultipleChoice from './MultipleChoice.vue';
import GlyphInput from './GlyphInput.vue';
import { reactive, toRefs } from 'vue';
import { isUpdatingPage } from '@/variables/formMode';
import { platforms, modes } from '@/variables/saveData';
import Gallery from './Gallery.vue';
import ImageInput from './ImageInput.vue';
import LoadingSpinner from '../LoadingSpinner.vue';

const wikiPageData = useWikiPageDataStore();
const { baseData, isAxesValid, sectionData } = storeToRefs(wikiPageData);
const { landingpad, terminal, geobay, farm, racetrack, arena } = toRefs(baseData.value);

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
</script>

<template>
  <article>
    <p
      class="question required"
      id="base-name"
    >
      What is the name of your base?
    </p>
    <input
      v-model.trim="baseData.baseName"
      aria-labelledby="base-name"
      type="text"
    />
  </article>
  <template v-if="!isUpdatingPage">
    <article>
      <p
        class="question required"
        id="system-name"
      >
        What is the name of the system where your base is?
      </p>
      <p class="subtitle">The name of the system can be seen by looking at the galaxy map in space.</p>
      <input
        v-model.trim="baseData.system"
        aria-labelledby="system-name"
        type="text"
      />
    </article>
    <article>
      <p
        class="question required"
        id="planet-name"
      >
        What is the name of the planet on which your base is or that is orbited by the moon on which your base is?
      </p>
      <input
        v-model.trim="baseData.planet"
        aria-labelledby="planet-name"
        type="text"
      />
    </article>
    <article>
      <p
        class="question"
        id="moon-name"
      >
        If your base is on a moon (else leave empty): What is the name of the moon?
      </p>
      <input
        v-model.trim="baseData.moon"
        aria-labelledby="moon-name"
        type="text"
      />
    </article>
    <article>
      <p
        class="question required"
        id="geo-coords"
      >
        What are the planetary coordinates of your base?
      </p>
      <p class="subtitle">You can find the coordinates when you look through your visor. Example: -14.24, +121.12</p>
      <input
        v-model.trim.lazy="baseData.axes"
        :aria-invalid="!isAxesValid || undefined"
        aria-labelledby="geo-coords"
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
      <p
        class="question required"
        id="glyph-input"
      >
        What are the glyphs?
      </p>
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
    <p
      class="question"
      id="base-type"
    >
      What type of base is it? What is its purpose?
    </p>
    <p class="subtitle">Some examples are Artistic, Embassy, Farm, Industrial, Memorial and Residential.</p>
    <input
      v-model.trim="baseData.type"
      aria-labelledby="base-type"
      type="text"
    />
  </article>
  <article
    v-for="item in sectionData"
    :key="item.heading"
  >
    <div class="async-section-title-wrapper">
      <p
        :class="{ required: item.required }"
        class="question"
      >
        {{ item.heading }}
      </p>
      <LoadingSpinner v-if="item.loading" />
    </div>
    <p
      v-if="item.explanation"
      class="subtitle"
    >
      {{ item.explanation }}
    </p>
    <textarea
      v-model.trim="item.body"
      :aria-label="item.heading"
    ></textarea>
  </article>
  <article>
    <p class="question required">Main picture</p>
    <p class="subtitle">Picture clearly showing the entire base</p>
    <ImageInput />
  </article>
  <article>
    <p class="question">Gallery</p>
    <p class="subtitle">Other pictures</p>
    <Gallery />
  </article>
</template>

<style scoped lang="css">
.async-section-title-wrapper {
  display: flex;
  gap: 0.5rem;
}

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
