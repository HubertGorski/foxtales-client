import { apiClient } from '../Client';
import type { Question } from '@/models/Question';
import type { Catalog } from '@/models/Catalog';
import { instanceToPlain } from 'class-transformer';
import type { CatalogTranslations } from '@/models/CatalogTranslations';
import { LangToNumber, type LANG } from '@/enums/languagesEnum';
import type { QuestionTranslations } from '@/models/QuestionTranslations';
import type { Memory } from '@/models/Memory';

export const psychClient = {
  addMemory(newMemory: Memory): Promise<void> {
    const memory = instanceToPlain(newMemory);
    return apiClient.post('/psych/addMemory', { memory });
  },

  addMemoryToLibrary(shareKey: string, round: number, userId: number): Promise<void> {
    return apiClient.post('/psych/addMemoryToLibrary', { shareKey, round, userId });
  },

  removeMemoryFromLibrary(
    shareKey: string,
    round: number,
    userId: number
  ): Promise<{ data: boolean }> {
    return apiClient.post('/psych/removeMemoryFromLibrary', { shareKey, round, userId });
  },

  addQuestion(
    newQuestion: Question
  ): Promise<{ data: { translations: QuestionTranslations[]; questionId: number } }> {
    const question = instanceToPlain(newQuestion);
    return apiClient.post('/psych/addQuestion', { question });
  },

  removeQuestion(questionId: number): Promise<boolean> {
    return apiClient.post('/psych/removeQuestion', { questionId });
  },

  removeQuestions(questionsIds: number[]): Promise<boolean> {
    return apiClient.post('/psych/removeQuestions', { questionsIds });
  },

  addCatalog(
    newCatalog: Catalog
  ): Promise<{ data: { translations: CatalogTranslations[]; catalogId: number } }> {
    const catalog = instanceToPlain(newCatalog);
    catalog.questions = [];
    return apiClient.post('/psych/addCatalog', { catalog });
  },

  editCatalog(
    editCatalog: Catalog,
    hasTitleChanged: boolean,
    hasDescriptionChanged: boolean,
    language: LANG
  ): Promise<{ data: { translations: CatalogTranslations[]; catalogId: number } }> {
    const catalog = instanceToPlain(editCatalog);
    const sourceLanguage = LangToNumber[language];
    return apiClient.post('/psych/editCatalog', {
      catalog,
      hasTitleChanged,
      hasDescriptionChanged,
      sourceLanguage,
    });
  },

  removeCatalog(catalogId: number): Promise<boolean> {
    return apiClient.post('/psych/removeCatalog', { catalogId });
  },

  assignedQuestionsToCatalogs(
    questionsIds: number[],
    catalogsIds: (number | null)[]
  ): Promise<{ data: boolean }> {
    return apiClient.post('/psych/assignedQuestionsToCatalogs', {
      questionsIds,
      catalogsIds,
    });
  },

  regenerateShareKey(catalogId: number): Promise<{ data: string }> {
    return apiClient.post('/psych/regenerateShareKey', { catalogId });
  },

  generateShareKey(): Promise<{ data: string }> {
    return apiClient.post('/psych/generateShareKey');
  },

  removeCatalogFollower(catalogId: number, userId: number): Promise<{ data: boolean }> {
    return apiClient.post('/psych/removeCatalogFollower', { catalogId, userId });
  },

  addCatalogFollower(shareKey: string, userId: number): Promise<void> {
    return apiClient.post('/psych/addCatalogFollower', { shareKey, userId });
  },

  getCatalogForShare(shareKey: string): Promise<{ data: Catalog }> {
    return apiClient.get(`/psych/getCatalogForShare/${shareKey}`);
  },
};
