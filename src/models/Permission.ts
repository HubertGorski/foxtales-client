import type { PERMISSION } from "@/enums/permissions";

export class Permission {
    name: PERMISSION;
    maxLimit: number;
    currentUsage: number;
  
    constructor(name: PERMISSION, maxLimit: number, currentUsage: number = 0) {
      this.name = name;
      this.maxLimit = maxLimit;
      this.currentUsage = currentUsage;
    }
  
    isLimitExceeded(): boolean {
      return this.currentUsage >= this.maxLimit;
    }
  }