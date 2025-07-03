import { User } from "@/models/User";
import { achievements } from "./achievements";
import { catalogs } from "./catalogs";
import { permissions } from "./permissions";
import { questions } from "./questions";
import { dylematyCards } from "./dylematyCards";
import { Avatar } from "@/models/Avatar";

const avatars = [
  new Avatar(1, "/src/assets/imgs/defaultAvatars/1.png", true),
  new Avatar(2, "/src/assets/imgs/defaultAvatars/2.png", true),
  new Avatar(3, "/src/assets/imgs/defaultAvatars/3.png", true),
  new Avatar(4, "/src/assets/imgs/defaultAvatars/4.png", true),
  new Avatar(5, "/src/assets/imgs/defaultAvatars/5.png", true),
  new Avatar(6, "/src/assets/imgs/defaultAvatars/1.png", true),
  new Avatar(7, "/src/assets/imgs/defaultAvatars/2.png", true),
  new Avatar(8, "/src/assets/imgs/defaultAvatars/2.png"),
  new Avatar(9, "/src/assets/imgs/defaultAvatars/2.png"),
  new Avatar(10, "/src/assets/imgs/defaultAvatars/3.png")
];

export const users = [
  new User({ userId: 1, avatar: avatars[3], username: "Natalia Bardzodlug ienazwisko" }),
  new User({ userId: 2, avatar: avatars[0], username: "Adam Kaleta" }),
  new User({ userId: 3, avatar: avatars[3], username: "Przemo" }),
  new User({ userId: 4, avatar: avatars[4],username: "Mariuszek DobryCzłowiek" }),
  new User({ userId: 5, username: "Hubert Bardzodlugienazwisko" }),
  new User({ userId: 6, username: "Marta" }),
  new User({ userId: 7, username: "Wojtek" }),
  new User({
    userId: 8,
    username: "Natalia",
    level: 2,
    accountPoints: 196,
    requiredAccountPointsToNextLevel: 244,
    catalogs: catalogs,
    achievements: achievements,
    avatarsIds: [5],
    avatar: avatars[0],
    permissions: permissions,
    questions: questions,
    dylematyCards: dylematyCards,
  }),
];
