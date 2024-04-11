export function removeFilePrefix(filename: string) {
  const filePrefix = 'file:';
  const filePrefixLength = filePrefix.length;

  return filename.toLowerCase().startsWith(filePrefix) ? filename.slice(filePrefixLength) : filename;
}
