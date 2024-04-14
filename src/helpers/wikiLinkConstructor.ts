import { wikiEditLink } from '@/variables/wikiLink';

export const buildWikiEditLink = (pagename: string) => new URL(`${wikiEditLink}${pagename}`).toString();
