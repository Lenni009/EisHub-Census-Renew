<script setup lang="ts">
import { useWikiPageDataStore } from '@/stores/wikiPageDataStore';
import { storeToRefs } from 'pinia';
import { toRefs } from 'vue';
import GenericFileUpload from './GenericFileUpload.vue';

const wikiPageDataStore = useWikiPageDataStore();
const { imageData } = storeToRefs(wikiPageDataStore);
const { image } = toRefs(imageData.value);

function uploadFile(files: File[]) {
  const uploadedFile = files[0];
  useNewFile(uploadedFile);
}

function useNewFile(file: File) {
  URL.revokeObjectURL(image.value.url);
  image.value.file = file;
  image.value.filename = file.name;
  image.value.url = URL.createObjectURL(file);
}
</script>

<template>
  <GenericFileUpload
    :background-image-url="image.url"
    caption="Drop main image here"
    id="mainImageInput"
    @upload="uploadFile"
  />
</template>
