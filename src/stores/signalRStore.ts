import { defineStore } from "pinia";
import type { User } from "@/models/User";
import { BASE_URL_PSYCH } from "@/api/Client";
import * as signalR from "@microsoft/signalr";
import { Game } from "@/models/Game";
import { plainToInstance } from "class-transformer";

interface SignalRState {
  connection: signalR.HubConnection | null;
  game: Game | null;
  error: string | null;
}

export const useSignalRStore = defineStore({
  id: "signalRStore",
  state: (): SignalRState => ({
    connection: null,
    game: null,
    error: null,
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

        this.game.users = joinedPlayers;
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

      this.connection.on("ReceiveError", (errorMessage) => {
        this.error = errorMessage;
      });

      await this.connection.start();
    },

    async joinRoom(gameCode: string, player: User) {
      if (!this.connection) {
        return;
      }

      if (this.game) {
        await this.leaveRoom(player.userId);
      }

      await this.connection.invoke("JoinRoom", gameCode, player);
      if (this.error) {
        return;
      }
    },

    async createRoom(game: Game) {
      if (!this.connection) {
        return;
      }

      this.game = game;
      await this.connection.invoke("CreateRoom", game);
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
  },
});
