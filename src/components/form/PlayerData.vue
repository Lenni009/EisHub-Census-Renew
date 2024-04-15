<script setup lang="ts">
import { toRefs, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import TimezoneQuestions from './TimezoneQuestions.vue';
import { useWikiPageDataStore } from '@/stores/wikiPageDataStore';
import { userExists } from '@/helpers/wikiApi';
import { discordValidation } from '@/variables/formValidation';
import { isNewCitizen } from '@/variables/formMode';

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
    <p
      class="question required"
      id="discord-name"
    >
      What is your Discord name?
    </p>
    <p class="subtitle">Please enter your username, not your display name.</p>
    <input
      v-model.trim="playerData.discord"
      :aria-invalid="!isDiscordValid || undefined"
      :pattern="discordValidation"
      aria-labelledby="discord-name"
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
    <p
      class="question"
      id="reddit-name"
    >
      What is your Reddit name?
    </p>
    <input
      v-model.trim="playerData.reddit"
      :aria-invalid="!isRedditValid || undefined"
      aria-labelledby="reddit-name"
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
    <p
      class="question"
      id="social-name"
    >
      Social media link if you don't have Reddit
    </p>
    <p class="subtitle">
      If you don't have Reddit, do you have a different social media account that you'd like to have on the census
      (Facebook, Instagram, etc.)? Please put the full link here.
    </p>
    <input
      v-model.trim="playerData.social"
      :aria-invalid="!isSocialValid || undefined"
      aria-labelledby="social-name"
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
    <p
      class="question"
      id="wiki-name"
    >
      If you have a NMS Fandom wiki account, what's its name? (else leave empty)
    </p>
    <input
      v-model.trim.lazy="playerData.wikiName"
      :aria-invalid="!wikiUserExists || undefined"
      aria-labelledby="wiki-name"
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
    <p
      class="question required"
      id="ingame-name"
    >
      What is your ingame name?
    </p>
    <p class="subtitle">Found on the top left in your inventory/pause menu. Exclude any game titles.</p>
    <input
      v-model.trim="playerData.player"
      :aria-invalid="!isNameValid || undefined"
      aria-labelledby="ingame-name"
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
    <p
      class="question"
      id="friend-code"
    >
      No Man's Sky Friend Code
    </p>
    <p class="subtitle">Please enter your friend code in the following format: "XXXX-XXXX-XXXXX" including dashes.</p>
    <input
      v-model.trim.lazy="playerData.friend"
      :aria-invalid="!isFriendValid || undefined"
      aria-labelledby="friend-code"
      type="text"
    />
    <p
      v-if="!isFriendValid"
      class="error"
    >
      Format must be as follows: XXXX-XXXX-XXXXX
    </p>
  </article>
  <template v-if="isNewCitizen">
    <article>
      <p
        class="question required"
        id="arrival-date"
      >
        Date of Arrival
      </p>
      <p class="subtitle">When did you arrive in Eisvana space?</p>
      <input
        v-model.trim="playerData.arrival"
        aria-labelledby="arrival-date"
        type="date"
      />
    </article>

    <TimezoneQuestions />
  </template>
</template>
