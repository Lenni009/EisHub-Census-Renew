interface RawCensusEntry {
  Name: string;
  CensusPlayer: string;
}

export interface CensusEntry extends RawCensusEntry {
  CensusRenewal: string[];
}

interface QueryCensusEntry extends RawCensusEntry {
  CensusRenewal: string;
}

export interface QueryEntry {
  title: QueryCensusEntry;
}
