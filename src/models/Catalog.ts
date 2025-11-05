import { Expose, Type } from 'class-transformer';
import { Question } from './Question';
import { CatalogType } from './CatalogType';

export class Catalog {
  catalogId: number | null;

  @Type(() => CatalogType)
  catalogType: CatalogType;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  ownerId: number;

  @Type(() => Question)
  @Expose()
  questions: Question[];

  @Expose()
  usedCount: number;

  @Type(() => CatalogType)
  @Expose()
  availableTypes: CatalogType[];

  createdDate: Date;

  isSelected: boolean;

  constructor(
    id: number | null = null,
    catalogType: CatalogType = new CatalogType(),
    title: string = '',
    description: string = '',
    ownerId: number = 0,
    createdDate: Date = new Date(),
    usedCount: number = 0,
    isSelected: boolean = false,
    questions: Question[] = [],
    availableTypes: CatalogType[] = []
  ) {
    this.catalogId = id;
    this.catalogType = catalogType;
    this.title = title;
    this.description = description;
    this.ownerId = ownerId;
    this.createdDate = createdDate;
    this.usedCount = usedCount;
    this.isSelected = isSelected;
    this.questions = questions;
    this.availableTypes = availableTypes;
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
