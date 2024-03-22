<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  userName: string;
}>();

const dialogElement = ref<HTMLDialogElement | null>(null);
const toggleModal = () => {
  dialogElement.value?.showModal();
  (document.activeElement as HTMLElement | null)?.blur();
};

defineExpose({
  toggleModal,
});
</script>

<template>
  <dialog ref="dialogElement">
    <article>
      <header>
        <form
          method="dialog"
          class="close-button-wrapper"
        >
          <button
            aria-label="Close"
            class="close"
          ></button>
        </form>
        <div class="confirm-heading">Confirm renewal of {{ userName }}?</div>
      </header>
      <form
        method="dialog"
        class="confirm-options"
      >
        <button @click="$emit('confirm')">Yes</button>
        <button class="secondary">No</button>
      </form>
    </article>
  </dialog>
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

.confirm-heading {
  text-align: center;
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
