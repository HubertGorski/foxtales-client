import type { DylematyCard } from "./DylematyCard";

export class Deck {
  id: number;
  title: string;
  description: string;
  size: number;
  cards: DylematyCard[];

  constructor(
    id: number = 0,
    title: string = "",
    description: string = "",
    size: number = 0,
    cards: DylematyCard[] = []
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.size = size;
    this.cards = cards;
  }

  get cardsCount(): number {
    return this.cards.length;
  }

  setCards(cards: DylematyCard[]): Deck {
    this.cards = cards;
    return this;
  }
}
