import { Expose, Transform } from 'class-transformer';
import { LANG, LangFromNumber, LangToNumber } from '@/enums/languagesEnum';

export class MemoryAnswerTranslation {
  @Expose()
  text: string = '';

  @Transform(
    ({ value }) => {
      if (typeof value === 'number') {
        return LangFromNumber[value] ?? LANG.PL;
      }

      if (typeof value === 'string') {
        return LangToNumber[value as LANG] ?? 1;
      }

      return value;
    },
    { toClassOnly: false }
  )
  language: LANG = LANG.EN;

  constructor(text: string, language: LANG) {
    this.text = text;
    this.language = language;
  }
}
