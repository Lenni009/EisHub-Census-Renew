import type { CensusEntry } from '@/types/censusQueryResponse';
import { renewWebhook } from '@/variables/env';
import { wikiEditLink } from '@/variables/wikiLink';

export async function renewCensus(userObject: CensusEntry) {
  await fetch(renewWebhook, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: `${userObject.CensusPlayer} requested renewal.\n<${new URL(wikiEditLink + userObject.Name)}>`,
    }),
  });
}
