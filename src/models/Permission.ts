import { PERMISSION_GAME, type PERMISSION } from "@/enums/permissions";
import { Expose } from "class-transformer";

export class Permission {
  @Expose({ name: "limitId" })
  name: PERMISSION | PERMISSION_GAME;

  @Expose({ name: "closestThreshold" })
  closestLimit: number;

  @Expose({ name: "currentValue" })
  currentUsage: number;

  constructor(
    name: PERMISSION | PERMISSION_GAME,
    closestLimit: number,
    currentUsage: number = 0
  ) {
    this.name = name;
    this.closestLimit = closestLimit;
    this.currentUsage = currentUsage;
  }

  get isLimitExceeded(): boolean {
    return this.currentUsage >= this.closestLimit;
  }

  get isGameUnlocked(): boolean {
    this.isPermissionGame(this.name, true);
    return this.closestLimit <= this.currentUsage;
  }

  isPermissionGame(value: any, shouldThrowError: boolean = false): boolean {
    const isValid = Object.values(PERMISSION_GAME).includes(value);

    if (!isValid && shouldThrowError) {
      throw new Error(`Invalid permission game value: ${value}`);
    }

    return isValid;
  }
}
