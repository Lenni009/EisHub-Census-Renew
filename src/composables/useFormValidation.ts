import { useWikiPageDataStore, type ImageData, type PlayerData, type BaseData } from '@/stores/wikiPageDataStore';
import { storeToRefs } from 'pinia';
import { computed, type Ref } from 'vue';

type AllProps = ImageData & PlayerData & BaseData;
type OptionalProps = keyof AllProps;

const optionalProperties: OptionalProps[] = [
  'reddit',
  'social',
  'wikiName',
  'friend',
  'activeTime',
  'moon',
  'type',
  'features',
  'addInfo',
];

export function useFormValidation() {
  const wikiPageDataStore = useWikiPageDataStore();
  const { playerData, imageData, baseData } = storeToRefs(wikiPageDataStore);

  const { isDataValid: isPlayerDataValid, missingProps: missingPlayerProps } = useDataValidation(playerData);
  const { isDataValid: isBaseDataValid, missingProps: missingBaseProps } = useDataValidation(baseData);
  const { isDataValid: isImageDataValid, missingProps: missingImageProps } = useDataValidation(imageData);

  const isPageTwoDataValid = computed(() => isBaseDataValid.value && isImageDataValid.value);
  const missingPageTwoProps = computed(() => [...missingBaseProps.value, ...missingImageProps.value]);

  const isAllDataValid = computed(() => isPlayerDataValid.value && isPageTwoDataValid.value);
  const allMissingProps = computed(() => [...missingPlayerProps.value, ...missingPageTwoProps.value]);

  return {
    isAllDataValid,
    allMissingProps,
    isPageTwoDataValid,
    missingPageTwoProps,
    isPlayerDataValid,
    missingPlayerProps,
  };
}

function useDataValidation(storeObj: Ref<ImageData> | Ref<PlayerData> | Ref<BaseData>) {
  const entries = computed(() => Object.entries(storeObj.value));
  const filteredEntries = computed(() =>
    entries.value.filter((item) => isFormProperty(item[0]) && !optionalProperties.includes(item[0]))
  );
  const invalidValues = computed(() =>
    filteredEntries.value.filter((item) => !item[1] && typeof item[1] !== 'boolean')
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
