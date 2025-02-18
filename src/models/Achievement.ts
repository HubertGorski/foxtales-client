export class Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  boundaryLevels: number[];
  currentLevel: number;

  constructor(
    id = 0,
    title: string = "",
    description: string = "",
    icon: string = "",
    currentLevel: number = 0,
    boundaryLevels: number[] = [1, 2, 3, 4, 5]
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.icon = icon;
    this.boundaryLevels = boundaryLevels;
    this.currentLevel = currentLevel;
  }

  get getUnlockedLevel(): number {
    return this.boundaryLevels.reduce(
      (lastIndex, level, index) =>
        this.currentLevel >= level ? index : lastIndex,
      -1
    );
  }

  get isUnlocked(): boolean {
    return !!this.currentLevel;
  }
}
