export class DylematyCard {
  id: number;
  text: string;
  type: DYLEMATY_CARD_TYPE;
  isPublic: boolean;
  decksIds: number[];

  constructor(
    id: number = 0,
    text: string = "",
    type: DYLEMATY_CARD_TYPE = DYLEMATY_CARD_TYPE.POSITIVE,
    isPublic: boolean = false,
    decksIds: number[] = []
  ) {
    this.id = id;
    this.text = text;
    this.type = type;
    this.isPublic = isPublic;
    this.decksIds = decksIds;
  }
}

export enum DYLEMATY_CARD_TYPE {
  POSITIVE = "positive",
  NEGATIVE = "negative",
}
