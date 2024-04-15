<script setup lang="ts" generic="T">
import { computed, ref, watchEffect } from 'vue';

const props = defineProps<{
  data: T[];
  pageSize: number;
}>();

const emit = defineEmits<{
  change: [data: T[]];
}>();

// pagination
const currentPage = ref(1);
const currentPageZeroIndexed = computed(() => currentPage.value - 1);
const availablePages = computed(() => Math.ceil(props.data.length / props.pageSize));
const paginatedEntries = computed(() =>
  props.data.slice(
    currentPageZeroIndexed.value * props.pageSize,
    currentPageZeroIndexed.value * props.pageSize + props.pageSize
  )
);

watchEffect(() => {
  if (currentPage.value > availablePages.value) currentPage.value = 1;
});

watchEffect(() => emit('change', paginatedEntries.value));
</script>

<template>
  <div
    v-show="availablePages > 1"
    class="page-select-wrapper"
  >
    <div
      v-for="n in availablePages"
      class="page-select-item"
    >
      <button
        :class="{ outline: currentPage !== n }"
        role="button"
        @click="currentPage = n"
      >
        {{ n }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-select-wrapper {
  display: flex;
  gap: 0.5rem;
  margin-block-end: 1rem;

  .page-select-item {
    aspect-ratio: 1;
    display: flex;

    button {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
