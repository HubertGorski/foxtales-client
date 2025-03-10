import { createRouter, createWebHistory } from "vue-router";
import { ROUTE_NAME, ROUTE_PATH } from "./routeEnums";
import HomeViewVue from "@/views/HomeView.vue";
import LoginViewVue from "@/views/LoginView.vue";
import RegisterViewVue from "@/views/RegisterView.vue";
import MenuViewVue from "@/views/MenuView.vue";
import SettingsViewVue from "@/views/SettingsView.vue";
import JoinGameViewVue from "@/views/JoinGameView.vue";
import LobbyViewVue from "@/views/LobbyView.vue";
import CreateGameViewVue from "@/views/CreateGameView.vue";
import LibraryViewVue from "@/views/LibraryView.vue";
import ChooseGameViewVue from "@/views/ChooseGameView.vue";
import { useUserStore } from "@/stores/userStore";
import { ROLE } from "@/enums/rolesEnum";
import NoAccessViewVue from "@/views/NoAccessView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: ROUTE_PATH.LOGIN,
      name: ROUTE_NAME.LOGIN,
      component: LoginViewVue,
    },
    {
      path: ROUTE_PATH.REGISTER,
      name: ROUTE_NAME.REGISTER,
      component: RegisterViewVue,
    },
    {
      path: ROUTE_PATH.HOME,
      name: ROUTE_NAME.HOME,
      component: HomeViewVue,
    },
    {
      path: ROUTE_PATH.MENU,
      name: ROUTE_NAME.MENU,
      component: MenuViewVue,
    },
    {
      path: ROUTE_PATH.SETTINGS,
      name: ROUTE_NAME.SETTINGS,
      component: SettingsViewVue,
    },
    {
      path: ROUTE_PATH.JOIN_GAME,
      name: ROUTE_NAME.JOIN_GAME,
      component: JoinGameViewVue,
    },
    {
      path: ROUTE_PATH.LOBBY,
      name: ROUTE_NAME.LOBBY,
      component: LobbyViewVue,
    },
    {
      path: ROUTE_PATH.CREATE_GAME,
      name: ROUTE_NAME.CREATE_GAME,
      component: CreateGameViewVue,
      meta: {
        requiredGameSelected: true,
      },
    },
    {
      path: ROUTE_PATH.CREATE_GAME_DYLEMATY,
      name: ROUTE_NAME.CREATE_GAME_DYLEMATY,
      component: CreateGameViewVue,
    },
    {
      path: ROUTE_PATH.CREATE_GAME_PSYCH,
      name: ROUTE_NAME.CREATE_GAME_PSYCH,
      component: CreateGameViewVue,
    },
    {
      path: ROUTE_PATH.LIBRARY,
      name: ROUTE_NAME.LIBRARY,
      component: LibraryViewVue,
      meta: {
        requiredGameSelected: true,
      },
    },
    {
      path: ROUTE_PATH.LIBRARY_DYLEMATY,
      name: ROUTE_NAME.LIBRARY_DYLEMATY,
      component: LibraryViewVue,
    },
    {
      path: ROUTE_PATH.LIBRARY_PSYCH,
      name: ROUTE_NAME.LIBRARY_PSYCH,
      component: LibraryViewVue,
    },
    {
      path: ROUTE_PATH.CHOOSE_GAME,
      name: ROUTE_NAME.CHOOSE_GAME,
      component: ChooseGameViewVue,
    },
    {
      path: ROUTE_PATH.NO_ACCESS,
      name: ROUTE_NAME.NO_ACCESS,
      component: NoAccessViewVue,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const isGameSelected = sessionStorage.getItem("isGameSelected") === "true";
  if (to.meta.requiredGameSelected && !isGameSelected) {
    sessionStorage.setItem("targetUrl", to.fullPath);
    next(ROUTE_PATH.CHOOSE_GAME);
  } else if (to.meta.requiresAuth && !isAdmin()) {
    next(ROUTE_PATH.NO_ACCESS);
  } else {
    sessionStorage.removeItem("isGameSelected");
    next();
  }
});

function isAdmin() {
  return useUserStore().user.role === ROLE.ADMIN ;
}

export default router;
