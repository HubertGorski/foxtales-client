export enum RULES {
  PSYCH,
  DIXIT,
  QUIET_DAYS,
}

export const RULES_I18N_KEY: Record<RULES, string> = {
  [RULES.PSYCH]: 'lobby.usePsychRules',
  [RULES.DIXIT]: 'lobby.useDixitRules',
  [RULES.QUIET_DAYS]: 'lobby.useQuietDaysRules',
};
