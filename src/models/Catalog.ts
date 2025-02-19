export class Catalog {
  id: number;
  title: string;
  description: string;
  ownerId: number;
  createdDate: Date;
  usedCount: number;
  isSelected: boolean;

  constructor(
    id: number = 0,
    title: string = "",
    description: string = "",
    ownerId: number = 0,
    createdDate: Date = new Date(),
    usedCount: number = 0,
    isSelected: boolean = false,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.ownerId = ownerId;
    this.createdDate = createdDate;
    this.usedCount = usedCount;
    this.isSelected = isSelected;
  }
}
