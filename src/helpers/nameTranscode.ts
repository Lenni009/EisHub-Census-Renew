export const encodePlayerName = (name: string) => btoa(name);
export const decodePlayerName = (base64: string) => atob(base64);
