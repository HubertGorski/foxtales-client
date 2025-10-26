export enum LANG {
  PL = "pl",
  EN = "en",
  DE = "de",
}

export const LangFromNumber: Record<number, LANG> = {
  1: LANG.PL,
  2: LANG.EN,
  3: LANG.DE,
};

export const LangToNumber: Record<LANG, number> = {
  [LANG.PL]: 1,
  [LANG.EN]: 2,
  [LANG.DE]: 3,
};

export const languagesMap = [LANG.PL, LANG.EN, LANG.DE];
