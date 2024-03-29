import type {
  BasicCargoQueryData,
  BasicQueryData,
  CensusQueryObject,
  QueryObjects,
  RawQueryObject,
  SectionContentQueryObject,
  SectionQueryObject,
} from '@/types/queryObjects';
import { apiPath } from '@/variables/wikiLink';

// generic function to build a URL from an object
const buildQueryObject = (queryObject: QueryObjects) =>
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
export const getPageSectionsApiUrl = (pageName: string) => buildQueryObject(getSectionQueryObject(pageName));
export const getPageSectionContentApiUrl = (pageName: string, section: number) =>
  buildQueryObject(getSectionContentQueryObject(pageName, section));

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
  ],
  where: `CensusShow IS NOT NULL AND Civilized="${civilized}"`,
  order_by: 'CensusRenewal',
});

const getBaseQueryObject = (baseName: string): BasicCargoQueryData => ({
  ...getCargoQueryRawObject(),
  fields: ['Type', 'Farm', 'Geobay', 'Landing_pad', 'Arena', 'Terminal', 'Racetrack'],
  where: `Name="${baseName}"`,
});

// exported functions to get cargo query URLs
export const getCensusQueryUrl = (civilized: string) => buildQueryObject(getCensusQueryObject(civilized));
export const getBaseQueryUrl = (baseName: string) => buildQueryObject(getBaseQueryObject(baseName));
