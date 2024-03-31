import { getPageSectionContentApiUrl, getPageSectionsApiUrl } from '@/helpers/wikiApi';
import type { FileItem } from '@/types/file';
import type { Modes, Platforms } from '@/types/pageData';
import { defineStore } from 'pinia';

interface SectionObject {
  name: string;
  index?: number;
  text?: string;
  loading?: boolean;
}

interface SectionQueryObject {
  toclevel: number;
  level: string;
  line: string;
  number: string;
  index: string;
  fromtitle: string;
  byteoffset: number;
  anchor: string;
}

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
  region: string;
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

interface WikiPageData {
  pageName: string;
  sectionData: SectionObject[];
  playerData: PlayerData;
  baseData: BaseData;
  imageData: ImageData;
}

const defaultStoreObject: WikiPageData = {
  pageName: '',
  sectionData: [{ name: 'Layout' }, { name: 'Features' }, { name: 'Additional Information' }],
  playerData: {
    discord: '',
    reddit: '',
    social: '',
    wikiName: '',
    player: '',
    friend: '',
    arrival: '',
    shareTimezone: false,
    activeTime: '',
  },
  baseData: {
    platform: undefined, // NoSonar undefined is the proper value
    mode: undefined, // NoSonar undefined is the proper value
    baseName: '',
    region: '',
    system: '',
    planet: '',
    moon: '',
    axes: '',
    glyphs: '',
    farm: false,
    geobay: false,
    arena: false,
    racetrack: false,
    landingpad: false,
    terminal: false,
    type: '',
    layout: '',
    features: '',
    addInfo: '',
  },
  imageData: {
    image: null,
    gallery: [],
  },
};

const defaultStoreObjectString = JSON.stringify(defaultStoreObject);

const localStorageData = localStorage.getItem('censusForm');
const localStorageDataJson: WikiPageData = JSON.parse(localStorageData ?? defaultStoreObjectString);

export const useWikiPageDataStore = defineStore('wikiPageData', {
  state: (): WikiPageData => localStorageDataJson,

  actions: {
    async fetchWikiText() {
      this.sectionData.forEach((item: SectionObject) => (item.loading = true));

      const pageSectionsApiUrl = getPageSectionsApiUrl(this.pageName);

      const sectionRes = await fetch(pageSectionsApiUrl);
      const { parse } = await sectionRes.json();

      this.sectionData.forEach((obj: SectionObject) => {
        const idx = parse.sections.find((item: SectionQueryObject) => item.line === obj.name)?.index;
        if (idx) obj.index = parseInt(idx);
      });

      this.sectionData.forEach(this.getWikiTexts);
    },

    async getWikiTexts(section: SectionObject) {
      try {
        const { index } = section;
        const pageSectionContentApiUrl = getPageSectionContentApiUrl(this.pageName, index ?? -1);
        const res = await fetch(pageSectionContentApiUrl);
        const { parse } = await res.json();
        const parsedWikitext = parse.wikitext['*'];
        section.text = parsedWikitext.split('\n').slice(1).join('\n');
      } catch (e) {
        console.error('Something went wrong:', e);
        section.text = '';
      } finally {
        section.loading = false;
      }
    },

    resetStore() {
      this.$patch(defaultStoreObject);
    },
  },
});
