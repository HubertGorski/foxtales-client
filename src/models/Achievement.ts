export class Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  unlockDate: Date | null;

  constructor(
    id = 0,
    title: string = "",
    description: string = "",
    icon: string = "",
    unlockDate: Date | null = null
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.icon = icon;
    this.unlockDate = unlockDate;
  }
}
