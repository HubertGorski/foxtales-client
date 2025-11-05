import { Question } from '@/models/Question';
import type { Catalog } from '@/models/Catalog';
import { psychClient } from '../clients/PsychClient';

export const psychService = {
  async addQuestion(question: Question): Promise<number> {
    return (await psychClient.addQuestion(question)).data;
  },

  async removeQuestion(questionId: number): Promise<boolean> {
    return await psychClient.removeQuestion(questionId);
  },

  async removeQuestions(questionsIds: number[]): Promise<boolean> {
    return await psychClient.removeQuestions(questionsIds);
  },

  async addCatalog(catalog: Catalog): Promise<number> {
    return (await psychClient.addCatalog(catalog)).data;
  },

  async editCatalog(catalog: Catalog): Promise<number> {
    return await psychClient.editCatalog(catalog);
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
};
