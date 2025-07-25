import { defineStore } from "pinia";
import type { User } from "@/models/User";
import { BASE_URL_PSYCH } from "@/api/Client";
import * as signalR from "@microsoft/signalr";

interface SignalRState {
  connection: signalR.HubConnection | null;
  joinedPlayers: User[];
  gameCode: string | null;
  player: User | null;
  error: string | null;
}

export const useSignalRStore = defineStore({
  id: "signalRStore",
  state: (): SignalRState => ({
    connection: null,
    joinedPlayers: [],
    gameCode: null,
    player: null,
    error: null,
  }),

  getters: {},

  actions: {
    clearStore() {
      this.connection = null;
      this.joinedPlayers = [];
      this.gameCode = null;
      this.player = null;
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
        this.joinedPlayers = this.joinedPlayers.filter(
          (p: User) => p.userId !== playerId
        );
      });

      this.connection.on("GetPlayers", (joinedPlayers) => {
        this.joinedPlayers = joinedPlayers;
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

      if (this.gameCode) {
        await this.leaveRoom();
      }

      await this.connection.invoke("JoinRoom", gameCode, player);
      if (this.error) {
        return;
      }

      this.gameCode = gameCode;
      this.player = player;
    },

    async leaveRoom() {
      if (!this.connection || !this.gameCode || this.player == null) {
        return;
      }

      await this.connection.invoke(
        "LeaveRoom",
        this.gameCode,
        this.player.userId
      );
      this.clearStore();
    },
  },
});
