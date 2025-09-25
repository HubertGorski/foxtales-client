import { Expose } from "class-transformer";

export class Vote {
  @Expose({ name: "key" })
  voterId: number;
  
  @Expose({ name: "value" })
  voteCount: number;

  constructor(voterId: number, voteCount: number) {
    this.voterId = voterId;
    this.voteCount = voteCount;
  }
}
