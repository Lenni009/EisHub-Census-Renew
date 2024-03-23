interface RawCensusEntry {
  Name: string;
  CensusPlayer: string;
}

// change string to array for later code to consume
export interface CensusEntry extends RawCensusEntry {
  CensusRenewal: string[];
}

// returned from query
interface QueryCensusEntry extends RawCensusEntry {
  CensusRenewal: string;
}

// API query returns an array of these
export interface QueryEntry {
  title: QueryCensusEntry;
}
