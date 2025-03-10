import { PERMISSION_GAME, type PERMISSION } from "@/enums/permissions";

export class Permission {
  name: PERMISSION | PERMISSION_GAME;
  maxLimit: number;
  currentUsage: number;

  constructor(
    name: PERMISSION | PERMISSION_GAME,
    maxLimit: number,
    currentUsage: number = 0
  ) {
    this.name = name;
    this.maxLimit = maxLimit;
    this.currentUsage = currentUsage;
  }

  get isLimitExceeded(): boolean {
    return this.currentUsage >= this.maxLimit;
  }

  get isGameUnlocked(): boolean {
    this.isPermissionGame(this.name, true);
    return this.maxLimit === this.currentUsage;
  }

  isPermissionGame(value: any, shouldThrowError: boolean = false): boolean {
    const isValid = Object.values(PERMISSION_GAME).includes(value);

    if (!isValid && shouldThrowError) {
      throw new Error(`Invalid permission game value: ${value}`);
    }

    return isValid;
  }
}
