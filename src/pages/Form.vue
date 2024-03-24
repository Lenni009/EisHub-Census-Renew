<script setup lang="ts">
import { decodePlayerName } from '@/helpers/nameTranscode';

const searchParamString = window.location.search;
const searchParams = new URLSearchParams(searchParamString);

const updatePlayerIdEncoded = searchParams.get('update');
const updatePlayerId = decodePlayerName(updatePlayerIdEncoded ?? '');

const playerDataString = sessionStorage.getItem('update');

const playerData = JSON.parse(playerDataString ?? '{}');

console.log(updatePlayerId, playerData);
</script>

<template>
  <div>Hello world!</div>
</template>
