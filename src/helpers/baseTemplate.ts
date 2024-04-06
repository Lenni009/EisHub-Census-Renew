import type { BasePageFields, SectionObject } from '@/types/pageData';
import { civilized } from '@/variables/civilized';
import { requiredSections } from '@/variables/wikiSections';

function assembleBasePage(sectionArray: SectionObject[]) {
  const wikiSections: string[] = sectionArray.map((section, index) => {
    if (!section.body && !requiredSections.includes(section.heading)) return '';
    const heading = index ? `==${section.heading}==` : '';
    const wikiSection = `${heading}
    ${section.body}`;

    return wikiSection.trim();
  });

  const wikiPage = wikiSections.filter(Boolean).join('\n\n');

  const multiWhiteSpaceRegex = / {2,}/g;
  const doubleLineBreaksRegex = /\n{3,}/g;
  return wikiPage.replace(doubleLineBreaksRegex, '\n\n').replace(multiWhiteSpaceRegex, ' ');
}

function buildBaseIntroSection({
  version,
  name,
  image,
  builderlink,
  builder,
  region,
  system,
  planet,
  moon,
  axes,
  glyphs,
  type,
  mode,
  platform,
  farm,
  geobay,
  landingpad,
  arena,
  terminal,
  racetrack,
  censusPlayer,
  censusReddit,
  censusSocial,
  censusDiscord,
  censusFriend,
  arrival,
  renew,
}: BasePageFields): SectionObject {
  return {
    heading: '',
    body: `{{Version|${version}}}
{{Eisvana}}
{{Base infobox
| name = ${name}
| image = ${image}
| civilized = ${civilized}
| researchteam =
| builderlink = ${builderlink}
| builder = ${builder}
| galaxy = Eissentam
| region = ${region}
| system = ${system}
| planet = ${planet}
| moon = ${moon}
| axes = ${axes}
| coordinates = {{Glyphs2Coords|${glyphs}}}
| portalglyphs = ${glyphs}
| type = ${type}
| mode = ${mode}
| platform = ${platform}
| release = ${version}
| farm = ${farm}
| geobay = ${geobay}
| landingpad = ${landingpad}
| arena = ${arena}
| terminal = ${terminal}
| racetrack = ${racetrack}
| censusplayer = ${censusPlayer}
| ${censusReddit ? 'censusreddit = ' + censusReddit : 'censussocial = ' + censusSocial}
| censusdiscord = ${censusDiscord}
| censusfriend = ${censusFriend}
| censusarrival = ${arrival}
| censusrenewal = ${renew}
| censusshow = Y
}}
'''${name}''' is a player base.`,
  };
}

function buildBaseSummarySection({ name, system, planet, moon }: BasePageFields): SectionObject {
  return {
    heading: 'Summary',
    body: `'''${name}''' is a [[Habitable Base|player base]], located on the ${moon ? 'moon [[' + moon + ']] of the ' : ''}planet [[${planet}]] in the [[${system}]] system.`,
  };
}

function buildBaseGallerySection({ galleryPics }: BasePageFields): SectionObject {
  return {
    heading: 'Gallery',
    body: `<gallery>${galleryPics ? '\n' + galleryPics : ''}
    </gallery>`,
  };
}

export function buildBasePage(basePageFields: BasePageFields) {
  const intro = buildBaseIntroSection(basePageFields);
  const summary = buildBaseSummarySection(basePageFields);
  const gallery = buildBaseGallerySection(basePageFields);
  const { sections } = basePageFields;

  const sectionArray: SectionObject[] = [intro, summary, ...sections, gallery];

  const wikiText = assembleBasePage(sectionArray);
  return wikiText;
}
