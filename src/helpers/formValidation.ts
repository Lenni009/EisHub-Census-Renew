import { discordValidation } from '@/variables/formValidation';

export const isValidHttpUrl = (string: string) => URL.canParse(string);

const discordValidationRegexp = new RegExp(discordValidation);

export const validateDiscord = (name: string) => !name || discordValidationRegexp.test(name);
export const validateReddit = (name: string) => !name || !name.toLowerCase().startsWith('u/');

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
