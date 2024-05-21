import { useWikiPageDataStore } from '@/stores/wikiPageDataStore';
import type { Modes, OptionalProps, Platforms } from '@/types/pageData';
import type {
  ParsedSummaryObject,
  ParsedWikitextObject,
  QueryResponseObject,
  SectionQueryResponseObject,
} from '@/types/queryResponse';
import { modes, platforms } from '@/variables/saveData';
import { storeToRefs } from 'pinia';

export function isFormProperty(str: string): str is OptionalProps {
  const wikiPageDataStore = useWikiPageDataStore();
  const { playerData, imageData, baseData } = storeToRefs(wikiPageDataStore);
  return str in playerData.value || str in baseData.value || str in imageData.value;
}

export function isValidPlatformValue(platform: unknown): platform is Platforms {
  const platformArray = Object.keys(platforms);
  return platformArray.findIndex((item) => item === platform) !== -1;
}

export function isValidModeValue(mode: unknown): mode is Modes {
  const modeArray = Object.values(modes);
  return modeArray.findIndex((item) => item === mode) !== -1;
}

function isObject(obj: unknown): obj is object {
  return Boolean(obj) && typeof obj === 'object';
}

export function isSectionQueryResponse(sectionObj: unknown): sectionObj is SectionQueryResponseObject {
  if (!isObject(sectionObj) || !('parse' in sectionObj)) return false;
  const { parse } = sectionObj;
  if (!isObject(parse) || !('sections' in parse)) return false;
  return Array.isArray(parse.sections);
}

export function isParsedSummary(summaryObject: unknown): summaryObject is ParsedSummaryObject {
  if (!isObject(summaryObject) || !('parse' in summaryObject)) return false;
  const { parse } = summaryObject;
  if (!isObject(parse) || !('parsedsummary' in parse)) return false;
  const { parsedsummary } = parse;
  if (!isObject(parsedsummary) || !('*' in parsedsummary)) return false;
  return typeof parsedsummary['*'] === 'string';
}

export function isWikitext(wikitextObject: unknown): wikitextObject is ParsedWikitextObject {
  if (!isObject(wikitextObject) || !('parse' in wikitextObject)) return false;
  const { parse } = wikitextObject;
  if (!isObject(parse) || !('wikitext' in parse)) return false;
  const { wikitext } = parse;
  if (!isObject(wikitext) || !('*' in wikitext)) return false;
  return typeof wikitext['*'] === 'string';
}

export function isQueryResponse(response: unknown): response is QueryResponseObject {
  if (!isObject(response) || !('query' in response)) return false;
  const { query } = response;
  if (!isObject(query) || !('users' in query)) return false;
  const { users } = query;
  return Array.isArray(users);
}

export function isCargoResponse<T>(response: unknown): response is T {
  if (!isObject(response) || !('cargoquery' in response)) return false;
  return Array.isArray(response.cargoquery);
}
