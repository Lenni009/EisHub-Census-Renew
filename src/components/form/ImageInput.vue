<script setup lang="ts">
import { useWikiPageDataStore } from '@/stores/wikiPageDataStore';
import { storeToRefs } from 'pinia';
import { ref, toRefs } from 'vue';

const dragActive = ref(false);

const wikiPageDataStore = useWikiPageDataStore();
const { imageData } = storeToRefs(wikiPageDataStore);
const { image } = toRefs(imageData.value);

function dropFile(e: DragEvent) {
  dragActive.value = false;
  const uploadedFile = e.dataTransfer?.files[0];
  if (uploadedFile) useNewFile(uploadedFile);
}

function uploadFile(e: Event) {
  if (!(e.target instanceof HTMLInputElement)) return;
  const uploadedFile = e.target.files?.[0];
  if (uploadedFile) useNewFile(uploadedFile);
}

function useNewFile(file: File) {
  URL.revokeObjectURL(image.value.url);
  image.value.file = file;
  image.value.filename = file.name;
  image.value.url = URL.createObjectURL(file);
}
</script>

<template>
  <label
    :class="{ 'drag-active': dragActive }"
    :style="image.url ? `background-image:url(${image.url})` : undefined"
    class="drop-container"
    for="mainFileUpload"
    @dragenter="dragActive = true"
    @dragleave="dragActive = false"
    @drop.prevent="dropFile"
    @dragover.prevent
  >
    <span class="title-wrapper">
      <span class="drop-title text-bold">Drop main image here</span>
    </span>
    <input
      accept="image/*"
      id="mainFileUpload"
      type="file"
      @change="uploadFile"
    />
  </label>
</template>
