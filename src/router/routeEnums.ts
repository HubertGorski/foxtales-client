import { PERMISSION_GAME } from "@/enums/permissions";

export enum ROUTE_NAME {
  HOME = "home",
  LOGIN = "login",
  REGISTER = "register",
  MENU = "menu",
  SETTINGS = "settings",
  JOIN_GAME = "joinGame",
  CREATE_GAME = "createGame",
  CREATE_GAME_DYLEMATY = "createGame" + PERMISSION_GAME.DYLEMATY,
  CREATE_GAME_PSYCH = "createGame" + PERMISSION_GAME.PSYCH,
  LOBBY = "lobby",
  LIBRARY = "library",
  LIBRARY_DYLEMATY = "library" + PERMISSION_GAME.DYLEMATY,
  LIBRARY_PSYCH = "library" + PERMISSION_GAME.PSYCH,
  CHOOSE_GAME = "chooseGame",
  NO_ACCESS = "noAccess",
}

export enum ROUTE_PATH {
  HOME = "/",
  LOGIN = "/login",
  REGISTER = "/register",
  MENU = "/menu",
  SETTINGS = "/settings",
  JOIN_GAME = "/join-game",
  CREATE_GAME = "/create-game",
  CREATE_GAME_PSYCH = "/create-game-" + PERMISSION_GAME.PSYCH,
  CREATE_GAME_DYLEMATY = "/create-game-" + PERMISSION_GAME.DYLEMATY,
  LOBBY = "/lobby",
  LIBRARY = "/library",
  LIBRARY_PSYCH = "/library-" + PERMISSION_GAME.PSYCH,
  LIBRARY_DYLEMATY = "/library-" + PERMISSION_GAME.DYLEMATY,
  CHOOSE_GAME = "/choose-game",
  NO_ACCESS = "/no-access",
}
