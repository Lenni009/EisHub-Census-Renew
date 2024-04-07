export function removeDuplicates<T>(arr: T[]): T[] {
  const uniqueSet = new Set(arr);
  const uniqueArr = Array.from(uniqueSet);
  return uniqueArr;
}

export function paginate<T>(arr: T[], size: number): T[][] {
  return arr.reduce((acc: T[][], val, i) => {
    const idx = Math.floor(i / size);
    const page = acc[idx] || (acc[idx] = []);
    page.push(val);

    return acc;
  }, []);
}
