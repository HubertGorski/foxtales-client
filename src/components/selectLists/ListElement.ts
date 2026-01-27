import type { RULES } from '@/enums/rulesEnum';
import type { Catalog } from '@/models/Catalog';
import { Deck } from '@/models/Deck';
import { DYLEMATY_CARD_TYPE, DylematyCard } from '@/models/DylematyCard';
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
  cards?: DylematyCard[];
  type?: DYLEMATY_CARD_TYPE | null;
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

export function convertDylematyCardToListElement(card: DylematyCard): ListElement {
  return new ListElement({
    id: card.id,
    title: card.text,
    isSelected: false,
    type: card.type,
  });
}
export function convertListElementToDylematyCard(item: ListElement): DylematyCard {
  return new DylematyCard(item.id, item.title, item.type);
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

export function convertDecksToListElement(deck: Deck): ListElement {
  return new ListElement({
    id: deck.id,
    title: deck.title,
    description: deck.description,
    isSelected: false,
    elementsCount: deck.cardsCount,
    size: deck.size,
    cards: deck.cards,
  });
}

export function convertListElementToDeck(item: ListElement): Deck {
  return new Deck(item.id, item.title, item.description, item.size, item.cards);
}
