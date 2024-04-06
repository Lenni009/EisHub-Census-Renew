import type { FileItem } from './file';

export type Modes = 'Normal' | 'Relaxed' | 'Survival' | 'Permadeath' | 'Creative' | 'Custom';
export type Platforms = 'PC' | 'PlayStation' | 'Xbox' | 'Switch';
export type ExplicitBoolean = 'Yes' | 'No';

export interface PlayerData {
  discord: string;
  reddit: string;
  social: string;
  wikiName: string;
  player: string;
  friend: string;
  arrival: string;
  renewals: string[];
  shareTimezone: boolean;
  activeTime: string;
}

export interface BaseData {
  platform: Platforms | undefined;
  mode: Modes | undefined;
  baseName: string;
  system: string;
  planet: string;
  moon: string;
  axes: string;
  glyphs: string;
  farm: boolean;
  geobay: boolean;
  arena: boolean;
  racetrack: boolean;
  landingpad: boolean;
  terminal: boolean;
  type: string;
}

export interface ImageData {
  image: File | null;
  gallery: FileItem[];
}

type AllProps = ImageData & PlayerData & BaseData;
export type OptionalProps = keyof AllProps;

export interface SectionObject {
  heading: string;
  body: string;
  explanation?: string;
  loading?: boolean;
  required?: boolean;
}

export interface BasePageFields {
  version: string;
  name: string;
  image: string;
  builderlink?: string;
  builder?: string;
  region: string;
  system: string;
  planet: string;
  moon: string;
  axes: string;
  glyphs: string;
  type: string;
  mode: Modes;
  platform: Platforms;
  farm: ExplicitBoolean;
  geobay: ExplicitBoolean;
  landingpad: ExplicitBoolean;
  arena: ExplicitBoolean;
  terminal: ExplicitBoolean;
  racetrack: ExplicitBoolean;
  censusPlayer: string;
  censusReddit?: string;
  censusSocial?: string;
  censusDiscord?: string;
  censusFriend?: string;
  arrival: string;
  renew: string;
  galleryPics: string;
  sections: SectionObject[];
}
