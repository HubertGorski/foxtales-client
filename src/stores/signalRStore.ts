import { defineStore } from "pinia";
import { User } from "@/models/User";
import { BASE_URL_PSYCH } from "@/api/Client";
import * as signalR from "@microsoft/signalr";
import { Game } from "@/models/Game";
import { instanceToPlain, plainToInstance } from "class-transformer";
import type { Question } from "@/models/Question";
import type { Answer } from "@/models/Answer";

interface SignalRState {
  connection: signalR.HubConnection | null;
  game: Game | null;
  publicGames: Game[];
  errorPassword: string | null;
  errorCode: string | null;
}

export const useSignalRStore = defineStore({
  id: "signalRStore",
  state: (): SignalRState => ({
    connection: null,
    game: null,
    publicGames: [],
    errorCode: null,
    errorPassword: null,
  }),

  getters: {},

  actions: {
    clearStore() {
      this.connection = null;
      this.game = null;
    },

    async connect() {
      if (this.connection) {
        return;
      }

      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(BASE_URL_PSYCH)
        .withAutomaticReconnect()
        .build();

      this.connection.on("PlayerLeft", (playerId: number) => {
        if (!this.game) {
          return;
        }

        this.game.users = this.game.users.filter(
          (p: User) => p.userId !== playerId
        );
      });

      this.connection.on("GetPlayers", (joinedPlayers: User[]) => {
        if (!this.game) {
          return;
        }

        this.game.users = plainToInstance(User, joinedPlayers);
      });

      this.connection.on("GetGameCode", (code: string) => {
        if (!this.game) {
          return;
        }

        this.game.code = code;
      });

      this.connection.on("RoomClosed", () => {
        this.clearStore();
      });

      this.connection.on("LoadRoom", (game: Game) => {
        this.game = plainToInstance(Game, game);        
      });

      this.connection.on("ReceiveError", (error) => {
        if (error.fieldId === "code") {
          this.errorCode = error.message;
        } else {
          this.errorPassword = error.message;
        }
      });

      this.connection.on("GetPublicRooms", (games: Game[]) => {
        this.publicGames = plainToInstance(Game, games);
      });

      await this.connection.start();
    },

    async joinRoom(
      gameCode: string,
      player: User,
      password: string,
      ownerId: number | null = null
    ) {
      if (!this.connection) {
        return;
      }

      if (this.game) {
        await this.leaveRoom(player.userId);
      }

      await this.connection.invoke(
        "JoinRoom",
        gameCode,
        instanceToPlain(player),
        password,
        ownerId
      );
    },

    async createRoom(game: Game) {
      if (!this.connection) {
        return;
      }

      this.game = game;
      await this.connection.invoke("CreateRoom", instanceToPlain(this.game));
    },

    async goToJoinGameView() {
      if (!this.connection) {
        return;
      }

      await this.connection.invoke("GoToJoinGameView");
    },

    async editRoom(game: Game) {
      if (!this.connection) {
        return;
      }

      this.game = game;
      await this.connection.invoke("EditRoom", instanceToPlain(game));
    },

    async setStatus(playerId: number, status: boolean) {
      if (!this.connection || !this.game) {
        return;
      }

      await this.connection.invoke(
        "SetStatus",
        this.game.code,
        playerId,
        status
      );
    },

    async leaveRoom(playerId: number) {
      if (!this.connection || !this.game) {
        return;
      }

      await this.connection.invoke("LeaveRoom", this.game.code, playerId);

      this.clearStore();
    },

    async removeRoom() {
      if (!this.connection || !this.game) {
        return;
      }

      await this.connection.invoke("RemoveRoom", this.game.code);
      this.clearStore();
    },

    async addQuestionsToGame(playerId: number, questions: Question[]) {
      if (!this.connection || !this.game) {
        return;
      }

      await this.connection.invoke(
        "AddQuestionsToGame",
        this.game.code,
        playerId,
        instanceToPlain(questions)
      );
    },

    async startGame() {
      if (!this.connection || !this.game) {
        return;
      }

      await this.connection.invoke("StartGame", this.game.code);
    },

    async addAnswer(answer: Answer) {
      if (!this.connection || !this.game) {
        return;
      }

      await this.connection.invoke(
        "AddAnswer",
        this.game.code,
        instanceToPlain(answer)
      );
    },

    async markAllUsersUnready() {
      if (!this.connection || !this.game) {
        return;
      }

      await this.connection.invoke("MarkAllUsersUnready", this.game.code);
    },

    async setNewRound() {
      if (!this.connection || !this.game) {
        return;
      }

      await this.connection.invoke("SetNewRound", this.game.code);
    },

    async chooseAnswer(playerId: number, selectedAnswerUserId: number) {
      if (!this.connection || !this.game) {
        return;
      }

      await this.connection.invoke(
        "ChooseAnswer",
        this.game.code,
        playerId,
        selectedAnswerUserId
      );
    },
  },
});
