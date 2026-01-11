export enum LANG {
  PL = 'pl',
  EN = 'en',
  DE = 'de',
}

export const LangFromNumber: Record<number, LANG> = {
  0: LANG.PL,
  1: LANG.EN,
  2: LANG.DE,
};

export const LangToNumber: Record<LANG, number> = {
  [LANG.PL]: 0,
  [LANG.EN]: 1,
  [LANG.DE]: 2,
};

export const languagesMap = [LANG.PL, LANG.EN, LANG.DE];
