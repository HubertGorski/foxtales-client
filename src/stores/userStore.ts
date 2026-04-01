import { defineStore } from 'pinia';
import { User } from '@/models/User';
import { Avatar } from '@/models/Avatar';
import type { LANG } from '@/enums/languagesEnum';
import type { Catalog } from '@/models/Catalog';
import type { Question } from '@/models/Question';
import type { PERMISSION, PERMISSION_GAME } from '@/enums/permissions';
import type { CatalogType } from '@/models/CatalogType';
import type { Memory } from '@/models/Memory';

interface UserState {
  user: User;
  avatars: Avatar[];
  availableCatalogType: CatalogType[];
  publicCatalogs: Catalog[];
  connectionError: string | null;
}

export const useUserStore = defineStore({
  id: 'userStore',
  state: (): UserState => ({
    user: new User(),
    avatars: [],
    availableCatalogType: [],
    publicCatalogs: [],
    connectionError: null,
  }),

  getters: {
    getAccessToken: state => () => {
      return state.user.accessToken;
    },

    getPermissionByName: state => (name: PERMISSION_GAME | PERMISSION) => {
      const permission = state.user.permissions.find(permission => permission.name === name);

      if (!permission) {
        throw new Error(`Invalid permission: ${name}`);
      }

      return permission;
    },

    getAvatar: state => () => {
      return state.user.avatar;
    },

    getAvailableCatalogTypes: state => () => {
      return state.availableCatalogType;
    },

    getFox: state => () => {
      return new URL(`../assets/imgs/${state.user.avatar.id}.webp`, import.meta.url).href;
    },
  },

  actions: {
    setPublicCatalogs(publicCatalogs: Catalog[]) {
      this.publicCatalogs = publicCatalogs;
    },

    setAvailableCatalogTypes(availableCatalogType: CatalogType[]) {
      this.availableCatalogType = availableCatalogType;
    },

    setAvatars(avatars: Avatar[]) {
      this.avatars = avatars;
    },

    setMemories(memories: Memory[]) {
      this.user.memories = memories;
    },

    setUserSession(user: User) {
      this.user = user;
    },

    setAccessToken(accessToken: string) {
      this.user.accessToken = accessToken;
    },

    setUsername(newUsername: string) {
      this.user.username = newUsername;
    },

    setAvatar(newAvatar: Avatar) {
      this.user.avatar = newAvatar;
    },

    setConnectionError(connectionError: string | null) {
      this.connectionError = connectionError;
    },

    setLanguage(newLanguage: LANG) {
      this.user.language = newLanguage;
    },

    addCatalog(newCatalog: Catalog) {
      this.user.catalogs.unshift(newCatalog);
    },

    addReceivedCatalog(newCatalog: Catalog) {
      this.user.receivedCatalogs.unshift(newCatalog);
    },

    editCatalog(catalog: Catalog) {
      const index = this.user.catalogs.findIndex(
        userCatalog => userCatalog.catalogId === catalog.catalogId
      );
      if (index !== -1) {
        this.user.catalogs[index] = catalog;
      }
    },

    assignedQuestionsToCatalogs(questionIds: number[], catalogIds: (number | null)[]) {
      const questionsToAssign = this.user.questions.filter(
        q => q.id != null && questionIds.includes(q.id)
      );

      this.user.catalogs.forEach(catalog => {
        if (catalog.catalogId != null && catalogIds.includes(catalog.catalogId)) {
          questionsToAssign.forEach(question => {
            const alreadyExists = catalog.questions.some(q => q.id === question.id);
            if (!alreadyExists && catalog.catalogId != null) {
              catalog.questions.push(question);
              question.catalogIds.push(catalog.catalogId);
            }
          });
        }
      });
    },

    addQuestion(newQuestion: Question) {
      this.user.questions.unshift(newQuestion);
    },

    unassignQuestionFromCatalog(questionId: number, catalogId: number) {
      const catalog = this.user.catalogs.find(c => c.catalogId === catalogId);
      if (catalog) {
        catalog.questions = catalog.questions.filter(question => question.id !== questionId);
      }
    },

    unassignCatalogFromQuestions(questionsIds: (number | null)[], catalogId: number) {
      questionsIds.forEach(questionId => {
        const question = this.user.questions.find(q => q.id === questionId);
        if (question == null) {
          return;
        }

        question.catalogIds = question.catalogIds.filter(id => id !== catalogId);
      });
    },

    unassignCatalogFromAllQuestions(catalogId: number) {
      this.user.questions.forEach(question => {
        question.catalogIds = question.catalogIds.filter(id => id !== catalogId);
      });
    },

    removeQuestion(questionId: number) {
      const question = this.user.questions.find(q => q.id === questionId);
      if (question == null) {
        return;
      }

      question.catalogIds.forEach(catalogId => {
        this.unassignQuestionFromCatalog(questionId, catalogId);
      });

      this.user.questions = this.user.questions.filter(question => question.id !== questionId);
    },

    removeCatalog(catalogId: number) {
      this.unassignCatalogFromAllQuestions(catalogId);
      this.user.catalogs = this.user.catalogs.filter(catalog => catalog.catalogId !== catalogId);
    },

    removeMemory(shareKey: string, round: number) {
      this.user.memories = this.user.memories.filter(
        memory => memory.shareKey !== shareKey || memory.round !== round
      );
    },

    addMemory(memory: Memory) {
      this.user.memories.unshift(memory);
    },

    revealUsersInMemory(shareKey: string, round: number) {
      const memory = this.user.memories.find(m => m.shareKey === shareKey && m.round === round);
      if (memory) memory.areUsersHidden = false;
    },
  },
});
