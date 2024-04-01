<script setup lang="ts">
import { type Component, computed } from 'vue';
import PlayerData from './PlayerData.vue';
import BaseData from './BaseData.vue';

const props = defineProps<{
  page: number;
}>();

const router: Record<number, Component> = {
  1: PlayerData,
  2: BaseData,
};

const RenderComponent = computed(() => router[props.page]);
</script>

<template>
  <RenderComponent />
</template>
