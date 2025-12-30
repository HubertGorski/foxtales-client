import { defineStore } from 'pinia';
import { User } from '@/models/User';
import { BASE_URL_PSYCH } from '@/api/Client';
import { Game } from '@/models/Game';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import type { Question } from '@/models/Question';
import type { Answer } from '@/models/Answer';
import { useUserStore } from './userStore';
import {
  HubConnectionBuilder,
  LogLevel,
  HubConnection,
  HubConnectionState,
} from '@microsoft/signalr';

async function safeSignalRInvoke<T>(
  connection: HubConnection | null,
  methodName: string,
  ...args: any[]
): Promise<{ data?: T; error?: string }> {
  try {
    if (!connection) {
      return { error: 'Brak połączenia z serwerem. Łączenie ponownie...' };
    }

    if (connection.state !== HubConnectionState.Connected) {
      await connection.start();
    }

    const result = await connection.invoke<T>(methodName, ...args);
    return { data: result };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (message.includes('No connection')) {
      return { error: 'Brak połączenia z serwerem' };
    }
    if (message.includes('timeout')) {
      return { error: 'Przekroczono czas oczekiwania na odpowiedź serwera' };
    }

    return { error: message };
  }
}

interface SignalRState {
  connection: HubConnection | null;
  game: Game | null;
  publicGames: Game[];
  connectionError: string | null;
  errorPassword: string | null;
  errorCode: string | null;
}

export const useSignalRStore = defineStore({
  id: 'signalRStore',
  state: (): SignalRState => ({
    connection: null,
    game: null,
    publicGames: [],
    connectionError: null,
    errorCode: null,
    errorPassword: null,
  }),

  getters: {},

  actions: {
    async disconnect() {
      if (this.connection) {
        try {
          await this.connection?.stop();
        } catch (e) {
          console.error('Error while stopping connection:', e);
        }
      }

      this.connection = null;
      this.game = null;
    },

    async connect() {
      this.connection = new HubConnectionBuilder()
        .withUrl(BASE_URL_PSYCH, {
          accessTokenFactory: () => useUserStore().getAccessToken(),
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Warning)
        .build();

      this.connection?.on('PlayerLeft', (playerId: number) => {
        if (!this.game) {
          return;
        }

        this.game.users = this.game.users.filter((p: User) => p.userId !== playerId);
      });

      this.connection?.on('RoomClosed', () => {
        this.game = null;
      });

      this.connection?.on('LoadRoom', (game: Game) => {
        this.game = plainToInstance(Game, game);
      });

      this.connection?.on('ReceiveError', error => {
        if (error.fieldId === 'code') {
          this.errorCode = error.message;
        } else {
          this.errorPassword = error.message;
        }
      });

      this.connection?.on('GetPublicRooms', (games: Game[]) => {
        this.publicGames = plainToInstance(Game, games);
      });

      await this.connection?.start();
    },

    async joinRoom(
      gameCode: string,
      player: User,
      password: string,
      ownerId: number | null = null
    ) {
      const connection = this.connection as HubConnection | null;
      const result = await safeSignalRInvoke(
        connection,
        'JoinRoom',
        gameCode,
        instanceToPlain(player),
        password,
        ownerId
      );
      this.connectionError = result.error ?? null;
      return !this.connectionError;
    },

    async createRoom(game: Game) {
      this.game = game;
      const connection = this.connection as HubConnection | null;
      const result = await safeSignalRInvoke(connection, 'CreateRoom', instanceToPlain(this.game));
      this.connectionError = result.error ?? null;
      return !this.connectionError;
    },

    async goToJoinGameView() {
      const connection = this.connection as HubConnection | null;
      const result = await safeSignalRInvoke(connection, 'GoToJoinGameView');
      this.connectionError = result.error ?? null;
      return !this.connectionError;
    },

    async editRoom(game: Game) {
      this.game = game;
      const connection = this.connection as HubConnection | null;
      const result = await safeSignalRInvoke(connection, 'EditRoom', instanceToPlain(game));
      this.connectionError = result.error ?? null;
      return !this.connectionError;
    },

    async setTeam(playerId: number, teamId: number | null) {
      if (!this.game) {
        return;
      }

      const connection = this.connection as HubConnection | null;
      const result = await safeSignalRInvoke(
        connection,
        'SetTeam',
        this.game.code,
        playerId,
        teamId
      );
      this.connectionError = result.error ?? null;
      return !this.connectionError;
    },

    async setStatus(playerId: number, status: boolean) {
      if (!this.game) {
        return;
      }

      const connection = this.connection as HubConnection | null;
      const result = await safeSignalRInvoke(
        connection,
        'SetStatus',
        this.game.code,
        playerId,
        status
      );
      this.connectionError = result.error ?? null;
      return !this.connectionError;
    },

    async leaveRoom(playerId: number) {
      if (!this.game) {
        return;
      }

      const connection = this.connection as HubConnection | null;
      const result = await safeSignalRInvoke(connection, 'LeaveRoom', this.game.code, playerId);
      this.connectionError = result.error ?? null;
      return !this.connectionError;
    },

    async addPrivateQuestionsToGame(playerId: number, questions: Question[]) {
      if (!this.game) {
        return false;
      }

      const connection = this.connection as HubConnection | null;
      const result = await safeSignalRInvoke(
        connection,
        'AddPrivateQuestionsToGame',
        this.game.code,
        playerId,
        instanceToPlain(questions)
      );
      this.connectionError = result.error ?? null;
      return !this.connectionError;
    },

    async startGame() {
      if (!this.game) {
        return;
      }

      const connection = this.connection as HubConnection | null;
      const result = await safeSignalRInvoke(connection, 'StartGame', this.game.code);
      this.connectionError = result.error ?? null;
      return !this.connectionError;
    },

    async skipRound() {
      if (!this.game) {
        return;
      }

      const connection = this.connection as HubConnection | null;
      const result = await safeSignalRInvoke(connection, 'SkipRound', this.game.code);
      this.connectionError = result.error ?? null;
      return !this.connectionError;
    },

    async addAnswer(answer: Answer) {
      if (!this.game) {
        return;
      }

      const connection = this.connection as HubConnection | null;
      const result = await safeSignalRInvoke(
        connection,
        'AddAnswer',
        this.game.code,
        instanceToPlain(answer)
      );
      this.connectionError = result.error ?? null;
      return !this.connectionError;
    },

    async markAllUsersUnready() {
      if (!this.game) {
        return;
      }

      const connection = this.connection as HubConnection | null;
      const result = await safeSignalRInvoke(connection, 'MarkAllUsersUnready', this.game.code);
      this.connectionError = result.error ?? null;
      return !this.connectionError;
    },

    async setNewRound(playerId: number) {
      if (!this.game || this.game.owner.userId !== playerId) {
        return;
      }

      const connection = this.connection as HubConnection | null;
      const result = await safeSignalRInvoke(connection, 'SetNewRound', this.game.code);
      this.connectionError = result.error ?? null;
      return !this.connectionError;
    },

    async chooseAnswer(playerId: number, selectedAnswerUserIds: number[]) {
      if (!this.game) {
        return;
      }

      const connection = this.connection as HubConnection | null;
      const result = await safeSignalRInvoke(
        connection,
        'ChooseAnswer',
        this.game.code,
        playerId,
        selectedAnswerUserIds
      );
      this.connectionError = result.error ?? null;
      return !this.connectionError;
    },
  },
});
