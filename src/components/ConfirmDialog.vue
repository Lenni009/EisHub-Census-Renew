<script setup lang="ts">
defineProps<{
  userName: string;
}>();

const emit = defineEmits<{
  confirm: [];
}>();
</script>

<template>
  <article>
    <header>
      <button
        aria-label="Close"
        class="close"
        form="renew-close-form"
      ></button>
      <p class="text-center">Confirm renewal of {{ userName }}?</p>
    </header>
    <form
      class="confirm-options"
      id="renew-close-form"
      method="dialog"
    >
      <button @click.once="emit('confirm')">Renew</button>
      <button class="secondary">Cancel</button>
    </form>
  </article>
</template>

<style lang="scss">
.confirm-options {
  display: flex;
  gap: 1rem;
  margin-bottom: 0;

  & button {
    margin-bottom: 0;
    flex-grow: 1;
  }
}

.close-button-wrapper {
  display: inline;
  margin-bottom: 0;

  .close {
    background-color: transparent;
    border: none;

    &:active {
      box-shadow: none;
    }
  }
}
</style>
