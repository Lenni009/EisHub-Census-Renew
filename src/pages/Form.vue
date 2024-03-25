<script setup lang="ts">
import { decodePlayerName } from '@/helpers/nameTranscode';
import type { CensusEntry } from '@/types/query';
import { useWikiPageDataStore } from '@/stores/wikiPageDataStore';
import { storeToRefs } from 'pinia';

const searchParamString = window.location.search;
const searchParams = new URLSearchParams(searchParamString);

const updatePlayerIdEncoded = searchParams.get('update');
const updatePlayerId = decodePlayerName(updatePlayerIdEncoded ?? '');

const playerDataString = sessionStorage.getItem('update');

const playerData: CensusEntry = JSON.parse(playerDataString ?? '{}');

const isUpdatingPage = updatePlayerId === playerData.CensusPlayer;

const wikiPageData = useWikiPageDataStore();
const { pageName, sectionData } = storeToRefs(wikiPageData);

pageName.value = playerData.Name;

if (isUpdatingPage) wikiPageData.fetchWikiText();
</script>

<template>
  <article v-for="section in sectionData">
    <label
      :aria-busy="section.loading"
      :for="section.name"
      >{{ section.name }}</label
    >
    <textarea
      :id="section.name"
      v-model="section.text"
    ></textarea>
  </article>
</template>
