import { removeFilePrefix } from './fileRename';

export const getMediaLink = (imageName: string) => `[[Media:${removeFilePrefix(imageName)}]]`;

// The raw link is in this format: https://static.wikia.nocookie.net/nomanssky_gamepedia/images/8/8e/20230927225359_1.jpg/revision/latest?cb=20230927213750
// For some reason, any direct programmatic requests to that URL fail.
// So we have to get rid of the /revision/latest?cb=... part in order for this to work.
// This is done by splitting at the slashes, then taking the last two parts away.
export const getWorkingImageLink = (link: string) => link.split('/').slice(0, -2).join('/'); // NoSonar see explanation for -2 above
