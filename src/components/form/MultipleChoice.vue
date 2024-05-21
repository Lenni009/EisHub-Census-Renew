<script setup lang="ts">
import { ref } from 'vue';
import { deselect } from '@/helpers/formHelpers';

defineProps<{
  items: Record<string, string>;
  name: string;
  other?: boolean;
}>();

const otherInput = ref<HTMLInputElement | null>(null);

const model = defineModel({ type: String });
const otherValue = ref('');

const onDeselect = (e: Event) => deselect(e, model);

const checkOther = () => (model.value = otherValue.value);

// this only triggers when the radio button is selected, not when it's deselected
const focusInput = () => otherInput.value?.focus();
</script>

<template>
  <div class="radio-select">
    <label
      v-for="(item, id) in items"
      :for="`${name}-${id}`"
      :key="id"
      class="multiple-choice-label"
    >
      <input
        v-model.trim="model"
        :id="`${name}-${id}`"
        :name
        :value="id"
        type="radio"
        @click="onDeselect"
      />
      <span>{{ item }}</span>
    </label>
    <div
      v-if="other"
      class="radio-select-item-other"
    >
      <label
        :for="`${name}-other`"
        class="other-input-label"
      >
        <input
          v-model.trim="model"
          :id="`${name}-other`"
          :name
          :value="otherValue"
          type="radio"
          @click="onDeselect"
          @change="focusInput"
        />
        <span>Other:</span>
      </label>
      <input
        v-model.trim="otherValue"
        :id="`${name}-other-input`"
        class="input-other"
        ref="otherInput"
        type="text"
        @input="checkOther"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.radio-select {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .multiple-choice-label {
    width: 100%;

    span {
      flex-grow: 1;
      cursor: default;
    }
  }

  .radio-select-item-other {
    display: flex;
    gap: 0.5rem;
    align-items: baseline;

    .other-input-label {
      white-space: nowrap;
    }

    .input-other {
      flex-grow: 1;
    }
  }
}

@container (width <= 420px) {
  .radio-select {
    gap: 1rem;

    input[type='radio'] {
      margin-inline-end: 1rem;
    }
  }
}
</style>
