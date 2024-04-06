export interface BasicQueryData {
  format: string;
  origin: string;
}

interface BasicQueryApiData extends BasicQueryData {
  action: string;
}

export interface RawQueryObject extends BasicQueryApiData {
  page: string;
}

export interface SectionQueryObject extends RawQueryObject {
  prop: string;
}

export interface SectionContentQueryObject extends SectionQueryObject {
  section: number;
}

export interface BasicCargoQueryData extends BasicQueryApiData {
  tables: string;
  limit: number;
}

export interface RawCensusQueryWhereObject extends BasicCargoQueryData {
  where: string;
}

export interface RawCensusQueryObject extends RawCensusQueryWhereObject {
  fields: string[];
}

export interface CensusQueryObject extends RawCensusQueryObject {
  order_by: string;
  group_by: string;
  offset: number;
}

export interface UserQueryObject extends BasicQueryApiData {
  list: string;
  ususers: string;
}

export type QueryObjects =
  | SectionQueryObject
  | SectionContentQueryObject
  | BasicCargoQueryData
  | CensusQueryObject
  | UserQueryObject;
