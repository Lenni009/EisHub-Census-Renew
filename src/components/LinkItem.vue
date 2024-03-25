<script setup lang="ts">
import { computed } from 'vue';
import { parseUserLink } from '../helpers/wikitextParser';
import { wikiLink } from '@/variables/wikiLink';

const props = defineProps<{
  wikitext: string;
  text?: string;
}>();

const linkObj = computed(() =>
  props.wikitext.startsWith('[')
    ? parseUserLink(props.wikitext)
    : { text: props.wikitext, link: `${wikiLink}${props.wikitext}` }
);
</script>

<template>
  <a
    :href="linkObj.link"
    rel="noopener noreferrer"
    target="_blank"
    >{{ text ?? linkObj.text }}</a
  >
</template>
