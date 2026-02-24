import { Expose, Type } from 'class-transformer';
import { Question } from './Question';
import { CatalogType } from './CatalogType';
import { RULES } from '@/enums/rulesEnum';
import { IsEnum } from 'class-validator';
import { CatalogTranslations } from './CatalogTranslations';
import i18n from '@/configs/i18n';
import { LANG } from '@/enums/languagesEnum';

export class Catalog {
  catalogId: number | null;

  @Type(() => CatalogType)
  catalogType: CatalogType;

  @Type(() => CatalogTranslations)
  @Expose()
  translations: CatalogTranslations[] = [];

  @Expose()
  ownerId: number;

  @Expose()
  questionsInCatalogCount: number;

  @Type(() => Question)
  @Expose()
  questions: Question[];

  @Expose()
  usedCount: number;

  @Expose()
  photoId: number;

  @Type(() => CatalogType)
  @Expose()
  availableTypes: CatalogType[];

  @IsEnum(RULES)
  recommendedGameRules: RULES;

  createdDate: Date;

  isSelected: boolean;

  constructor(
    id: number | null = null,
    catalogType: CatalogType = new CatalogType(),
    ownerId: number = 0,
    createdDate: Date = new Date(),
    usedCount: number = 0,
    isSelected: boolean = false,
    questions: Question[] = [],
    availableTypes: CatalogType[] = [],
    recommendedGameRules: RULES = RULES.DIXIT,
    questionsInCatalogCount: number = 0,
    photoId: number = 0
  ) {
    this.catalogId = id;
    this.catalogType = catalogType;
    this.ownerId = ownerId;
    this.createdDate = createdDate;
    this.usedCount = usedCount;
    this.isSelected = isSelected;
    this.questions = questions;
    this.availableTypes = availableTypes;
    this.recommendedGameRules = recommendedGameRules;
    this.questionsInCatalogCount = questionsInCatalogCount;
    this.photoId = photoId;
  }

  get title(): string {
    return this.translations.find(tr => tr.language === i18n.global.locale.value)?.title ?? '';
  }

  set title(value: string) {
    let translation = this.translations.find(tr => tr.language === i18n.global.locale.value);
    if (!translation) {
      translation = new CatalogTranslations();
      translation.language = i18n.global.locale.value as LANG;
      this.translations.push(translation);
    }
    translation.title = value;
  }

  get description(): string {
    return (
      this.translations.find(tr => tr.language === i18n.global.locale.value)?.description ?? ''
    );
  }

  set description(value: string) {
    let translation = this.translations.find(tr => tr.language === i18n.global.locale.value);
    if (!translation) {
      translation = new CatalogTranslations();
      translation.language = i18n.global.locale.value as LANG;
      this.translations.push(translation);
    }
    translation.description = value;
  }

  get questionsCount(): number {
    return this.questions.length;
  }

  get isFull(): boolean {
    return this.questionsCount === this.catalogType.size;
  }

  @Expose()
  get catalogTypeId(): number {
    return this.catalogType.catalogTypeId;
  }

  @Expose()
  get availableTypeIds(): number[] {
    return this.availableTypes.map((type: CatalogType) => type.catalogTypeId);
  }

  @Expose()
  get questionsIds(): (number | null)[] {
    return this.questions.map((question: Question) => question.id).filter(id => id != null);
  }

  setQuestions(questions: Question[]): this {
    this.questions = questions;
    return this;
  }
}
