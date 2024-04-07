import {
  isValidHttpUrl,
  validateCoords,
  validateDiscord,
  validateFriendCode,
  validatePlayerName,
  validateReddit,
} from '@/helpers/formValidation';
import { apiCall, getFileQueryApiUrl, getPageSectionContentApiUrl, getPageSectionsApiUrl } from '@/helpers/wikiApi';
import { parseWikiTemplate } from '@/helpers/wikiTemplateParser';
import type { CensusEntry } from '@/types/censusQueryResponse';
import type { FileItem } from '@/types/file';
import type { BaseData, ImageData, PlayerData, SectionObject } from '@/types/pageData';
import { currentYearString, weekInMilliseconds } from '@/variables/dateTime';
import { isMakingNewPage, isNewCitizen, isUpdatingPage } from '@/variables/formMode';
import { regionArray } from '@/variables/regions';
import { defaultSections } from '@/variables/wikiSections';
import { defineStore } from 'pinia';

interface SimplifiedSectionQueryResponseObject {
  line: string;
  index: string;
}

interface SectionQueryResponseObject extends SimplifiedSectionQueryResponseObject {
  toclevel: number;
  level: string;
  number: string;
  fromtitle: string;
  byteoffset: number;
  anchor: string;
}

interface Validation {
  wikiUserExists: boolean;
}

interface WikiPageData {
  sectionData: SectionObject[];
  validation: Validation;
  playerData: PlayerData;
  baseData: BaseData;
  imageData: ImageData;
}

const defaultStoreObject: WikiPageData = {
  sectionData: defaultSections,
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
const newPageLocalStorageKey = isMakingNewPage ? 'newBase' : 'updateBase';
const localStorageKey = isNewCitizen ? 'censusForm' : newPageLocalStorageKey;

const localStorageData = localStorage.getItem(localStorageKey);
const localStorageDataJson: WikiPageData = JSON.parse(localStorageData ?? defaultStoreObjectString);

const sessionStorageData = sessionStorage.getItem('update');
const sessionStorageDataJson: CensusEntry = JSON.parse(sessionStorageData ?? '{}');

// if sessionstorage has our data, we use that to populate the store
if (!isNewCitizen && sessionStorageData) {
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
  const censusReddit = sessionStorageDataJson.CensusReddit ?? '';
  const censusRedditLink = censusReddit.startsWith('[') ? censusReddit.slice(1, -1).split(' ')[0] : censusReddit;
  const isCensusRedditUrl = isValidHttpUrl(censusRedditLink);
  const isRedditUrl = isCensusRedditUrl && censusReddit.includes('reddit.com');

  const censusRedditUrlOrEmpty = isCensusRedditUrl ? censusRedditLink : '';
  localStorageDataJson.playerData.social = isRedditUrl ? '' : censusRedditUrlOrEmpty;

  localStorageDataJson.playerData.wikiName = sessionStorageDataJson.Builderlink ?? '';

  if (isUpdatingPage) {
    localStorageDataJson.baseData.baseName = sessionStorageDataJson.Name ?? '';
  }
}

export const useWikiPageDataStore = defineStore('wikiPageData', {
  state: (): WikiPageData => structuredClone(localStorageDataJson),

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
    async fetchBaseWikiData() {
      const infobox = await this.fetchInfobox();

      const sectionData = await this.fetchAvailableSectionInfo();
      const gallerySectionData = sectionData.pop();
      sectionData.forEach(this.fetchWikiText);

      if (gallerySectionData) await this.fetchGalleryData(gallerySectionData);
    },

    async fetchAvailableSectionInfo() {
      const url = getPageSectionsApiUrl(this.baseData.baseName);
      const { parse } = await apiCall(url);
      const sectionArray: SectionQueryResponseObject[] = parse.sections;
      const usedSections = sectionArray.slice(1);
      const firstLevelSections = usedSections.filter((section) => section.toclevel === 1);
      const relevantSectionInfo: SimplifiedSectionQueryResponseObject[] = firstLevelSections.map(({ line, index }) => ({
        line,
        index,
      }));
      return relevantSectionInfo;
    },

    async fetchWikiText(sectionData: SimplifiedSectionQueryResponseObject, index: number) {
      const lowerCaseHeading = sectionData.line.toLowerCase();
      const itemInSectionData = defaultSections.find((item) => item.heading.toLowerCase() === lowerCaseHeading);
      const sectionObject: SectionObject = {
        heading: itemInSectionData?.heading ?? sectionData.line, // fixing potential spelling mistakes
        body: '',
        explanation: itemInSectionData?.explanation,
        loading: true,
        required: itemInSectionData?.required,
      };

      const missingItems = index - this.sectionData.length;

      for (let i = missingItems; i > 0; i--) {
        this.sectionData.push({ heading: '', body: '' });
      }

      this.sectionData = this.sectionData.with(index, sectionObject);

      const sectionWikitext = await this.fetchSectionWikiText(parseInt(sectionData.index));

      sectionObject.body = sectionWikitext.split('\n').slice(1).join('\n');
      sectionObject.loading = false;
    },

    async fetchInfobox() {
      const sectionWikitext = await this.fetchSectionWikiText(0);
      const infoboxObject = parseWikiTemplate(sectionWikitext, 'Base infobox');
      return infoboxObject;
    },

    async fetchSectionWikiText(section: number) {
      const url = getPageSectionContentApiUrl(this.baseData.baseName, section);
      const { parse } = await apiCall(url);
      const sectionWikitext: string = parse.wikitext['*'];
      return sectionWikitext;
    },

    async fetchGalleryData(gallerySectionData: SimplifiedSectionQueryResponseObject) {
      const gallerySectionText = await this.fetchSectionWikiText(parseInt(gallerySectionData.index));
      const picLines = gallerySectionText.split('\n').slice(2, -1); // remove gallery heading and gallery tags
      const picsAndDescs = picLines.map((item) => item.split('|'));

      const requestItems = picsAndDescs.map((item) => `[[Media:${item[0]}|${item[1] ?? ' '}]]`);

      const requestString = requestItems.join('');

      const { parse } = await apiCall(getFileQueryApiUrl(requestString));
      const galleryItemLinks = parse.parsedsummary['*'];

      const parser = new DOMParser();

      const galleryDom = parser.parseFromString(
        typeof galleryItemLinks === 'string' ? galleryItemLinks : '',
        'text/html'
      );

      const links = galleryDom.querySelectorAll<HTMLAnchorElement>('a:not(.new)');

      const fileItems: FileItem[] = Array.from(links).map((item, index) => ({
        id: index * -1 - 1, // making index negative to distinguish preload from manually added items (0 -> -1, 5 -> -6)
        desc: item.innerText,
        url: item.href.split('/').slice(0, -2).join('/'),
      }));

      this.imageData.gallery = fileItems;

      console.log(this.imageData.gallery);

      // TODO: get pic URLs from API
      // display them like normal pics
      // don't send them with the submission
    },

    resetStore() {
      this.$patch(structuredClone(defaultStoreObject));
    },
  },
});
