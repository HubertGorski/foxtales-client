export class Avatar {
  id: number;
  source: string;
  isAvailableAtStart: boolean;
  isPremium: boolean;

  constructor(
    id = 0,
    source: string = "",
    isAvailableAtStart: boolean = false,
    isPremium: boolean = false
  ) {
    this.id = id;
    this.source = source;
    this.isAvailableAtStart = isAvailableAtStart;
    this.isPremium = isPremium;
  }

  isDisabled(userAvatarsIds: number[]): boolean {
    return !this.isAvailableAtStart && !userAvatarsIds.includes(this.id);
  }

  isSelected(avatar: Avatar): boolean {
    return avatar.id === this.id;
  }
}
