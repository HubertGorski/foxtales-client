import { User } from "@/models/User";
import { Catalog } from "@/models/Catalog";
import { PERMISSION, Permission } from "@/enums/permissions";
import { avatars } from "./avatars";

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
    catalogs: [
      new Catalog(1, "Impreza u Przema"),
      new Catalog(2, "Zabawne pytania"),
      new Catalog(3, "Na nudną imprezę"),
      new Catalog(4, "Uczelnia"),
      new Catalog(5, "Spotkanie rodzinne"),
      new Catalog(6, "Gdy jesteś w górach i w schronisku nie ma co robić"),
      new Catalog(7, "Takie tam"),
    ],
    achievementsIds: [1, 2],
    avatarsIds: [5],
    avatar: avatars[0],
    permissions: [
      new Permission(PERMISSION.ADD_NEW_PRIVATE_QUESTION_PER_DAY, 2),
      new Permission(PERMISSION.CONVERT_PRIVATE_QUESTION_TO_PUBLIC_PER_DAY, 1),
      new Permission(PERMISSION.CREATE_GAME_WITH_PRIVATE_QUESTIONS_PER_DAY, 1),
      new Permission(PERMISSION.AVAILABLE_CATALOGS, 2, 7),
    ],
  }),
];
