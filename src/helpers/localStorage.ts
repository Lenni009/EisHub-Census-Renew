import type { Ref } from 'vue';
import { removeDuplicates } from './array';
import { currentYearString } from '@/variables/dateTime';
import type { LocalStorageData } from '@/types/localStorage';
import { defaultFileItem } from '@/variables/imageData';

// local storage keys are the years
// local storage values are objects with the keys "requested" and "amount"
// requested is of type string[] and holds the names of people who have been requested. This is used to disable their renew buttons before they have been renewed on the wiki.
// amount is of type number and holds the number of renewal requests.
export function getLocalStorageData(): LocalStorageData {
  const fallbackString = '{"requested": [], "amount": 0}';
  const localStorageDataString = localStorage.getItem(currentYearString) ?? fallbackString;
  try {
    const parsedJson = JSON.parse(localStorageDataString);
    const isValidJson = Array.isArray(parsedJson.requested) && typeof parsedJson.amount === 'number';
    if (!isValidJson) throw new Error('Invalid Json!');
    return parsedJson;
  } catch {
    localStorage.setItem(currentYearString, fallbackString);
    return JSON.parse(fallbackString);
  }
}

export function getLocalStorageArray(): string[] {
  const localStorageData = getLocalStorageData();
  return removeDuplicates(localStorageData.requested);
}

export function getLocalStorageAmount(): number {
  const localStorageData = getLocalStorageData();
  return localStorageData.amount;
}

export function updateLocalStorage(requested: Ref<string[]>, tries: Ref<number>, name: string): void {
  requested.value.push(name);
  tries.value++;

  const localStorageObj: LocalStorageData = {
    requested: removeDuplicates(requested.value),
    amount: tries.value,
  };

  const localStorageJson = JSON.stringify(localStorageObj);
  localStorage.setItem(currentYearString, localStorageJson);
}

export function fileReplacer(key: string, value: unknown) {
  if (value instanceof File) return structuredClone(defaultFileItem);
  if (key === 'gallery') return [];
  return value;
}
