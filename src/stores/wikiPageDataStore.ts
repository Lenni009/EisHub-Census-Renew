import {
  isValidHttpUrl,
  validateCoords,
  validateDiscord,
  validateFriendCode,
  validatePlayerName,
  validateReddit,
} from '@/helpers/formValidation';
import { getPageSectionContentApiUrl, getPageSectionsApiUrl } from '@/helpers/wikiApi';
import type { BaseData, ImageData, PlayerData } from '@/types/pageData';
import { weekInMilliseconds } from '@/variables/dateTime';
import { regionArray } from '@/variables/regions';
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
interface Validation {
  wikiUserExists: boolean;
}

interface WikiPageData {
  pageName: string;
  sectionData: SectionObject[];
  validation: Validation;
  playerData: PlayerData;
  baseData: BaseData;
  imageData: ImageData;
}

const defaultStoreObject: WikiPageData = {
  pageName: '',
  sectionData: [{ name: 'Layout' }, { name: 'Features' }, { name: 'Additional Information' }],
  validation: {
    wikiUserExists: true,
  },
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

// localstorage gets cleared after one week
const currentDate = Date.now();
const lastUpdated = localStorage.getItem('lastUpdated') ?? currentDate.toString();
const lastUpdatedNumber = parseInt(lastUpdated);
if (currentDate - lastUpdatedNumber > weekInMilliseconds) localStorage.removeItem('censusForm');

const localStorageData = localStorage.getItem('censusForm');
const localStorageDataJson: WikiPageData = JSON.parse(localStorageData ?? defaultStoreObjectString);

export const useWikiPageDataStore = defineStore('wikiPageData', {
  state: (): WikiPageData => localStorageDataJson,

  getters: {
    isDiscordValid: (state) => validateDiscord(state.playerData.discord),
    isRedditValid: (state) => validateReddit(state.playerData.reddit),
    isSocialValid: (state) => isValidHttpUrl(state.playerData.social),
    isNameValid: (state) => validatePlayerName(state.playerData.player),
    isFriendValid: (state) => validateFriendCode(state.playerData.friend),
    isAxesValid: (state) => validateCoords(state.baseData.axes),
    region: (state) => regionArray.find((item) => item[0] === state.baseData.glyphs.slice(4))?.[1] ?? '',
  },

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
      this.imageData.gallery = [];  // $patch apparently doesn't work well with arrays, so we need to replace it manually
    },
  },
});
