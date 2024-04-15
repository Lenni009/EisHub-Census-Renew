import { getMediaLink, getWorkingImageLink } from '@/helpers/fileDownload';
import { removeFilePrefix } from '@/helpers/fileRename';
import {
  isValidHttpUrl,
  validateCoords,
  validateDiscord,
  validateFriendCode,
  validatePlayerName,
  validateReddit,
} from '@/helpers/formValidation';
import { isSectionQueryResponse, isValidModeValue, isValidPlatformValue } from '@/helpers/typeGuards';
import { apiCall, downloadFile, fetchSectionWikiText, getPageSectionsApiUrl } from '@/helpers/wikiApi';
import { parseWikiTemplate } from '@/helpers/wikiTemplateParser';
import type { CensusEntry } from '@/types/censusQueryResponse';
import type { FileItem } from '@/types/file';
import type { BaseData, ImageData, PlayerData, SectionObject } from '@/types/pageData';
import type { SimplifiedSectionQueryResponseSectionObject } from '@/types/queryResponse';
import { currentYearString, weekInMilliseconds } from '@/variables/dateTime';
import { isMakingNewPage, isNewCitizen, isUpdatingPage } from '@/variables/formMode';
import { expectedGlyphLength } from '@/variables/formValidation';
import { defaultFileItem } from '@/variables/imageData';
import { regionArray } from '@/variables/regions';
import { defaultSections } from '@/variables/wikiSections';
import { defineStore } from 'pinia';

interface Validation {
  wikiUserExists: boolean;
}

interface WikiPageData {
  version: string;
  sectionData: SectionObject[];
  validation: Validation;
  playerData: PlayerData;
  baseData: BaseData;
  imageData: ImageData;
}

const defaultStoreObject: WikiPageData = {
  version: '',
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
    image: structuredClone(defaultFileItem),
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
  const redditHosts = ['reddit.com', 'www.reddit.com', 'old.reddit.com'];
  localStorageDataJson.playerData.arrival = new Date(sessionStorageDataJson.CensusArrival).toISOString().split('T')[0];
  localStorageDataJson.playerData.discord = sessionStorageDataJson.CensusDiscord;

  const assumeRedditLink = (sessionStorageDataJson.CensusReddit ?? '').slice(1, -1).split(' ')[0];

  const redditHost = isValidHttpUrl(assumeRedditLink ?? '') ? new URL(assumeRedditLink).host : '';
  const redditLinkIsReddit = redditHosts.includes(redditHost);
  localStorageDataJson.playerData.reddit =
    sessionStorageDataJson.CensusReddit && redditLinkIsReddit
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
  const censusRedditUrlHost = isCensusRedditUrl ? new URL(censusRedditLink).host : '';
  const isRedditUrl = isCensusRedditUrl && redditHosts.includes(censusRedditUrlHost);

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
    isSocialValid: (state) => !state.playerData.social || isValidHttpUrl(state.playerData.social),
    isNameValid: (state) => validatePlayerName(state.playerData.player),
    isFriendValid: (state) => validateFriendCode(state.playerData.friend),
    isAxesValid: (state) => validateCoords(state.baseData.axes),
    isImageDataValid: (state) => Boolean(state.imageData.image.filename),
    region: (state) => regionArray.find((item) => item[0] === state.baseData.glyphs.slice(4))?.[1] ?? '',
  },

  actions: {
    async fetchVersionTemplate() {
      const section = await fetchSectionWikiText('Template:Base preload', 0);
      const version = parseWikiTemplate(section ?? '', 'Version')[0]['1'];  // unnamed parameters are 1-indexed
      this.version = version;
    },

    async fetchBaseWikiData() {
      // this function uses async methods, but doesn't await them to improve performance.
      // the individual methods handle the required awaiting on their own.
      const promises = [this.handleInfoboxLoading(), this.handleGalleryLoading()];
      await Promise.all(promises);
    },

    async handleInfoboxLoading() {
      const [infobox] = await this.fetchInfobox();
      const imageDataPromise = this.fetchImageData(infobox.image);
      this.baseData.axes = infobox.axes ?? '';
      this.baseData.glyphs = infobox.glyphs ?? '';
      this.baseData.arena = infobox.arena === 'Yes';
      this.baseData.farm = infobox.farm === 'Yes';
      this.baseData.geobay = infobox.geobay === 'Yes';
      this.baseData.landingpad = infobox.landingpad === 'Yes';
      this.baseData.racetrack = infobox.racetrack === 'Yes';
      this.baseData.terminal = infobox.terminal === 'Yes';
      this.baseData.platform = isValidPlatformValue(infobox.platform) ? infobox.platform : undefined;
      this.baseData.mode = isValidModeValue(infobox.mode) ? infobox.mode : undefined;
      this.baseData.system = infobox.system ?? '';
      this.baseData.planet = infobox.planet ?? '';
      this.baseData.moon = infobox.moon ?? '';
      this.baseData.type = infobox.type ?? '';
      this.imageData.image.filename = infobox.image;
      this.baseData.glyphs =
        infobox.portalglyphs.length === expectedGlyphLength
          ? infobox.portalglyphs
          : parseWikiTemplate(infobox.portalglyphs.toLowerCase(), 'gl/small')[0]['1'].toUpperCase();
      await imageDataPromise;
    },

    async handleGalleryLoading() {
      // same as above, there are multiple async methods here, but only the initial section data is awaited, since the other two depend on it
      const sectionData = this.fetchAvailableSectionInfo();

      const promises: Promise<void>[] = [];

      // squeezing every last drop of performance by doing any unnecessary stuff first, then awaiting the promise
      const resolvedSectionData = await sectionData;
      if (!resolvedSectionData) return;

      const gallerySectionData = resolvedSectionData.pop();
      if (gallerySectionData) promises.push(this.fetchGalleryData(gallerySectionData));
      promises.push(...resolvedSectionData.map(this.fetchWikiText));

      // enable other methods to await this function and its sub-functions' completions
      await Promise.all(promises);
    },

    async fetchAvailableSectionInfo() {
      const url = getPageSectionsApiUrl(this.baseData.baseName);
      const apiResponse = await apiCall(url);
      if (!isSectionQueryResponse(apiResponse)) return;
      const sectionArray = apiResponse.parse.sections;
      const usedSections = sectionArray.slice(1);
      const firstLevelSections = usedSections.filter((section) => section.toclevel === 1);
      const relevantSectionInfo = firstLevelSections.map(({ line, index }) => ({
        line,
        index,
      }));
      return relevantSectionInfo;
    },

    async fetchWikiText(sectionData: SimplifiedSectionQueryResponseSectionObject, index: number) {
      const sectionWikitext = this.fetchBaseSectionWikiText(parseInt(sectionData.index));
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

      const sectionObjectInData = this.sectionData[index];
      sectionObjectInData.body = (await sectionWikitext)?.split('\n').slice(1).join('\n') ?? '';
      sectionObjectInData.loading = false;
    },

    async fetchInfobox() {
      const sectionWikitext = await this.fetchBaseSectionWikiText(0);
      const infoboxObject = parseWikiTemplate(sectionWikitext ?? '', 'Base infobox');
      return infoboxObject;
    },

    async fetchBaseSectionWikiText(section: number) {
      return await fetchSectionWikiText(this.baseData.baseName, section);
    },

    async fetchGalleryData(gallerySectionData: SimplifiedSectionQueryResponseSectionObject) {
      const gallerySectionText = await this.fetchBaseSectionWikiText(parseInt(gallerySectionData.index));
      if (!gallerySectionText) return;
      const picLines = gallerySectionText.split('\n').slice(2, -1); // remove gallery heading and gallery tags
      if (!picLines.length) return;
      const picsAndDescs = picLines.map((item) => item.split('|'));

      const fileObjects: FileItem[] = picsAndDescs.map(([filename, desc], index) => ({
        desc,
        filename: removeFilePrefix(filename),
        id: index * -1 - 1, // making index negative to distinguish preload from manually added items (0 -> -1, 5 -> -6)
        url: '',
      }));

      const filenames = fileObjects.map((item) => item.filename);

      const requestItems = filenames.map(getMediaLink);

      const requestString = requestItems.join('');

      const links = await downloadFile(requestString);

      if (!links) return;

      for (let i = 0; i < links.length; i++) {
        const link = links[i];
        const fileItem = fileObjects[i];

        const isInternal = link.classList.contains('internal'); // filters out external and non-existing links

        fileItem.url = isInternal ? getWorkingImageLink(link.href) : '';
      }

      const validFileItems = fileObjects.filter((item) => item.url);
      this.imageData.gallery = validFileItems;
    },

    async fetchImageData(imageName: string) {
      const mediaLink = getMediaLink(imageName);
      const files = await downloadFile(mediaLink);
      if (!files) return;
      const file = files[0];

      const isInternal = file.classList.contains('internal'); // filters out external and non-existing links

      this.imageData.image.url = isInternal ? getWorkingImageLink(file.href) : '';
    },

    resetStore() {
      this.$patch(structuredClone(defaultStoreObject));
    },
  },
});
