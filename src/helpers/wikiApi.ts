import type {
  BasicCargoQueryData,
  BasicQueryApiData,
  BasicQueryData,
  CensusQueryObject,
  GalleryQueryObject,
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
import { isQueryResponse } from './typeGuards';

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
  fields: ['Count(DISTINCT CensusPlayer)'],
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

// exported functions to get cargo query URLs
export const getCensusQueryDataUrl = (civilized: string, offset: number) =>
  buildQueryUrl(getCensusQueryDataObject(civilized, offset));
export const getCensusQueryCountUrl = (civilized: string) => buildQueryUrl(getCensusQueryCountObject(civilized));
export const getBaseQueryUrl = (baseName: string) => buildQueryUrl(getBaseQueryObject(baseName));

// check whether user exists on the wiki
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
  const json = await data.json();
  return json;
}
