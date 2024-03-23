interface RawCensusEntry {
  Name: string;
  CensusPlayer: string;
  CensusDiscord: string;
  CensusFriend: string;
  CensusReddit: string;
  Mode: string;
  Platform: string;
  System: string;
}

// change string to array for later code to consume
export interface CensusEntry extends RawCensusEntry {
  CensusRenewal: string[];
  CensusArrival: Date;
  GameRelease: string;
}

// returned from query
interface QueryCensusEntry extends RawCensusEntry {
  CensusRenewal: string;
  CensusArrival: string;
  'Game release': string;
}

// API query returns an array of these
export interface QueryEntry {
  title: QueryCensusEntry;
}
