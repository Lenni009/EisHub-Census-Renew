export const getPageSectionsApiUrl = (pageName: string) =>
  `https://nomanssky.fandom.com/api.php?action=parse&format=json&origin=*&page=${pageName}&prop=sections&contentmodel=wikitext`;

export const getPageSectionContentApiUrl = (pageName: string, section: number) =>
  `https://nomanssky.fandom.com/api.php?action=parse&format=json&origin=*&page=${pageName}&prop=wikitext&section=${section}&contentmodel=wikitext`;
