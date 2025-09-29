import { apiClient } from "../Client";
import type { Question } from "@/models/Question";
import type { Catalog } from "@/models/Catalog";
import { instanceToPlain } from "class-transformer";

export const psychClient = {
  addQuestion(newQuestion: Question): Promise<{ data: number }> {
    const question = instanceToPlain(newQuestion);
    return apiClient.post("/psych/addQuestion", { question });
  },

  removeQuestion(questionId: number): Promise<boolean> {
    return apiClient.post("/psych/removeQuestion", { questionId });
  },

  removeQuestions(questionsIds: number[]): Promise<boolean> {
    return apiClient.post("/psych/removeQuestions", { questionsIds });
  },

  addCatalog(newCatalog: Catalog): Promise<{ data: number }> {
    const catalog = instanceToPlain(newCatalog);
    catalog.questions = [];
    return apiClient.post("/psych/addCatalog", { catalog });
  },

  editCatalog(editCatalog: Catalog): Promise<number> {
    const catalog = instanceToPlain(editCatalog);
    return apiClient.post("/psych/editCatalog", { catalog });
  },

  removeCatalog(catalogId: number): Promise<boolean> {
    return apiClient.post("/psych/removeCatalog", { catalogId });
  },

  assignedQuestionsToCatalogs(
    questionsIds: number[],
    catalogsIds: (number | null)[]
  ): Promise<{ data: boolean }> {
    return apiClient.post("/psych/assignedQuestionsToCatalogs", {
      questionsIds,
      catalogsIds,
    });
  },
};
