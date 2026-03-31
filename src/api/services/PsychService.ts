import { Question } from '@/models/Question';
import { Catalog } from '@/models/Catalog';
import { psychClient } from '../clients/PsychClient';
import { plainToInstance } from 'class-transformer';
import { CatalogTranslations } from '@/models/CatalogTranslations';
import type { LANG } from '@/enums/languagesEnum';
import { QuestionTranslations } from '@/models/QuestionTranslations';
import type { Memory } from '@/models/Memory';

export const psychService = {
  async addMemory(memory: Memory): Promise<void> {
    await psychClient.addMemory(memory);
  },

  async addMemoryToLibrary(shareKey: string, round: number, userId: number): Promise<void> {
    await psychClient.addMemoryToLibrary(shareKey, round, userId);
  },

  async removeMemoryFromLibrary(shareKey: string, round: number, userId: number): Promise<boolean> {
    return (await psychClient.removeMemoryFromLibrary(shareKey, round, userId)).data;
  },

  async addQuestion(
    question: Question
  ): Promise<{ translations: QuestionTranslations[]; questionId: number }> {
    const response = (await psychClient.addQuestion(question)).data;

    return {
      ...response,
      translations: plainToInstance(QuestionTranslations, response.translations),
    };
  },

  async removeQuestion(questionId: number): Promise<boolean> {
    return await psychClient.removeQuestion(questionId);
  },

  async removeQuestions(questionsIds: number[]): Promise<boolean> {
    return await psychClient.removeQuestions(questionsIds);
  },

  async addCatalog(
    catalog: Catalog
  ): Promise<{ translations: CatalogTranslations[]; catalogId: number }> {
    const response = (await psychClient.addCatalog(catalog)).data;

    return {
      ...response,
      translations: plainToInstance(CatalogTranslations, response.translations),
    };
  },

  async editCatalog(
    catalog: Catalog,
    hasTitleChanged: boolean,
    hasDescriptionChanged: boolean,
    language: LANG
  ): Promise<{ translations: CatalogTranslations[]; catalogId: number }> {
    const response = (
      await psychClient.editCatalog(catalog, hasTitleChanged, hasDescriptionChanged, language)
    ).data;

    return {
      ...response,
      translations: plainToInstance(CatalogTranslations, response.translations),
    };
  },

  async removeCatalog(catalogId: number): Promise<boolean> {
    return await psychClient.removeCatalog(catalogId);
  },

  async assignedQuestionsToCatalogs(
    questionsIds: number[],
    catalogsIds: (number | null)[]
  ): Promise<boolean> {
    return (await psychClient.assignedQuestionsToCatalogs(questionsIds, catalogsIds)).data;
  },

  async regenerateShareKey(catalogId: number): Promise<string> {
    return (await psychClient.regenerateShareKey(catalogId)).data;
  },

  async removeCatalogFollower(catalogId: number, userId: number): Promise<boolean> {
    return (await psychClient.removeCatalogFollower(catalogId, userId)).data;
  },
};
