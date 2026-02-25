import { apiClient } from '../Client';
import type { Question } from '@/models/Question';
import type { Catalog } from '@/models/Catalog';
import { instanceToPlain } from 'class-transformer';
import type { CatalogTranslations } from '@/models/CatalogTranslations';
import { LangToNumber, type LANG } from '@/enums/languagesEnum';

export const psychClient = {
  addQuestion(newQuestion: Question): Promise<{ data: number }> {
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
};
