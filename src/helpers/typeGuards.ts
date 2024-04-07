import { useWikiPageDataStore } from '@/stores/wikiPageDataStore';
import type { Modes, OptionalProps, Platforms } from '@/types/pageData';
import { modes, platforms } from '@/variables/saveData';
import { storeToRefs } from 'pinia';

export function isFormProperty(str: string): str is OptionalProps {
  const wikiPageDataStore = useWikiPageDataStore();
  const { playerData, imageData, baseData } = storeToRefs(wikiPageDataStore);
  return str in playerData.value || str in baseData.value || str in imageData.value;
}

export function isValidPlatformValue(platform: string): platform is Platforms {
  const platformArray = Object.values(platforms);
  return Boolean(platformArray.filter((item) => item === platform).length);
}

export function isValidModeValue(mode: string): mode is Modes {
  const modeArray = Object.values(modes);
  return Boolean(modeArray.filter((item) => item === mode).length);
}
