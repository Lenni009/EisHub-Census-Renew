import type { LinkObj } from '@/types/linkObj';
import { wikiLink } from '@/variables/wikiLink';

export function parseExternalUserLink(link: string): LinkObj {
  const syntaxRemoved = link.slice(1, -1);
  const linkParts = syntaxRemoved.split(' ');
  return {
    link: linkParts[0],
    text: linkParts[1],
  };
}

export function parseWikiUserLink(link: string): LinkObj {
  const syntaxRemoved = link.slice(2, -2);
  const linkParts = syntaxRemoved.split('|');
  return {
    link: `${wikiLink}${linkParts[0]}`,
    text: linkParts[1],
  };
}

export function parseUserLink(link: string): LinkObj {
  if (link.startsWith('[http')) return parseExternalUserLink(link);
  if (link.startsWith('[[')) return parseWikiUserLink(link);
  return {
    link,
    text: link,
  };
}
