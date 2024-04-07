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

  infoboxImageInGallery.value = fileArray.map((file) => file.name).includes(image.value.file?.name ?? '');

  const validFiles = infoboxImageInGallery.value
    ? fileArray.filter((file) => file.name !== image.value.file?.name)
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
    :class="{ 'drag-active': dragActive }"
    class="drop-container"
    for="galleryUpload"
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
      {{ image.file?.name }} is already in the infobox and therefore wasn't added to the gallery.
    </div>
  </div>
</template>
