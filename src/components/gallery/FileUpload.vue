<script setup lang="ts">
import { ref, toRefs } from 'vue';
import { storeToRefs } from 'pinia';
import { useWikiPageDataStore } from '@/stores/wikiPageDataStore';

const dragActive = ref(false);
const errors = ref<string[]>([]);
const infoboxImageInGallery = ref(false);

const wikiPageDataStore = useWikiPageDataStore();
const { imageData } = storeToRefs(wikiPageDataStore);
const { gallery, image } = toRefs(imageData.value);

function dropFile(e: DragEvent) {
  dragActive.value = false;
  const uploadedFiles = e.dataTransfer?.files;
  if (uploadedFiles?.length) addFiles(uploadedFiles);
}

function uploadFile(e: Event) {
  if (!(e.target instanceof HTMLInputElement)) return;
  const uploadedFiles = e.target.files;
  if (uploadedFiles?.length) addFiles(uploadedFiles);
}

function addFiles(files: FileList) {
  const fileArray = Array.from(files);

  infoboxImageInGallery.value = fileArray.map((file) => file.name).includes(image.value?.name ?? '');

  const validFiles = infoboxImageInGallery.value
    ? fileArray.filter((file) => file.name !== image.value?.name)
    : fileArray;

  buildFileItem(validFiles);
}

let id = 0;

function buildFileItem(files: File[]) {
  for (const file of files) {
    gallery.value.unshift({
      id: id++,
      desc: '',
      url: URL.createObjectURL(file),
      filename: file.name,
      file,
    });
  }
}
</script>

<template>
  <label
    for="galleryUpload"
    class="drop-container"
    :class="{ 'drag-active': dragActive }"
    @dragenter="dragActive = true"
    @dragleave="dragActive = false"
    @drop.prevent="dropFile"
    @dragover.prevent
  >
    <span class="title-wrapper">
      <span class="drop-title text-bold">Drop gallery files here</span>
    </span>
    <input
      :class="{ error: errors.length || infoboxImageInGallery }"
      accept="image/*"
      id="galleryUpload"
      type="file"
      multiple
      @change="uploadFile"
    />
  </label>
  <div
    v-if="errors.length || infoboxImageInGallery"
    class="error-list"
  >
    <div v-if="infoboxImageInGallery">
      {{ image?.name }} is already in the infobox and therefore wasn't added to the gallery.
    </div>
  </div>
</template>

<style scoped lang="scss">
.drop-container {
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  border-radius: var(--pico-border-radius);
  border: 2px dashed;
  cursor: pointer;
  container-type: inline-size;
  transition:
    background-color var(--pico-transition),
    border var(--pico-transition);

  &:hover,
  &.drag-active {
    border: 3px solid;
  }

  .drop-title {
    text-align: center;
  }

  input[type='file'] {
    height: auto;
    padding: 5px;
    border-radius: var(--pico-border-radius);
    border: 1px solid;

    &::file-selector-button {
      padding: 10px 20px;
    }
  }
}

@container (width > 400px) {
  input[type='file'] {
    width: max-content;
  }
}
</style>
