export class Avatar {
  id: number;
  source: string;
  isSelected: boolean;
  isDisabled: boolean;

  constructor(id = 0, source: string = '', isSelected: boolean = false, isDisabled: boolean = true) {
    this.id = id;
    this.source = source;
    this.isSelected = isSelected;
    this.isDisabled = isDisabled;
  }
}