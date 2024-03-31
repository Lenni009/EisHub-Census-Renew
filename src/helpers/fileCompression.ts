import { imageTypes, compressImage } from 'simple-image-compressor';
import { escapeFileName } from './fileNameEscape';
import { maxFileSize } from '@/variables/fileSize';

export async function compressFile(inputFile: File, quality: number = 1): Promise<File> {
  const sanitisedFileName = escapeFileName(inputFile.name);
  const file = new File([inputFile], sanitisedFileName, { type: inputFile.type });
  if (file.size < maxFileSize) return file; // if below 25 MB, don't do anything
  const type = imageTypes.WEBP;
  const res = await compressImage(file, {
    quality,
    type,
  });
  const lowerQuality = quality - 0.01; // NoSonar reduce quality by 1%;
  if (res.size > maxFileSize) return await compressFile(file, lowerQuality); // compress original file with lower quality setting to avoid double compression
  const fileName = file.name.split('.').slice(0, -1).join('.');
  const newFileName = `${fileName}-min.${type}`;
  return new File([res], newFileName, { type });
}
