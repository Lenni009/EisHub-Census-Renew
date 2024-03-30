<script setup lang="ts">
import { useWikiPageDataStore } from '@/stores/wikiPageDataStore';
import { storeToRefs } from 'pinia';
import MultipleChoice from './MultipleChoice.vue';
import GlyphInput from './GlyphInput.vue';
import { watchEffect, reactive } from 'vue';
import { regionArray } from '@/variables/regions';
import Gallery from './Gallery.vue';

const wikiPageData = useWikiPageDataStore();
const {
  platform,
  mode,
  baseName,
  region,
  glyphs,
  system,
  planet,
  moon,
  axes,
  arena,
  terminal,
  landingpad,
  geobay,
  farm,
  racetrack,
  type,
  layout,
  features,
  addInfo,
  image,
} = storeToRefs(wikiPageData);

watchEffect(() => (region.value = regionArray.find((item) => item[0] === glyphs.value.slice(4))?.[1] ?? ''));

const platforms: Record<string, string> = {
  PC: 'PC',
  PS: 'PlayStation',
  XB: 'Xbox',
  NS: 'Switch',
};

const modes: Record<string, string> = {
  Normal: 'Normal',
  Relaxed: 'Relaxed',
  Survival: 'Survival',
  Permadeath: 'Permadeath',
  Creative: 'Creative',
  Custom: 'Custom',
};

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
    <p class="question">What is the name of your base?</p>
    <input
      v-model="baseName"
      type="text"
    />
  </article>
  <article>
    <p class="question">What is the name of the system where your base is?</p>
    <p class="subtitle">The name of the system can be seen by looking at the galaxy map in space.</p>
    <input
      v-model="system"
      type="text"
    />
  </article>
  <article>
    <p class="question">
      What is the name of the planet on which your base is or that is orbited by the moon on which your base is?
    </p>
    <input
      v-model="planet"
      type="text"
    />
  </article>
  <article>
    <p class="question">If your base is on a moon (else leave empty): What is the name of the moon?</p>
    <input
      v-model="moon"
      type="text"
    />
  </article>
  <article>
    <p class="question">What are the planetary coordinates of your base?</p>
    <input
      v-model="axes"
      type="text"
    />
  </article>
  <article>
    <p class="question">What are the glyphs?</p>
    <p class="subtitle">Glyphs can be found in photo mode</p>
    <GlyphInput v-model="glyphs" />
  </article>
  <article>
    <p class="question">Base Features: Check all that apply</p>
    <div class="checkboxes">
      <label v-for="feature in featureList">
        <input
          v-model="feature.value"
          type="checkbox"
        />
        <span>{{ feature.label }}</span>
      </label>
    </div>
  </article>
  <article>
    <p class="question">What type of base do you have? What is its purpose?</p>
    <p class="subtitle">Some examples are Artistic, Embassy, Farm, Industrial, Memorial and Residential.</p>
    <input
      v-model="type"
      type="text"
    />
  </article>
  <article>
    <p class="question">On which platform was the base built?</p>
    <MultipleChoice
      v-model="platform"
      :items="platforms"
      name="platform"
    />
  </article>
  <article>
    <p class="question">On which Game Mode was the base built?</p>
    <MultipleChoice
      v-model="mode"
      :items="modes"
      name="mode"
    />
  </article>
  <article>
    <p class="question">Layout</p>
    <p class="subtitle">What does the base look like?</p>
    <textarea v-model="layout"></textarea>
  </article>
  <article>
    <p class="question">Features</p>
    <p class="subtitle">List the basic features, such as crops, biodomes, landing pads, exocraft bays, etc.</p>
    <textarea v-model="features"></textarea>
  </article>
  <article>
    <p class="question">Additional Information</p>
    <p class="subtitle">Any nearby resources, tourist traps, other bases</p>
    <textarea v-model="addInfo"></textarea>
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
