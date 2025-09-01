import type { Avatar } from "@/models/Avatar";
import { apiClient } from "../Client";
import type { User } from "@/models/User";
import type { FoxGame } from "@/models/FoxGame";
import type { Question } from "@/models/Question";
import type { Catalog } from "@/models/Catalog";
import { instanceToPlain } from "class-transformer";
import type { CatalogType } from "@/models/CatalogType";

export const UserClient = {
  logout(): Promise<string> {
    return apiClient.post("/user/logout");
  },

  login(
    email: string,
    password: string
  ): Promise<{
    data: {
      user: User;
      avatars: Avatar[];
      foxGames: FoxGame[];
      availableCatalogTypes: CatalogType[];
      publicQuestions: Question[];
    };
  }> {
    return apiClient.post("/user/login", { email, password });
  },

  register(
    email: string,
    username: string,
    password: string,
    confirmPassword: string
  ) {
    return apiClient.post("/user/register", {
      email,
      username,
      password,
      confirmPassword,
    });
  },

  setAvatar(avatarId: number): Promise<boolean> {
    return apiClient.post("/user/setAvatar", { avatarId });
  },

  setUsername(username: string): Promise<boolean> {
    return apiClient.post("/user/setUsername", { username });
  },

  addQuestion(newQuestion: Question): Promise<{ data: number }> {
    const question = instanceToPlain(newQuestion);
    return apiClient.post("/user/addQuestion", { question });
  },

  removeQuestion(questionId: number): Promise<boolean> {
    return apiClient.post("/user/removeQuestion", { questionId });
  },

  removeQuestions(questionsIds: number[]): Promise<boolean> {
    return apiClient.post("/user/removeQuestions", { questionsIds });
  },

  addCatalog(newCatalog: Catalog): Promise<{ data: number }> {
    const catalog = instanceToPlain(newCatalog);
    catalog.questions = [];
    return apiClient.post("/user/addCatalog", { catalog });
  },

  editCatalog(editCatalog: Catalog): Promise<number> {
    const catalog = instanceToPlain(editCatalog);
    return apiClient.post("/user/editCatalog", { catalog });
  },

  removeCatalog(catalogId: number): Promise<boolean> {
    return apiClient.post("/user/removeCatalog", { catalogId });
  },

  getUserCatalogs(): Promise<{ data: Catalog[] }> {
    return apiClient.get("/user/getUserCatalogs");
  },

  assignedQuestionsToCatalogs(
    questionsIds: number[],
    catalogsIds: number[]
  ): Promise<{ data: boolean }> {
    return apiClient.post("/user/assignedQuestionsToCatalogs", {
      questionsIds,
      catalogsIds,
    });
  },
};
