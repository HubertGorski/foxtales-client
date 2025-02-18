import { User } from "@/models/User";
import { avatars } from "./avatars";
import { achievements } from "./achievements";
import { catalogs } from "./catalogs";
import { permissions } from "./permissions";

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
  }),
];
