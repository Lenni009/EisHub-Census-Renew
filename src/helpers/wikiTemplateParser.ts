import parseMediawikiTemplate from 'parse-mediawiki-template';

// this is just a wrapper to provide proper typing for the function.
// this won't be needed anymore once https://github.com/plepe/parse-mediawiki-template/pull/1 is merged.
export const parseWikiTemplate = (wikitext: string, template: string): Record<string, string>[] =>
  parseMediawikiTemplate(wikitext, template);
