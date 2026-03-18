import { Expose, Type } from 'class-transformer';
import { MemoryAnswerTranslation } from './MemoryAnswerTranslation';
import i18n from '@/configs/i18n';

export class MemoryAnswer {
  @Expose({ name: 'memoryAnswerId' })
  id: number | null = null;

  @Expose()
  ownerUsername: string;

  @Type(() => MemoryAnswerTranslation)
  @Expose()
  translations: MemoryAnswerTranslation[] = [];

  get text(): string {
    return (
      this.translations.find(tr => tr.language === i18n.global.locale.value)?.text ??
      this.translations[0]?.text ??
      ''
    );
  }

  constructor(ownerUsername: string, translations: MemoryAnswerTranslation[] = []) {
    this.ownerUsername = ownerUsername;
    this.translations = translations;
  }
}
