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
  limit: number;
  tables: string;
  fields: string[];
  where: string;
}

export interface CensusQueryObject extends BasicCargoQueryData {
  order_by: string;
}

export type QueryObjects = SectionQueryObject | SectionContentQueryObject | BasicCargoQueryData | CensusQueryObject;
