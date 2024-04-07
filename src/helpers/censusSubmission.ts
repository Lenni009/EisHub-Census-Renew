import { useWikiPageDataStore } from '@/stores/wikiPageDataStore';
import { buildBasePage } from './baseTemplate';
import { version } from '@/variables/version';
import type { ExplicitBoolean } from '@/types/pageData';
import { currentYearString, timezoneOffset } from '@/variables/dateTime';
import { compressFile } from './fileCompression';
import { paginate } from './array';
import type { FileItem } from '@/types/file';
import { formWebhook } from '@/variables/env';
import { maxFilePerMessage } from '@/variables/fileLimits';
import { escapeName } from './nameEscape';
import { buildWikiEditLink } from './wikiLinkConstructor';

const getExplicitBoolean = (bool: boolean): ExplicitBoolean => (bool ? 'Yes' : 'No');

function constructNewFile(fileObj: FileItem, baseName: string): File | undefined {
  if (!fileObj.file) return;
  const sanitisedBaseName = escapeName(baseName);
  const fileName = fileObj.file?.name ?? fileObj.filename;
  const fileExtension = fileName.split('.').at(-1);
  const newFileName = `${sanitisedBaseName}${fileObj.id}.${fileExtension}`;
  return new File([fileObj.file], newFileName, { type: fileObj.file.type });
}

export async function submitCensus(description: string): Promise<void> {
  const wikiPageData = useWikiPageDataStore();
  const { baseData, playerData, imageData, region, sectionData } = wikiPageData;
  const { image, gallery } = imageData;
  const { mode, platform } = baseData;
  const { renewals } = playerData;
  if (!renewals.includes(currentYearString)) renewals.push(currentYearString);

  // this is necessary since TS doesn't understand that `.filter(Boolean)` removes `undefined` values
  const compressedFiles: File[] = [];

  // compressing one-by-one to avoid weird Firefox issues
  gallery.forEach(async (item) => {
    const newFile = constructNewFile(item, baseData.baseName);
    if (!newFile) return;
    const compressedFile = await compressFile(newFile);
    item.file = compressedFile;
    item.filename = compressedFile.name;
    compressedFiles.push(compressedFile);
  });

  const galleryPicLines = gallery
    .map(({ desc, file, filename }) => (desc ? `${file?.name ?? filename}|${desc}` : file?.name ?? filename))
    .join('\n');

  const passBuilder = playerData.wikiName ? '' : playerData.player;

  const wikiProfileLink = `{{profile|${playerData.wikiName}}}`;
  const socialName = playerData.social.split('/').at(-1);
  const socialLink = `[${playerData.social} ${socialName}]`;

  const socialWiki = playerData.social ? socialLink : wikiProfileLink;
  const socialLinkOrEmpty = playerData.reddit ? '' : socialWiki;

  const passSocial = !playerData.social && !playerData.wikiName ? '' : socialLinkOrEmpty;

  if (!image) return;

  const fileType = image.file?.type;
  const mainImageName = image.file?.name ?? image.filename;
  const fileExtension = mainImageName.split('.').at(-1);
  const newImageName = `${escapeName(baseData.baseName)}-main.${fileExtension}`;
  const mainImage = image.file ? new File([image.file], newImageName, { type: fileType }) : undefined;
  const compressedMainImage = mainImage ? await compressFile(mainImage) : undefined;

  const wikipageText = buildBasePage({
    version,
    region,
    name: baseData.baseName,
    image: compressedMainImage?.name ?? image.filename,
    platform: platform ?? 'PC',
    mode: mode ?? 'Normal',
    builderlink: playerData.wikiName,
    builder: passBuilder,
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
    renew: renewals.join(', '),
    galleryPics: galleryPicLines,
    sections: sectionData,
  });

  const wikiTextFile = new File([wikipageText], `${baseData.baseName}.txt`, { type: 'text/plain' });

  // Discord's file limit is 10, so we make sure to only send 10 files at once
  const paginatedFiles = paginate(compressedFiles, maxFilePerMessage);
  paginatedFiles.unshift([wikiTextFile]);
  if (compressedMainImage) paginatedFiles[0].unshift(compressedMainImage);

  const formDataArray = paginatedFiles.map(constructFileFormData);
  formDataArray[0].append(
    'payload_json',
    JSON.stringify({
      allowed_mentions: {
        parse: [],
      },
      embeds: [
        {
          description,
          title: 'New Census Submission!',
          image: {
            url: `attachment://${compressedMainImage?.name ?? image.filename}`,
          },
          fields: [
            {
              name: 'Player',
              value: playerData.player,
            },
            {
              name: 'Wikipage',
              value: buildWikiEditLink(baseData.baseName),
            },
            {
              name: 'Timezone',
              value: playerData.shareTimezone ? timezoneOffset : 'not disclosed',
            },
            {
              name: 'Active Time',
              value: playerData.activeTime || 'not disclosed',
            },
          ],
        },
      ],
      attachments: [
        {
          id: 0,
          filename: compressedMainImage?.name ?? image.filename,
        },
      ],
    })
  );

  const promises = formDataArray.map(sendFormData);
  await Promise.all(promises);
}

function constructFileFormData(fileArray: File[]): FormData {
  // initialising form data object
  const formData = new FormData();
  fileArray.forEach((file, index) => formData.append(`files[${index}]`, file));

  return formData;
}

async function sendFormData(formData: FormData) {
  await fetch(formWebhook, {
    method: 'POST',
    body: formData,
  });
}
