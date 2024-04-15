export interface SimplifiedSectionQueryResponseSectionObject {
  line: string;
  index: string;
}

export interface SectionQueryResponseSectionObject extends SimplifiedSectionQueryResponseSectionObject {
  toclevel: number;
  level: string;
  number: string;
  fromtitle: string;
  byteoffset: number;
  anchor: string;
}

export interface SectionQueryResponseObject {
  parse: {
    title: string;
    pageid: number;
    sections: SectionQueryResponseSectionObject[];
    showtoc: string;
  };
}

export interface ParsedSummaryObject {
  parse: {
    title: string;
    pageid: number;
    parsedsummary: {
      '*': string;
    };
  };
}

export interface ParsedWikitextObject {
  parse: {
    title: string;
    pageid: number;
    wikitext: {
      '*': string;
    };
  };
}

export interface QueryResponseObject {
  batchcomplete: string;
  query: {
    users: {
      name: string;
      userid: number;
    }[];
  };
}

export interface CargoQueryResponse {
  cargoquery: {
    title: Record<string, string | null>;
  }[];
}

export interface CargoQueryBaseNameResponse {
  cargoquery: {
    title: {
      Name: string;
    };
  }[];
}
