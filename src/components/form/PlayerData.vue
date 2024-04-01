<script setup lang="ts">
import { toRefs, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { timezoneOffset } from '@/variables/dateTime';
import { useWikiPageDataStore } from '@/stores/wikiPageDataStore';
import { userExists } from '@/helpers/wikiApi';
import { discordValidation } from '@/variables/formValidation';

const wikiPageData = useWikiPageDataStore();
const { playerData, validation, isDiscordValid, isRedditValid, isFriendValid, isNameValid, isSocialValid } =
  storeToRefs(wikiPageData);
const { friend, wikiName } = toRefs(playerData.value);
const { wikiUserExists } = toRefs(validation.value);

watchEffect(async () => (wikiUserExists.value = wikiName.value ? await userExists(wikiName.value) : true));
watchEffect(() => (friend.value = friend.value.toUpperCase()));
</script>

<template>
  <article>
    <p class="question required">What is your Discord name?</p>
    <p class="subtitle">Please enter your username, not your display name.</p>
    <input
      v-model.trim="playerData.discord"
      :aria-invalid="!isDiscordValid || undefined"
      :pattern="discordValidation"
      type="text"
    />
    <p
      v-if="!isDiscordValid"
      class="error"
    >
      Use your username, not your display name
    </p>
  </article>
  <article>
    <p class="question">What is your Reddit name?</p>
    <input
      v-model.trim="playerData.reddit"
      :aria-invalid="!isRedditValid || undefined"
      type="text"
    />
    <p
      v-if="!isRedditValid"
      class="error"
    >
      Please use your Reddit username without the u/
    </p>
  </article>
  <article v-if="!playerData.reddit">
    <p class="question">Social media link if you don't have Reddit</p>
    <p class="subtitle">
      If you don't have Reddit, do you have a different social media account that you'd like to have on the census
      (Facebook, Instagram, Wiki, etc.)? Please put the full link here.
    </p>
    <input
      v-model.trim="playerData.social"
      :aria-invalid="!isSocialValid || undefined"
      type="text"
    />
    <p
      v-if="!isSocialValid"
      class="error"
    >
      Please give a link to that profile.
    </p>
  </article>
  <article>
    <p class="question">If you have a NMS Fandom wiki account, what's its name? (else leave empty)</p>
    <input
      v-model.trim.lazy="playerData.wikiName"
      :aria-invalid="!wikiUserExists || undefined"
      type="text"
    />
    <p
      v-if="!wikiUserExists"
      class="error"
    >
      This wiki user doesn't exist!
    </p>
  </article>
  <article>
    <p class="question required">What is your ingame name?</p>
    <p class="subtitle">Found on the top left in your inventory/pause menu. Exclude any game titles.</p>
    <input
      v-model.trim="playerData.player"
      :aria-invalid="!isNameValid || undefined"
      type="text"
    />
    <p
      v-if="!isNameValid"
      class="error"
    >
      Please enter your ingame name, not your platform
    </p>
  </article>
  <article>
    <p class="question">No Man's Sky Friend Code</p>
    <p class="subtitle">Please enter your friend code in the following format: "XXXX-XXXX-XXXXX" including dashes.</p>
    <input
      v-model.trim.lazy="playerData.friend"
      :aria-invalid="!isFriendValid || undefined"
      type="text"
    />
    <p
      v-if="!isFriendValid"
      class="error"
    >
      Format must be as follows: XXXX-XXXX-XXXXX
    </p>
  </article>
  <article>
    <p class="question required">Date of Arrival</p>
    <p class="subtitle">When did you arrive in Eisvana space?</p>
    <input
      v-model.trim="playerData.arrival"
      type="date"
    />
  </article>
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
