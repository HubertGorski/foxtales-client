export class Deck {
  id: number;
  title: string;
  cardsIds: number[];

  constructor(
    id: number = 0,
    title: string = "",
    cardsIds: number[] = []
  ) {
    this.id = id;
    this.title = title;
    this.cardsIds = cardsIds;
  }
}
