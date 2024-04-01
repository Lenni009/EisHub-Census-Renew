<script setup lang="ts">
import { type Component, computed } from 'vue';
import PlayerData from './PlayerData.vue';
import BaseData from './BaseData.vue';
import { useWikiPageDataStore } from '@/stores/wikiPageDataStore';
import { fileReplacer } from '@/helpers/localStorage';

const props = defineProps<{
  page: number;
  localStorageKey: string;
}>();

const wikiPageDataStore = useWikiPageDataStore();

// persist the whole state to the local storage whenever it changes
wikiPageDataStore.$subscribe((_, state) => {
  localStorage.setItem(props.localStorageKey, JSON.stringify(state, fileReplacer));
  localStorage.setItem('lastUpdated', Date.now().toString());
});

const router: Record<number, Component> = {
  1: PlayerData,
  2: BaseData,
};

const RenderComponent = computed(() => router[props.page]);
</script>

<template>
  <RenderComponent />
</template>
