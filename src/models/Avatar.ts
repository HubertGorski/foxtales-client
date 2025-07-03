export class Avatar {
  id: number;
  source: string;
  isPremium: boolean;

  constructor(id = 0, source: string = "", isPremium: boolean = false) {
    this.id = id;
    this.source = source;
    this.isPremium = isPremium;
  }

  isDisabled(userAvatarsIds: number[]): boolean {
    return !userAvatarsIds.includes(this.id);
  }

  isSelected(avatar: Avatar): boolean {
    return avatar.id === this.id;
  }
}
