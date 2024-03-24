<script setup lang="ts">
import { computed } from 'vue';
import { parseUserLink } from '../helpers/wikitextParser';

const props = defineProps<{
  wikitext: string;
  text?: string;
}>();

const linkObj = computed(() => parseUserLink(props.wikitext));
</script>

<template>
  <a
    :href="linkObj.link"
    rel="noopener noreferrer"
    target="_blank"
    >{{ text ?? linkObj.text }}</a
  >
</template>
