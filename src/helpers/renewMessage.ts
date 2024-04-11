import type { CensusEntry } from '@/types/censusQueryResponse';
import { renewWebhook } from '@/variables/env';
import { buildWikiEditLink } from './wikiLinkConstructor';

export async function renewCensus(userObject: CensusEntry) {
  await fetch(renewWebhook, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: `${userObject.CensusPlayer} requested renewal.\n<${buildWikiEditLink(userObject.Name)}>`,
    }),
  });
}
