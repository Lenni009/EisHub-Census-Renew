<script setup lang="ts">
import { ref, toRefs } from 'vue';
import { storeToRefs } from 'pinia';
import { useWikiPageDataStore } from '@/stores/wikiPageDataStore';
import GenericFileUpload from '../form/GenericFileUpload.vue';

const infoboxImageInGallery = ref(false);

const wikiPageDataStore = useWikiPageDataStore();
const { imageData } = storeToRefs(wikiPageDataStore);
const { gallery, image } = toRefs(imageData.value);

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
  <GenericFileUpload
    :infobox-image-in-gallery
    caption="Drop gallery files here"
    id="galleryImageInput"
    multiple
    @upload="addFiles"
  />
</template>
