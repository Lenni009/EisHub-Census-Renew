import { getPageSectionContentApiUrl, getPageSectionsApiUrl } from '@/helpers/wikiApi';
import type { FileItem } from '@/types/file';
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

interface WikiPageData {
  pageName: string;
  sectionData: SectionObject[];
  discord: string;
  reddit: string;
  social: string;
  wikiName: string;
  player: string;
  friend: string;
  platform: 'PC' | 'PlayStation' | 'Xbox' | 'Switch' | null;
  mode: 'Normal' | 'Relaxed' | 'Survival' | 'Permadeath' | 'Creative' | 'Custom' | null;
  arrival: string;
  shareTimezone: boolean;
  activeTime: string;
  baseName: string;
  image: File | null;
  region: string;
  system: string;
  planet: string;
  moon: string;
  axes: string;
  glyphs: string;
  farm: boolean | null;
  geobay: boolean | null;
  arena: boolean | null;
  racetrack: boolean | null;
  landingpad: boolean | null;
  terminal: boolean | null;
  type: string;
  layout: string;
  features: string;
  addInfo: string;
  gallery: FileItem[];
}

export const useWikiPageDataStore = defineStore('wikiPageData', {
  state: (): WikiPageData => ({
    pageName: '',
    sectionData: [{ name: 'Layout' }, { name: 'Features' }, { name: 'Additional Information' }],
    discord: '',
    reddit: '',
    social: '',
    wikiName: '',
    player: '',
    friend: '',
    platform: null,
    mode: null,
    arrival: '',
    shareTimezone: false,
    activeTime: '',
    baseName: '',
    image: null,
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
    gallery: [],
  }),

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
  },
});
