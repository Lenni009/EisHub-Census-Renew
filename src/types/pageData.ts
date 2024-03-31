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
  layout: string;
  features: string;
  addInfo: string;
}

export interface ImageData {
  image: File | null;
  gallery: FileItem[];
}

type AllProps = ImageData & PlayerData & BaseData;
export type OptionalProps = keyof AllProps;
