export class DylematyCard {
  id: number;
  text: string;
  type: DYLEMATY_CARD_TYPE | null;
  decksIds: number[];

  constructor(
    id: number = 0,
    text: string = '',
    type: DYLEMATY_CARD_TYPE | null = null,
    decksIds: number[] = []
  ) {
    this.id = id;
    this.text = text;
    this.type = type;
    this.decksIds = decksIds;
  }

  get isPositiveCard(): boolean {
    return this.type === DYLEMATY_CARD_TYPE.POSITIVE;
  }

  get isNegativeCard(): boolean {
    return this.type === DYLEMATY_CARD_TYPE.NEGATIVE;
  }
}

export enum DYLEMATY_CARD_TYPE {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
}
