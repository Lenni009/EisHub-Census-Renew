<script setup lang="ts">
import { useWikiPageDataStore } from '@/stores/wikiPageDataStore';
import { timezoneOffset } from '@/variables/dateTime';
import { storeToRefs } from 'pinia';

const wikiPageData = useWikiPageDataStore();
const { playerData } = storeToRefs(wikiPageData);
</script>

<template>
  <article>
    <p class="question">[OPTIONAL] Timezone</p>
    <p class="subtitle">
      Detected timezone: <span class="text-bold">{{ timezoneOffset }}</span>
      <br />
      This will be used to plan future events accordingly. This information will remain private and will only be shared
      with Eisvana Leadership.
    </p>
    <label>
      <span>Share timezone ({{ timezoneOffset }})</span>
      <input
        v-model.trim="playerData.shareTimezone"
        type="checkbox"
      />
    </label>
  </article>
  <article>
    <p class="question">[OPTIONAL] In this time zone, when do you play No Man's Sky the most?</p>
    <p class="subtitle">
      I. e. mornings, afternoon, evenings, late night, 9 AM to 12 PM, etc. This is used in order to better plan events.
    </p>
    <input
      v-model.trim="playerData.activeTime"
      type="text"
    />
  </article>
</template>
