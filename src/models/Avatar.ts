import { Expose } from 'class-transformer';

export class Avatar {
  @Expose({ name: 'avatarId' })
  id: number;

  @Expose()
  isPremium: boolean;

  constructor(id = 0, isPremium: boolean = false) {
    this.id = id;
    this.isPremium = isPremium;
  }

  isDisabled(userAvatarsIds: number[]): boolean {
    return !userAvatarsIds.includes(this.id);
  }

  isSelected(avatar: Avatar): boolean {
    return avatar.id === this.id;
  }
}
