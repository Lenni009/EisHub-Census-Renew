<script setup lang="ts">
import { decodePlayerName } from '@/helpers/nameTranscode';
import { onMounted, ref } from 'vue';

const searchParamString = window.location.search;
const searchParams = new URLSearchParams(searchParamString);

const updatePlayerIdEncoded = searchParams.get('update');
const updatePlayerId = decodePlayerName(updatePlayerIdEncoded ?? '');

const playerDataString = sessionStorage.getItem('update');

const playerData = JSON.parse(playerDataString ?? '{}');

console.log(updatePlayerId, playerData);

const apiCall =
  'https://nomanssky.fandom.com/api.php?action=parse&format=json&origin=*&page=Eisvana%20Research%20Outpost&prop=wikitext&section=3&contentmodel=wikitext';

const wikitext = ref('');

onMounted(async () => {
  const res = await fetch(apiCall);
  const { parse } = await res.json();
  wikitext.value = parse.wikitext['*'].split('\n').slice(1).join('\n');
});
</script>

<template>
  <div>Hello world!</div>

  <textarea v-model="wikitext"></textarea>
</template>
