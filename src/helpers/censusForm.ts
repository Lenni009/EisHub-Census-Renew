import type { CensusEntry } from '@/types/censusQueryResponse';
import { decodePlayerName } from './nameTranscode';

const searchParamString = window.location.search;
const searchParams = new URLSearchParams(searchParamString);

// whether the user clicked on one of the buttons in the table or if they are just visiting
function verifyIntent(key: string) {
  const playerIdEncoded = searchParams.get(key);
  const playerId = decodePlayerName(playerIdEncoded ?? '');

  const playerDataString = sessionStorage.getItem('update');

  const playerData: CensusEntry = JSON.parse(playerDataString ?? '{}');

  const playerNameMatches = playerId === playerData.CensusPlayer;
  return playerNameMatches;
}

export const isUpdating = () => verifyIntent('update');
export const isNewPage = () => verifyIntent('new');
