export function isValidHttpUrl(string: string) {
  if (!string) return true;
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export const discordValidation = '^[a-z0-9._]+$';
const discordValidationRegexp = new RegExp(discordValidation);

export const validateDiscord = (name: string) => (name ? discordValidationRegexp.test(name) : true);
export const validateReddit = (name: string) => (name ? name.toLowerCase().startsWith('u/') : true);

export function validatePlayerName(name: string) {
  const platforms = ['pc', 'ps', 'xb', 'xbox', 'steam', 'steam deck', 'mac', 'switch'];
  return !platforms.includes(name.toLowerCase());
}

export function validateFriendCode(code: string) {
  const friendCodeRegex = new RegExp(/^((?:[0-9A-Za-z]{4}-){2}[0-9A-Za-z]{5})$/);
  return !code || (friendCodeRegex.test(code) && code.toLowerCase() !== 'xxxx-xxxx-xxxxx');
}

export function validateCoords(axes: string) {
  const axesRegex = new RegExp(/^([+-](?:[0-9]{1,3})\.(?:[0-9]{2}), [+-](?:[0-9]{1,3})\.(?:[0-9]{2}))$/);
  return !axes || axesRegex.test(axes);
}
