<script setup lang="ts">
import { useWikiPageDataStore } from '@/stores/wikiPageDataStore';
import { storeToRefs } from 'pinia';
import { ref, toRefs } from 'vue';

defineProps<{
  infoboxImageInGallery?: boolean;
  multiple?: boolean;
  backgroundImageUrl?: string;
  id: string;
  caption: string;
}>();

const emit = defineEmits<{
  upload: [files: File[]];
}>();

const dragActive = ref(false);

const wikiPageDataStore = useWikiPageDataStore();
const { imageData } = storeToRefs(wikiPageDataStore);
const { image } = toRefs(imageData.value);

function onChange(e: Event) {
  const { target } = e;
  if (!(target instanceof HTMLInputElement) || !target.files) return;
  const pictureArray = filterForImages(target.files);
  if (pictureArray.length) emit('upload', pictureArray);
}

function onDrop(e: DragEvent) {
  dragActive.value = false;
  const uploadedFiles = e.dataTransfer?.files;
  if (!uploadedFiles?.length) return;
  const pictureArray = filterForImages(uploadedFiles);
  if (pictureArray.length) emit('upload', pictureArray);
}

function filterForImages(fileList: FileList) {
  const fileArray = Array.from(fileList);
  const pictureArray = fileArray.filter((file) => file.type.startsWith('image/'));
  return pictureArray;
}
</script>

<template>
  <label
    :class="{ 'drag-active': dragActive }"
    :for="id"
    :style="backgroundImageUrl ? `background-image:url(${backgroundImageUrl})` : undefined"
    class="drop-container"
    @dragenter="dragActive = true"
    @dragleave="dragActive = false"
    @drop.prevent="onDrop"
    @dragover.prevent
  >
    <span class="text-center text-bold">{{ caption }}</span>
    <input
      :id
      :multiple
      accept="image/*"
      type="file"
      @change="onChange"
    />
  </label>
  <div v-if="infoboxImageInGallery">
    {{ image.file?.name }} is already in the infobox and therefore wasn't added to the gallery.
  </div>
</template>

<style scoped>
.drop-container {
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
  justify-content: center;
  align-items: center !important;
  height: 200px;
  border-radius: var(--pico-border-radius);
  border: 2px dashed;
  cursor: pointer;
  background-size: cover;
  container-type: inline-size;
  transition:
    background-color var(--pico-transition),
    border var(--pico-transition);

  &:hover,
  &.drag-active {
    border: 3px solid;
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
