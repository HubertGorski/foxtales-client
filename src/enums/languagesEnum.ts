export enum LANG {
  PL = 'pl',
  EN = 'en',
  DE = 'de',
  FR = 'fr',
  ES = 'es',
}

export const LangFromNumber: Record<number, LANG> = {
  0: LANG.PL,
  1: LANG.EN,
  2: LANG.DE,
  3: LANG.FR,
  4: LANG.ES,
};

export const LangToNumber: Record<LANG, number> = {
  [LANG.PL]: 0,
  [LANG.EN]: 1,
  [LANG.DE]: 2,
  [LANG.FR]: 3,
  [LANG.ES]: 4,
};

export const languagesMap = [LANG.PL, LANG.EN, LANG.DE, LANG.FR, LANG.ES];
