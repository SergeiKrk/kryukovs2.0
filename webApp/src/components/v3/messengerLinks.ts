export const TELEGRAM_HREF = "https://t.me/sergeikrk";
export const MAX_HREF = "https://max.ru/u/f9LHodD0cOJnvKBT3lzI_frHwvBIZXJVtfvP_VynzhsCBdFg_ZGlsLzi1Gw";
export const MESSENGERS_PATH = "/messengers/";

export function getMessengersUrl(origin: string): string {
  return new URL(MESSENGERS_PATH, origin).toString();
}
