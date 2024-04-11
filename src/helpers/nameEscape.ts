export const escapeName = (name: string): string => name.replaceAll(/['"[\]{} ]/g, '_');
