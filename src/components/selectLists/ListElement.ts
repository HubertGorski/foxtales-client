import type { RULES } from '@/enums/rulesEnum';
import type { Catalog } from '@/models/Catalog';
import type { Question } from '@/models/Question';

export class ListElement {
  id: number = 0;
  title: string = '';
  description: string = '';
  isSelected: boolean = false;
  elementsCount?: number;
  elementsInCatalogCount?: number;
  recommendedGameRules?: RULES | null;
  size?: number;
  isPublic?: boolean;
  photoId: number | null = null;

  constructor(args: Partial<ListElement> = {}) {
    Object.assign(this, { ...args });
  }

  setSelected(isSelected: boolean = true) {
    this.isSelected = isSelected;
    return this;
  }
}

export function convertQuestionToListElement(question: Question): ListElement {
  return new ListElement({
    id: question.id ?? 0,
    title: question.text,
    description: question.text,
    isSelected: false,
  });
}

export function convertCatalogsToListElement(catalog: Catalog): ListElement {
  return new ListElement({
    id: catalog.catalogId ?? 0,
    title: catalog.title,
    description: catalog.description,
    isSelected: false,
    elementsCount: catalog.questionsCount,
    elementsInCatalogCount: catalog.questionsInCatalogCount,
    recommendedGameRules: catalog.recommendedGameRules,
    photoId: catalog.photoId,
    size: catalog.catalogType?.size ?? null,
  });
}
