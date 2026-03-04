import { GENDER } from '@/enums/userEnum';
import { LANG } from '@/enums/languagesEnum';
import { User } from './User';
import { Expose, Type } from 'class-transformer';
import { QuestionTranslations } from './QuestionTranslations';
import i18n from '@/configs/i18n';

export class Question {
  id: number | null;
  ownerId: number;

  @Type(() => QuestionTranslations)
  @Expose()
  translations: QuestionTranslations[] = [];

  targetGender: GENDER;
  isPublic: boolean;
  usedCount: number;
  publicDate: Date | null;
  createdDate: Date;
  catalogIds: number[];

  @Type(() => User)
  currentUser: User | null = null;

  constructor(
    id: number | null = null,
    ownerId: number = 0,
    targetGender: GENDER = GENDER.ALL,
    isPublic: boolean = false,
    usedCount: number = 0,
    publicDate: Date | null = null,
    createdDate: Date = new Date(),
    catalogIds = []
  ) {
    this.id = id;
    this.isPublic = isPublic;
    this.ownerId = ownerId;
    this.targetGender = targetGender;
    this.usedCount = usedCount;
    this.publicDate = publicDate;
    this.createdDate = createdDate;
    this.catalogIds = catalogIds;
  }

  addCatalogs(catalogIds: number[]): void {
    this.catalogIds = catalogIds;
  }

  get text(): string {
    return (
      this.translations.find(tr => tr.language === i18n.global.locale.value)?.text ??
      this.translations[0]?.text ??
      ''
    );
  }

  set text(value: string) {
    let translation = this.translations.find(tr => tr.language === i18n.global.locale.value);
    if (!translation) {
      translation = new QuestionTranslations();
      translation.language = i18n.global.locale.value as LANG;
      this.translations.push(translation);
    }
    translation.text = value;
  }
}
