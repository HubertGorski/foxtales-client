export class Catalog {
  id: number;
  title: string;
  description: string;
  ownerId: number;
  createdDate: Date;
  usedCount: number;
  isSelected: boolean;
  size: number;

  constructor(
    id: number = 0,
    title: string = "",
    description: string = "",
    ownerId: number = 0,
    createdDate: Date = new Date(),
    usedCount: number = 0,
    isSelected: boolean = false,
    size: number = 10
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.ownerId = ownerId;
    this.createdDate = createdDate;
    this.usedCount = usedCount;
    this.isSelected = isSelected;
    this.size = size;
  }

  availableTypes = [
    {id: 1, name: 'catalogs.small', size: 10},
    {id: 2, name: 'catalogs.medium', size: 20},
    {id: 3, name: 'catalogs.large', size: 35},
  ];
}
