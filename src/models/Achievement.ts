export class Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;

  constructor(
    id = 0,
    title: string = "",
    description: string = "",
    icon: string = ""
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.icon = icon;
  }

  isUnlocked(userAchievementsIds: number[]): boolean {
    return userAchievementsIds.includes(this.id);
  }
}
