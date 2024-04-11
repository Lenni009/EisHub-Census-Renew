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
  upload: [files: FileList];
}>();

const dragActive = ref(false);

const wikiPageDataStore = useWikiPageDataStore();
const { imageData } = storeToRefs(wikiPageDataStore);
const { image } = toRefs(imageData.value);

function onChange(e: Event) {
  const { target } = e;
  if (!(target instanceof HTMLInputElement) || !target.files) return;
  emit('upload', target.files);
}

function onDrop(e: DragEvent) {
  dragActive.value = false;
  const uploadedFiles = e.dataTransfer?.files;
  if (uploadedFiles?.length) emit('upload', uploadedFiles);
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
    <span class="title-wrapper">
      <span class="drop-title text-bold">{{ caption }}</span>
    </span>
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
