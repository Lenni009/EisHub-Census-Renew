import { maxFilesPerMessage, maxMessageSize } from '@/variables/fileLimits';

export function removeDuplicates<T>(arr: T[]): T[] {
  const uniqueSet = new Set(arr);
  const uniqueArr = Array.from(uniqueSet);
  return uniqueArr;
}

export function paginateFiles(arr: File[]): File[][] {
  // sort by filesize; descending (largest first, smallest last)
  const sortedFiles = arr.toSorted((a, b) => b.size - a.size);

  const chunks: File[][] = [];
  let currentChunk: File[] = [];
  let currentSize = 0;

  for (const file of sortedFiles) {
    if (currentChunk.length < maxFilesPerMessage && currentSize + file.size < maxMessageSize) {
      // add the file to the current chunk
      currentChunk.push(file);
      currentSize += file.size;
    } else {
      // start a new chunk
      chunks.push(currentChunk);
      currentChunk = [file];
      currentSize = file.size;
    }
  }

  // add the last chunk if it's not empty
  if (currentChunk.length) chunks.push(currentChunk);

  return chunks;
}
