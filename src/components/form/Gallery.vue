<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import Sortable, { type SortableEvent } from 'sortablejs';
import GalleryItem from '../gallery/GalleryItem.vue';
import FileUpload from '../gallery/FileUpload.vue';
import { useWikiPageDataStore } from '@/stores/wikiPageDataStore';

const filePreview = ref<HTMLDivElement | null>(null);

const isPreviewHidden = ref(false);

onMounted(() => {
  if (!filePreview.value) return;
  // prettier-ignore
  new Sortable(filePreview.value, { // NoSonar (used by a library, not useless!)
    handle: '.handle', // handle's class
    animation: 250,
    onUpdate: dragItem,
  });
});

const wikiPageDataStore = useWikiPageDataStore();
const { gallery } = storeToRefs(wikiPageDataStore);

function dragItem(evt: SortableEvent) {
  const oldIndex = evt.oldIndex;
  const newIndex = evt.newIndex;
  if (!(typeof oldIndex === 'number' && typeof newIndex === 'number')) return;
  const extractedItem = gallery.value.splice(oldIndex, 1);
  gallery.value.splice(newIndex, 0, extractedItem[0]);
}

const togglePreview = () => (isPreviewHidden.value = !isPreviewHidden.value);
</script>

<template>
  <FileUpload />

  <div
    v-if="gallery.length"
    class="gallery-preview-header"
  >
    <p class="preview-caption has-text-weight-bold">Gallery Preview</p>
    <button
      class="show-hide-button"
      type="button"
      @click="togglePreview"
    >
      {{ isPreviewHidden ? 'Show' : 'Hide' }}
    </button>
  </div>
  <div v-show="!isPreviewHidden">
    <div
      v-show="gallery.length"
      ref="filePreview"
      class="gallery-preview"
    >
      <GalleryItem
        v-for="fileItem in gallery"
        :key="fileItem.id"
        :file-item="fileItem"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.gallery-preview-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  margin-block-end: 0.5rem;
}

.preview-caption,
.show-hide-button {
  margin: 0;
}
</style>
