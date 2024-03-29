export function removeDuplicates<T>(arr: T[]): T[] {
  const uniqueSet = new Set(arr);
  const uniqueArr = Array.from(uniqueSet);
  return uniqueArr;
}
