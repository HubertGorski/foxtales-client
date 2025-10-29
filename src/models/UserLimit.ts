import type { USER_LIMIT } from '@/enums/userLimitEnum';

export class UserLimit {
  type: USER_LIMIT | null = null;
  limitId: number = 0;
  currentValue: number = 0;
  closestThreshold: number = 0;
  thresholds: number[] = [];
}
