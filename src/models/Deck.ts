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
    cardsIds: DylematyCard[] = []
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.size = size;
    this.cards = cardsIds;
  }

  get cardsCount(): number {
    return this.cards.length;
  }

  setCards(cards: DylematyCard[]): Deck {
    this.cards = cards;
    return this;
  }

  availableTypes = [
    { id: 1, name: "small", size: 30 },
    { id: 2, name: "medium", size: 60 },
    { id: 3, name: "large", size: 120 },
  ];
}
