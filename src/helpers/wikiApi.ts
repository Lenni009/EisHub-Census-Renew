import type {
  BasicCargoQueryData,
  BasicQueryData,
  CensusQueryObject,
  QueryObjects,
  RawQueryObject,
  SectionContentQueryObject,
  SectionQueryObject,
  UserQueryObject,
} from '@/types/queryObjects';
import { apiPath } from '@/variables/wikiLink';

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
const getSectionQueryRawObject = (page: string): RawQueryObject => ({
  ...basicQueryData,
  action: 'parse',
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

// cargo
const getCargoQueryRawObject = () => ({
  ...basicQueryData,
  action: 'cargoquery',
  limit: 500,
  tables: 'Bases',
});

const getCensusQueryObject = (civilized: string): CensusQueryObject => ({
  ...getCargoQueryRawObject(),
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
  where: `CensusShow IS NOT NULL AND Civilized="${civilized}"`,
  order_by: 'CensusRenewal',
  group_by: 'CensusPlayer',
});

const getBaseQueryObject = (baseName: string): BasicCargoQueryData => ({
  ...getCargoQueryRawObject(),
  fields: ['Type', 'Farm', 'Geobay', 'Landing_pad', 'Arena', 'Terminal', 'Racetrack'],
  where: `Name="${baseName}"`,
});

// exported functions to get cargo query URLs
export const getCensusQueryUrl = (civilized: string) => buildQueryUrl(getCensusQueryObject(civilized));
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
  const data = await fetch(apiUrl);
  const jsonData = await data.json();

  const userObj = jsonData.query.users[0];
  return Boolean(userObj.userid);
}
