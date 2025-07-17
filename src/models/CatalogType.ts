import { Expose } from "class-transformer";

export class CatalogType {
  @Expose()
  catalogTypeId: number;

  @Expose()
  size: number;

  @Expose()
  name: string;

  constructor(catalogTypeId: number = 0, size: number = 0, name: string = "") {
    this.catalogTypeId = catalogTypeId;
    this.size = size;
    this.name = name;
  }
}
