import {
  isValidHttpUrl,
  validateCoords,
  validateDiscord,
  validateFriendCode,
  validatePlayerName,
  validateReddit,
} from '@/helpers/formValidation';
import { getPageSectionContentApiUrl, getPageSectionsApiUrl } from '@/helpers/wikiApi';
import { parseWikiTemplate } from '@/helpers/wikiTemplateParser';
import type { CensusEntry } from '@/types/censusQueryResponse';
import type { BaseData, ImageData, PlayerData } from '@/types/pageData';
import { currentYearString, weekInMilliseconds } from '@/variables/dateTime';
import { isMakingNewPage, isNewCitizen } from '@/variables/formMode';
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
    renewals: [currentYearString],
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

// kinda ugly and doesn't scale, but idk how else to do this without using an IIFE or some really ugly mapping code
const localStorageKey = isNewCitizen ? 'censusForm' : isMakingNewPage ? 'newBase' : 'updateBase';

const localStorageData = localStorage.getItem(localStorageKey);
const localStorageDataJson: WikiPageData = JSON.parse(localStorageData ?? defaultStoreObjectString);

const sessionStorageData = sessionStorage.getItem('update');
const sessionStorageDataJson: CensusEntry = JSON.parse(sessionStorageData ?? '{}');

// if sessionstorage has our data, we use that to populate the store
if (isMakingNewPage && sessionStorageData) {
  localStorageDataJson.playerData.arrival = new Date(sessionStorageDataJson.CensusArrival).toISOString().split('T')[0];
  localStorageDataJson.playerData.discord = sessionStorageDataJson.CensusDiscord;
  localStorageDataJson.playerData.reddit = sessionStorageDataJson.CensusReddit?.includes('reddit.com')
    ? sessionStorageDataJson.CensusReddit.split(' ')[1].slice(0, -1)
    : '';
  localStorageDataJson.playerData.player = sessionStorageDataJson.CensusPlayer;
  localStorageDataJson.playerData.friend = sessionStorageDataJson.CensusFriend ?? '';
  localStorageDataJson.playerData.renewals = sessionStorageDataJson.renewals;

  // first we check whether this is not null, since the API can return null.
  // then we check whether the value is a reddit link. If yes, then that's already handled by the CensusReddit field.
  // if it's not a reddit link, we check if it's a URL. It could also be a wiki profile, which isn't a URL.
  // if it's a link, we return the raw link.
  // if it's a wiki profile, that's handled by the wikiname field.
  localStorageDataJson.playerData.social = sessionStorageDataJson.CensusReddit
    ? sessionStorageDataJson.CensusReddit.includes('reddit.com')
      ? ''
      : isValidHttpUrl(sessionStorageDataJson.CensusReddit ?? '')
        ? sessionStorageDataJson.CensusReddit?.split(' ')[0].slice(1)
        : ''
    : '';

  const secionContentApiUrl = getPageSectionContentApiUrl(sessionStorageDataJson.Name, 0);
  const sectionContentResponse = await fetch(secionContentApiUrl);
  const sectionContent = await sectionContentResponse.json();
  const wikitext = sectionContent.parse.wikitext['*'];
  const { builderlink } = parseWikiTemplate(wikitext, 'Base infobox')[0];

  localStorageDataJson.playerData.wikiName = builderlink;
}

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
      this.imageData.gallery = []; // $patch apparently doesn't work well with arrays, so we need to replace it manually
    },
  },
});
