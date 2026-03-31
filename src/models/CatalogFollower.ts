export class CatalogFollower {
  userId: number;
  username: string;
  avatarId: number;

  constructor(userId: number = 0, username: string = '', avatarId: number = 1) {
    this.userId = userId;
    this.username = username;
    this.avatarId = avatarId;
  }
}
