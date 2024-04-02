interface RawCensusEntry {
  Name: string; // name of base
  CensusPlayer: string; // player name
  CensusDiscord: string;
  CensusFriend: string | null;
  CensusReddit: string | null;
  Builderlink: string | null;
  Mode: string;
  Platform: string;
  System: string; // system where base is located
}

// change string to array for later code to consume
export interface CensusEntry extends RawCensusEntry {
  CensusRenewal: string[];
  CensusArrival: Date;
  renewRequested: boolean;
  renewed: boolean;
  renewals: string[];
}

// returned from query
interface QueryCensusEntry extends RawCensusEntry {
  CensusRenewal: string;
  CensusArrival: string;
}

// API query returns an array of these
export interface QueryEntry {
  title: QueryCensusEntry;
}
