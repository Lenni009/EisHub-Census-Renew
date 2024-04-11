import { imageTypes, compressImage } from 'simple-image-compressor';
import { maxFileSize } from '@/variables/fileLimits';

export async function compressFile(file: File, quality: number = 1): Promise<File> {
  if (file.size < maxFileSize) return file; // if below 25 MB, don't do anything
  const type = imageTypes.JPEG;
  const newFileExtension = type.split('/').at(-1);
  const res = await compressImage(file, {
    quality,
    type,
  });
  const lowerQuality = quality - 0.01; // NoSonar reduce quality by 1%;
  if (res.size > maxFileSize) return await compressFile(file, lowerQuality); // compress original file with lower quality setting to avoid double compression
  const fileName = file.name.split('.').slice(0, -1).join('.');
  const newFileName = `${fileName}-min.${newFileExtension}`;
  return new File([res], newFileName, { type });
}
