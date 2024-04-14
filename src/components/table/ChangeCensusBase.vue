<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

defineProps<{
  player: string;
}>();

onMounted(() => console.log('mount!'));
onUnmounted(() => console.log('unmount!'));

defineEmits(['close']);
</script>

<template>
  <article>
    <header class="text-bold">Change census base for {{ player }}</header>
    <input
      type="radio"
      value="Hi"
    />
    <footer>
      <form
        method="dialog"
        @submit="$emit('close')"
      >
        <button>Submit</button>
        <button class="secondary">Cancel</button>
      </form>
    </footer>
  </article>
</template>

<style scoped lang="scss">
footer button {
  margin: 0;
}
</style>
