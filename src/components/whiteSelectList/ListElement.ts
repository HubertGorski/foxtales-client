import type { Catalog } from "@/models/Catalog";
import type { Deck } from "@/models/Deck";
import type { DylematyCard } from "@/models/DylematyCard";
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

  setSelected(isSelected: boolean = true) {
    this.isSelected = isSelected;
    return this;
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

export function convertCardToListElement(card: DylematyCard): ListElement {
  return new ListElement({
    id: card.id,
    title: card.text,
    description: card.text,
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

export function convertDecksToListElement(deck: Deck): ListElement {
  return new ListElement({
    id: deck.id,
    title: deck.title,
    description: deck.description,
    isSelected: false,
    elementsCount: deck.cardsCount,
    size: deck.size,
  });
}
