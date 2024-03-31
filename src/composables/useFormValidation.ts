import { useWikiPageDataStore } from '@/stores/wikiPageDataStore';
import type { BaseData, PlayerData, ImageData, OptionalProps } from '@/types/pageData';
import { optionalProperties } from '@/variables/formValidation';
import { storeToRefs } from 'pinia';
import { computed, ref, type Ref } from 'vue';

interface PlayerDataValidation {
  discord: boolean;
  reddit: boolean;
  social: boolean;
  name: boolean;
  friend: boolean;
}

export function useFormValidation() {
  const wikiPageDataStore = useWikiPageDataStore();
  const {
    playerData,
    imageData,
    baseData,
    region,
    isDiscordValid,
    isRedditValid,
    isSocialValid,
    isNameValid,
    isFriendValid,
    isAxesValid,
  } = storeToRefs(wikiPageDataStore);

  // this has to be declared this way instead of ref<PlayerDataValidation>({}) because otherwise the function wouldn't take it...
  const playerDataValidation: Ref<PlayerDataValidation> = ref({
    discord: isDiscordValid,
    reddit: isRedditValid,
    social: isSocialValid,
    name: isNameValid,
    friend: isFriendValid,
  });

  const { isDataValid: isPlayerDataValid, missingProps: missingPlayerProps } = useDataValidation(playerData);
  const { isDataValid: isBaseDataValid, missingProps: missingBaseProps } = useDataValidation(baseData);
  const { isDataValid: isImageDataValid, missingProps: missingImageProps } = useDataValidation(imageData);
  const { isDataValid: isPlayerValidationDataValid, missingProps: missingPlayerValidationProps } = useDataValidation(
    playerDataValidation,
    true
  );

  const missingPageOneProps = computed(() => [...missingPlayerProps.value, ...missingPlayerValidationProps.value]);
  const isPageOneValid = computed(() => isPlayerDataValid.value && isPlayerValidationDataValid.value);

  const isPageTwoDataValid = computed(
    () => isBaseDataValid.value && isImageDataValid.value && region.value && isAxesValid.value
  );
  const missingPageTwoProps = computed(() => [
    ...missingBaseProps.value,
    ...missingImageProps.value,
    ...(region.value ? [] : ['region']),
    ...(isAxesValid.value ? [] : ['axes']),
  ]);

  const isAllDataValid = computed(() => isPageOneValid.value && isPageTwoDataValid.value);
  const allMissingProps = computed(() => [...missingPageOneProps.value, ...missingPageTwoProps.value]);

  return {
    isAllDataValid,
    allMissingProps,
    isPageTwoDataValid,
    missingPageTwoProps,
    isPageOneValid,
    missingPageOneProps,
  };
}

function useDataValidation(
  storeObj: Ref<ImageData> | Ref<PlayerData> | Ref<BaseData> | Ref<PlayerDataValidation>,
  checkBoolean: boolean = false
) {
  const entries = computed(() => Object.entries(storeObj.value));
  const filteredEntries = computed(() =>
    entries.value.filter((item) => isFormProperty(item[0]) && !optionalProperties.includes(item[0]))
  );
  const invalidValues = computed(() =>
    filteredEntries.value.filter((item) => !item[1] && (checkBoolean || typeof item[1] !== 'boolean'))
  );
  const missingProps = computed(() => invalidValues.value.map((item) => item[0]));
  const isDataValid = computed(() => !invalidValues.value.length); // return true if everything is good, else return false
  return { isDataValid, missingProps };
}

function isFormProperty(str: string): str is OptionalProps {
  const wikiPageDataStore = useWikiPageDataStore();
  const { playerData, imageData, baseData } = storeToRefs(wikiPageDataStore);
  return str in playerData.value || str in baseData.value || str in imageData.value;
}
