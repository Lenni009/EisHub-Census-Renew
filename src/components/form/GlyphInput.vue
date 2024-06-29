<script setup lang="ts">
import { computed, watchEffect } from 'vue';
import { regions } from '@/variables/regions';
import { expectedGlyphLength } from '@/variables/formValidation';

const validGlyphsRegex = /[0-9A-F]/;

const model = defineModel({ type: String, required: true });

const isAddressInEisvana = computed(() => model.value.slice(4) in regions);

function addGlyph(glyph: string) {
  if (model.value.length < expectedGlyphLength) model.value += glyph; // NoSonar 12 is maximum glyph length
}

function deleteGlyph() {
  model.value = model.value.slice(0, -1);
}

watchEffect(
  () =>
    (model.value = model.value
      .toUpperCase()
      .split('')
      .filter((char) => validGlyphsRegex.test(char))
      .join(''))
);

const numberToGlyph = (n: number) => n.toString(16).toUpperCase(); // NoSonar this is dec to hex
</script>

<template>
  <div class="glyph-input">
    <div class="glyph-input-wrapper">
      <input
        v-model.trim="model"
        :aria-invalid="(model.length === expectedGlyphLength && !isAddressInEisvana) || undefined"
        :maxlength="expectedGlyphLength"
        aria-labelledby="glyph-input"
        class="glyphs-input"
        type="text"
      />
      <button
        class="delete-button is-danger"
        type="button"
        @click="deleteGlyph"
      >
        &larr; Delete
      </button>
    </div>
    <p
      v-if="model.length === expectedGlyphLength && !isAddressInEisvana"
      class="error"
    >
      Glyphs are outside of Eisvana space!
    </p>
    <div class="portal-buttons grid">
      <button
        v-for="n in 16"
        class="button glyphs"
        type="button"
        @click="addGlyph(numberToGlyph(n - 1))"
      >
        {{ numberToGlyph(n - 1) }}
      </button>
    </div>
    <p
      v-show="model"
      class="glyph-display-wrapper"
    >
      <output class="glyphs">{{ model }}</output>
    </p>
  </div>
</template>

<style scoped lang="scss">
.glyph-input {
  container-type: inline-size;

  .glyphs {
    font-family: NMS-Glyphs-Mono;
    font-size: 3rem;
    word-break: break-word;
    line-height: normal;
  }

  .glyph-display-wrapper {
    margin-block: 0.25rem 0;
  }

  .portal-buttons {
    display: grid;
    grid-template-columns: repeat(8, auto);
    max-width: 800px;

    .button {
      line-height: 3rem;
      padding: 0;
      margin: 0;
    }
  }

  @container (width < 700px) {
    .portal-buttons {
      display: flex;
      flex-wrap: wrap;

      .button {
        width: 4rem;
      }
    }
  }

  .glyph-input-wrapper {
    display: flex;
    flex-wrap: wrap;
    max-width: 800px;

    .delete-button {
      margin-inline-start: 0.5rem;
      width: auto;
    }

    .glyphs-input {
      flex-grow: 1;
      width: auto;
    }
  }

  .error {
    margin-block: -1rem 0.5rem;
    font-size: smaller;
    color: crimson;
  }
}
</style>
