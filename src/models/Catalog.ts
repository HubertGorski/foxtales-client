import { Expose } from "class-transformer";
import type { Question } from "./Question";
import { CatalogType } from "./CatalogType";

export class Catalog {
  @Expose({ name: "catalogId" })
  id: number | null;
  
  @Expose({ name: "catalogType" })
  catalogType: CatalogType;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  ownerId: number;

  @Expose()
  questions: Question[];

  @Expose()
  usedCount: number;

  @Expose()
  availableTypes: CatalogType[];

  createdDate: Date;

  isSelected: boolean;

  constructor(
    id: number | null = null,
    catalogType: CatalogType = new CatalogType(),
    title: string = "",
    description: string = "",
    ownerId: number = 0,
    createdDate: Date = new Date(),
    usedCount: number = 0,
    isSelected: boolean = false,
    questions: Question[] = [],
    availableTypes: CatalogType[] = []
  ) {
    this.id = id;
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

  setQuestions(questions: Question[]): this {
    this.questions = questions;
    return this;
  }
}
