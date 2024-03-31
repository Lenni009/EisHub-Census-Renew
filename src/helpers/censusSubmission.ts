import { useWikiPageDataStore } from '@/stores/wikiPageDataStore';
import { buildBasePage } from './baseTemplate';
import { version } from '@/variables/version';
import type { ExplicitBoolean } from '@/types/pageData';
import { currentYearString } from '@/variables/dateTime';
import { compressFile } from './fileCompression';
import { paginate } from './array';
import type { FileItem } from '@/types/file';
import { formWebhook } from '@/variables/env';
import { maxFilePerMessage } from '@/variables/fileSize';

const getExplicitBoolean = (bool: boolean): ExplicitBoolean => (bool ? 'Yes' : 'No');

function constructNewFile(fileObj: FileItem, baseName: string): File {
  const fileName = fileObj.file.name;
  const fileExtension = fileName.split('.').at(-1);
  const newFileName = `${baseName}${fileObj.id}.${fileExtension}`;
  return new File([fileObj.file], newFileName, { type: fileObj.file.type });
}

export async function submitCensus(): Promise<void> {
  const wikiPageData = useWikiPageDataStore();
  const { baseData, playerData, imageData } = wikiPageData;
  const { image, gallery } = imageData;
  const { mode, platform } = baseData;
  const galleryEntries: [File, string][] = gallery.map((item) => [
    constructNewFile(item, baseData.baseName),
    item.desc,
  ]);
  const galleryPics = galleryEntries.map((item) => [item[0].name, item[1]].join('|')).join('\n');
  const galleryFiles = galleryEntries.map((item) => item[0]);

  const passBuilder = playerData.wikiName ? '' : playerData.player;
  const passSocial = playerData.reddit ? '' : playerData.social;

  const wikipageText = buildBasePage({
    version,
    galleryPics,
    name: baseData.baseName,
    image: image?.name ?? '',
    platform: platform ?? 'PC',
    mode: mode ?? 'Normal',
    builderlink: playerData.wikiName,
    builder: passBuilder,
    region: baseData.region,
    system: baseData.system,
    planet: baseData.planet,
    moon: baseData.moon,
    axes: baseData.axes,
    glyphs: baseData.glyphs,
    type: baseData.type,
    farm: getExplicitBoolean(baseData.farm),
    arena: getExplicitBoolean(baseData.arena),
    racetrack: getExplicitBoolean(baseData.racetrack),
    geobay: getExplicitBoolean(baseData.geobay),
    terminal: getExplicitBoolean(baseData.terminal),
    landingpad: getExplicitBoolean(baseData.landingpad),
    censusPlayer: playerData.player,
    censusDiscord: playerData.discord,
    censusReddit: playerData.reddit,
    censusSocial: passSocial,
    censusFriend: playerData.friend,
    arrival: playerData.arrival,
    renew: currentYearString,
    layout: baseData.layout,
    features: baseData.features,
    addInfo: baseData.addInfo,
  });

  const wikiTextFile = new File([wikipageText], baseData.baseName, { type: 'text/plain' });

  // start with wikitextfile so we don't need to add that to the array later, and can potentially save one request
  const compressedFiles = [wikiTextFile];

  // compressing one-by-one to avoid weird Firefox issues
  for (const file of galleryFiles) {
    const compressedFile = await compressFile(file);
    compressedFiles.push(compressedFile);
  }

  // Discord's file limit is 10, so we make sure to only send 10 files at once
  const paginatedFiles = paginate(compressedFiles, maxFilePerMessage);
  const formDataArray = paginatedFiles.map(constructFileFormData);

  const promises = formDataArray.map(sendFormData);
  await Promise.all(promises);
}

function constructFileFormData(fileArray: File[]): FormData {
  // initialising form data object
  const formData = new FormData();
  fileArray.forEach((file, index) => formData.append(`image${index}`, file));

  return formData;
}

async function sendFormData(formData: FormData) {
  if (import.meta.env.DEV) {
    console.log(formData);
  } else {
    await fetch(formWebhook, {
      method: 'POST',
      body: formData,
    });
  }
}
