<script setup lang="ts">
import { storeToRefs } from 'pinia';
import type { FileItem } from '@/types/file';
import { useWikiPageDataStore } from '@/stores/wikiPageDataStore';
import { toRefs } from 'vue';

defineProps<{
  fileItem: FileItem;
}>();

const wikiPageDataStore = useWikiPageDataStore();
const { imageData } = storeToRefs(wikiPageDataStore);
const { gallery } = toRefs(imageData.value);

function removeItem(fileItem: FileItem) {
  URL.revokeObjectURL(fileItem.url);
  gallery.value = gallery.value.filter((item) => item !== fileItem);
}

function moveItem(fileItem: FileItem, direction: 'up' | 'down') {
  const indexInStore = gallery.value.indexOf(fileItem);
  if (indexInStore === -1) throw new Error("Couldn't find item!");
  if (direction === 'up' && indexInStore) {
    gallery.value.splice(indexInStore - 1, 0, fileItem);
    gallery.value.splice(indexInStore + 1, 1);
  } else if (direction === 'down' && indexInStore !== gallery.value.length - 1) {
    // for some reason I cannot splice this together like I can when moving up
    const filteredArray = gallery.value.filter((item) => item !== fileItem);
    filteredArray.splice(indexInStore + 1, 0, fileItem);
    gallery.value = filteredArray;
  }
}
</script>

<template>
  <article class="gallery-item">
    <a
      :href="fileItem.url"
      class="gallery-media"
      rel="noopener noreferrer"
      target="_blank"
    >
      <img
        :src="fileItem.url"
        :alt="fileItem.file?.name ?? fileItem.desc"
      />
    </a>
    <div class="gallery-meta">
      <p class="filename-wrapper">
        <span class="text-bold">Name: </span>{{ fileItem.file?.name ?? fileItem.filename }}
      </p>
      <div>
        <input
          v-model.trim="fileItem.desc"
          placeholder="Description"
          type="text"
        />
      </div>
    </div>
    <div class="control-buttons">
      <button
        class="delete-icon is-clickable"
        title="Remove picture from gallery"
        type="button"
        @click="removeItem(fileItem)"
      >
        ❌
      </button>
      <img
        alt="Move via drag'n'drop"
        class="handle"
        src="../../assets/arrow.svg"
        title="Move picture up or down"
      />
      <button
        class="button move-button"
        data-move="up"
        title="Move up"
        type="button"
        @click="moveItem(fileItem, 'up')"
      >
        <svg
          height="36"
          width="36"
        >
          <path d="M2 25h32L18 9 2 25Z"></path>
        </svg>
      </button>
      <button
        class="button move-button"
        data-move="down"
        title="Move down"
        type="button"
        @click="moveItem(fileItem, 'down')"
      >
        <svg
          height="36"
          width="36"
        >
          <path d="M2 11h32L18 27 2 11Z"></path>
        </svg>
      </button>
    </div>
  </article>
</template>

<style scoped lang="scss">
.gallery-item {
  display: flex;
  width: 100%;
  max-width: 700px;
  margin: 0 auto 0.5em;
  background-color: rgba(150, 150, 150, 0.1);
  border-radius: var(--pico-border-radius);
  gap: 0.5rem;

  .gallery-media {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200px;
  }

  .gallery-media img {
    max-height: 150px;
    margin: 0 auto;
    border-radius: var(--pico-border-radius);
    object-fit: contain;
    min-width: 100px;
  }

  .gallery-meta {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 0.5rem;

    .filename-wrapper {
      word-break: break-all;
      margin: 0;
    }

    input {
      margin: 0;
    }
  }

  .control-buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    .move-button {
      margin: 0.2em 0;
      display: none;
      height: auto;
    }

    .delete-icon {
      all: unset;
      cursor: pointer;
      -webkit-user-select: none;
      user-select: none;
    }
  }

  &:only-child .control-buttons :is(.handle, .move-button) {
    visibility: hidden;
  }
}

.handle {
  width: 33px;
  filter: invert(var(--invert));

  &:hover {
    cursor: grab;
  }

  &:active {
    cursor: grabbing;
  }
}

.gallery-item .control-buttons .delete-icon,
.handle {
  opacity: 0.7;

  &:hover {
    opacity: 1;
  }
}

@media (pointer: coarse) {
  .gallery-item {
    .gallery-meta {
      justify-content: center;
    }

    .handle {
      display: none;
    }

    .move-button {
      display: flex !important;
    }

    .control-buttons .delete-icon {
      align-self: end;
    }
  }
}
</style>
