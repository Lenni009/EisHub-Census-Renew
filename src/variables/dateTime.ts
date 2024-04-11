import { getCurrentYear } from '@/helpers/date';

export const currentYear = getCurrentYear();
export const currentYearString = currentYear.toString();
const timezoneOffsetHours = (new Date().getTimezoneOffset() / 60) * -1;
export const timezoneOffset = `GMT${timezoneOffsetHours < 0 ? timezoneOffsetHours : '+' + timezoneOffsetHours}`;
export const weekInMilliseconds = 7 * 24 * 60 * 60 * 1000; // NoSonar a week has 7 days, a day has 24h, an hour has 60 minutes, a minute has 60 seconds, a second has 1000 milliseconds
