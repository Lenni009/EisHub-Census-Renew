import { useWikiPageDataStore, type ImageData, type PlayerData, type BaseData } from '@/stores/wikiPageDataStore';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

type AllProps = ImageData & PlayerData & BaseData;
type OptionalProps = keyof AllProps;

export function useFormValidation() {
  const wikiPageDataStore = useWikiPageDataStore();
  const { playerData, imageData, baseData } = storeToRefs(wikiPageDataStore);

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

  const playerDataEntries = computed(() => Object.entries(playerData.value));
  const baseDataEntries = computed(() => Object.entries(baseData.value));
  const iamgeDataEntries = computed(() => Object.entries(imageData.value));

  const allArrays = computed(() => [...playerDataEntries.value, ...baseDataEntries.value, ...iamgeDataEntries.value]);

  const filteredEntries = computed(() =>
    allArrays.value.filter((item) => isFormProperty(item[0]) && !optionalProperties.includes(item[0]))
  );

  const invalidValues = computed(() =>
    filteredEntries.value.filter(
      (item) => item[1] === undefined || item[1] === '' || (item[0] === 'image' && item[1] === null)
    )
  );
  const missingProps = computed(() => invalidValues.value.map((item) => item[0]));
  const isDataValid = computed(() => !invalidValues.value.length);
  return { isDataValid, missingProps }; // return true if everything is good, else return false

  function isFormProperty(str: string): str is OptionalProps {
    return str in playerData.value || str in baseData.value || str in imageData.value;
  }
}
