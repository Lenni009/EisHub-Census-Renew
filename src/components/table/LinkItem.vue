<script setup lang="ts">
import { computed } from 'vue';
import { parseUserLink } from '@/helpers/wikitextParser';
import { wikiLink } from '@/variables/wikiLink';
import { decode } from 'html-entities';

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
    :href="decode(linkObj.link)"
    rel="noopener noreferrer"
    target="_blank"
    >{{ decode(text ?? linkObj.text) }}</a
  >
</template>
