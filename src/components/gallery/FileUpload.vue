<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { storeToRefs } from 'pinia';
import type { FileItem } from '@/types/file';
import { useWikiPageDataStore } from '@/stores/wikiPageDataStore';

const dragActive = ref(false);
const errors = ref<string[]>([]);
const infoboxImageInGallery = ref(false);

const wikiPageDataStore = useWikiPageDataStore();
const { gallery, image } = storeToRefs(wikiPageDataStore);

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

  const uploadSizeLimit = 10000000;

  const largeFiles = fileArray.filter((file) => file.size > uploadSizeLimit);
  errors.value = largeFiles.map((file) => file.name);

  infoboxImageInGallery.value = fileArray.map((file) => file.name).includes(image.value?.name ?? '');

  const validFiles = fileArray.filter((file) => !largeFiles.includes(file) && file.name !== image.value?.name);

  buildFileItem(validFiles, gallery);
}

let id = 0;

function buildFileItem(files: File[], storeLoc: Ref<FileItem[]>) {
  for (const file of files) {
    storeLoc.value.unshift({
      id: id++,
      desc: '',
      url: URL.createObjectURL(file),
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
      <span class="drop-title">Drop gallery files here</span>
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
    <div v-if="errors.length">
      The following file(s) exceed the 10MB upload limit and couldn't be added. You can compress them with the
      <a
        href="https://nmscd.com/Image-Compressor/"
        target="_blank"
        rel="noopener noreferrer"
        >Image Compressor</a
      >.
    </div>
    <div
      v-for="error in errors"
      :key="error"
    >
      {{ error }}
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
  transition:
    background-color 0.2s ease-in-out,
    border 0.2s ease-in-out;

  &:hover,
  &.drag-active {
    border: 3px solid;
  }

  .drop-title {
    font-weight: bold;
    text-align: center;
  }

  input[type='file'] {
    width: max-content;
    height: auto;
    padding: 5px;
    border-radius: var(--pico-border-radius);
    border: 1px solid;

    &::file-selector-button {
      padding: 10px 20px;
    }
  }
}
</style>
