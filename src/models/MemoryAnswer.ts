import { Expose, Type } from 'class-transformer';
import { MemoryAnswerTranslation } from './MemoryAnswerTranslation';
import i18n from '@/configs/i18n';

export class MemoryAnswer {
  @Expose({ name: 'memoryAnswerId' })
  id: number | null = null;

  @Expose()
  ownerUsername: string;

  @Expose()
  ownerId: number;

  @Type(() => MemoryAnswerTranslation)
  @Expose()
  translations: MemoryAnswerTranslation[] = [];

  @Type(() => String)
  shareKey: string;

  @Type(() => Number)
  round: number;

  get text(): string {
    return (
      this.translations.find(tr => tr.language === i18n.global.locale.value)?.text ??
      this.translations[0]?.text ??
      ''
    );
  }

  constructor(
    ownerUsername: string,
    shareKey: string,
    round: number,
    ownerId: number,
    translations: MemoryAnswerTranslation[] = []
  ) {
    this.ownerUsername = ownerUsername;
    this.shareKey = shareKey;
    this.round = round;
    this.ownerId = ownerId;
    this.translations = translations;
  }
}
