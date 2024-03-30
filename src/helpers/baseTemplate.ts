import { civilized } from '@/variables/civilized';

// TODO: Type this properly
export function buildBasePage({
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
  layout,
  features,
  addInfo,
  galleryPics,
}: Record<string, string>) {
  const template = `
{{Version|${version}}}
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
| censusreddit = ${censusReddit}
| censussocial = ${censusSocial}
| censusdiscord = ${censusDiscord}
| censusfriend = ${censusFriend}
| censusarrival = ${arrival}
| censusrenewal = ${renew}
| censusshow = Y
}}
'''${name}''' is a player base.

==Summary==
'''${name}''' is a [[Habitable Base|player base]], located on the ${moon ? 'moon [[' + moon + ']] of the' : ''} planet [[${planet}]] in the [[${system}]] system.

==Layout==
${layout}

==Features==
${features}

==Additional Information==
${addInfo}

==Gallery==
<gallery>
${galleryPics}
</gallery>
`;

  return template;
}
