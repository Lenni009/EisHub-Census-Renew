import { wikiEditLink, wikiLink } from '@/variables/wikiLink';

export const buildWikiEditLink = (pagename: string) => new URL(`${wikiEditLink}${pagename}`).toString();
export const buildWikiPageLink = (pagename: string) => new URL(`${wikiLink}${pagename}`).toString();
