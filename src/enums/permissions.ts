export enum PERMISSION {
  ADD_NEW_PRIVATE_QUESTION_PER_DAY = "addNewPrivateQuestionPerDay",
  CONVERT_PRIVATE_QUESTION_TO_PUBLIC_PER_DAY = "convertPrivateQuestionToPublicPerDay",
  CREATE_GAME_WITH_PRIVATE_QUESTIONS_PER_DAY = "createGameWithPrivateQuestionsPerDay",
  AVAILABLE_CATALOGS = "availableCatalogs",
}

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
