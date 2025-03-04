import type { Catalog } from "@/models/Catalog";
import type { Question } from "@/models/Question";

export class ListElement {
  id: number = 0;
  title: string = "";
  description: string = "";
  isSelected: boolean = false;
  elementsCount?: number;
  size?: number;

  constructor(args: Partial<ListElement> = {}) {
    Object.assign(this, { ...args });
  }
}

export function convertQuestionToListElement(question: Question): ListElement {
  return new ListElement({
    id: question.id,
    title: question.text,
    description: question.text,
    isSelected: false,
  });
}

export function convertCatalogsToListElement(catalog: Catalog): ListElement {
  return new ListElement({
    id: catalog.id,
    title: catalog.title,
    description: catalog.description,
    isSelected: false,
    elementsCount: catalog.questionsCount,
    size: catalog.size,
  });
}
