import type {
  BasicCargoQueryData,
  BasicQueryApiData,
  BasicQueryData,
  CensusQueryObject,
  GalleryQueryObject,
  OrderedRawCensusQueryObject,
  QueryObjects,
  RawCensusQueryObject,
  RawCensusQueryWhereObject,
  RawQueryObject,
  SectionContentQueryObject,
  SectionQueryObject,
  UserQueryObject,
} from '@/types/queryObjects';
import { limit } from '@/variables/apiLimit';
import { apiPath } from '@/variables/wikiLink';
import { isParsedSummary, isQueryResponse, isWikitext } from './typeGuards';
import { decode } from 'html-entities';

// generic function to build a URL from an object
const buildQueryUrl = (queryObject: QueryObjects) =>
  `${apiPath}?${Object.entries(queryObject)
    .map((param) => param.join('='))
    .join('&')}`;

const basicQueryData: BasicQueryData = {
  format: 'json',
  origin: '*',
};

// wikitext querying helper functions
const getParseQueryRawObject: BasicQueryApiData = {
  ...basicQueryData,
  action: 'parse',
};

const getFileQueryObject = (summary: string): GalleryQueryObject => ({
  ...getParseQueryRawObject,
  prop: '',
  summary,
});

const getSectionQueryRawObject = (page: string): RawQueryObject => ({
  ...getParseQueryRawObject,
  page,
});

const getSectionQueryObject = (pageName: string): SectionQueryObject => ({
  ...getSectionQueryRawObject(pageName),
  prop: 'sections',
});

const getSectionContentQueryObject = (pageName: string, section: number): SectionContentQueryObject => ({
  ...getSectionQueryRawObject(pageName),
  prop: 'wikitext',
  section,
});

// exported functions to get wikitext URLs
export const getPageSectionsApiUrl = (pageName: string) => buildQueryUrl(getSectionQueryObject(pageName));
export const getPageSectionContentApiUrl = (pageName: string, section: number) =>
  buildQueryUrl(getSectionContentQueryObject(pageName, section));
export const getFileQueryApiUrl = (summary: string) => buildQueryUrl(getFileQueryObject(summary));

// cargo
const getCargoQueryRawObject = (): BasicCargoQueryData => ({
  ...basicQueryData,
  action: 'cargoquery',
  tables: 'Bases',
  limit,
});

const getCensusQueryObject = (civilized: string): RawCensusQueryWhereObject => ({
  ...getCargoQueryRawObject(),
  where: `CensusShow IS NOT NULL AND Civilized="${civilized}"`,
});

const getCensusQueryCountObject = (civilized: string): RawCensusQueryObject => ({
  ...getCensusQueryObject(civilized),
  fields: ['COUNT(DISTINCT CensusPlayer)'],
});

const getCensusQueryDataObject = (civilized: string, offset: number): CensusQueryObject => ({
  ...getCensusQueryObject(civilized),
  fields: [
    'Name',
    'CensusPlayer',
    'CensusReddit',
    'CensusDiscord',
    'CensusFriend',
    'System',
    'Platform',
    'Mode',
    'CensusArrival',
    'CensusRenewal',
    'Builderlink',
  ],
  order_by: 'CensusRenewal',
  group_by: 'CensusPlayer',
  offset,
});

const getBaseQueryObject = (baseName: string): RawCensusQueryObject => ({
  ...getCargoQueryRawObject(),
  fields: ['Type', 'Farm', 'Geobay', 'Landing_pad', 'Arena', 'Terminal', 'Racetrack'],
  where: `Name="${baseName}"`,
});

// the replacement in the name is necessary. # crashes the MW API, and _ is a wildcard for a single character. See https://www.w3schools.com/sql/sql_wildcards.asp
const getPlayerBasesQueryObject = (player: string, civilized: string): OrderedRawCensusQueryObject => ({
  ...getCargoQueryRawObject(),
  fields: ['Name'],
  where: `CensusPlayer LIKE "${player.replaceAll('#', '_')}" AND Civilized="${civilized}"`,
  order_by: 'CensusShow DESC',
});

// exported functions to get cargo query URLs
export const getCensusQueryDataUrl = (civilized: string, offset: number) =>
  buildQueryUrl(getCensusQueryDataObject(civilized, offset));
export const getCensusQueryCountUrl = (civilized: string) => buildQueryUrl(getCensusQueryCountObject(civilized));
export const getBaseQueryUrl = (baseName: string) => buildQueryUrl(getBaseQueryObject(baseName));
export const getPlayerBasesQueryUrl = (player: string, civilized: string) =>
  buildQueryUrl(getPlayerBasesQueryObject(player, civilized));

// check whether user exists on the wiki
// since idiot Lenni just patched this to death: the property name "ususers" is correct and not a typo. See https://www.mediawiki.org/wiki/API:Users
const getUserQueryObj = (user: string): UserQueryObject => ({
  ...basicQueryData,
  action: 'query',
  list: 'users',
  ususers: user,
});

export async function userExists(user: string) {
  const apiUrl = buildQueryUrl(getUserQueryObj(user));
  const data = await apiCall(apiUrl);
  if (!isQueryResponse(data)) return false;
  const userObj = data.query.users[0];
  return Boolean(userObj.userid);
}

export async function apiCall(url: string): Promise<unknown> {
  const data = await fetch(url);
  const textData = await data.text();
  const json: unknown = JSON.parse(textData, (_key, value) => decode(value));
  return json;
}

export async function downloadFile(requestString: string) {
  const apiResponse = await apiCall(getFileQueryApiUrl(requestString));
  if (!isParsedSummary(apiResponse)) return;
  const galleryItemLinks = apiResponse.parse.parsedsummary['*'];

  const parser = new DOMParser();

  const galleryDom = parser.parseFromString(typeof galleryItemLinks === 'string' ? galleryItemLinks : '', 'text/html');
  const links = galleryDom.querySelectorAll<HTMLAnchorElement>('a');

  return links;
}

export async function fetchSectionWikiText(pageName: string, section: number) {
  const url = getPageSectionContentApiUrl(pageName, section);
  const apiResponse = await apiCall(url);
  if (!isWikitext(apiResponse)) return;
  const sectionWikitext = apiResponse.parse.wikitext['*'];
  return sectionWikitext;
}
